import bcrypt from "bcryptjs";
import { randomBytes } from "node:crypto";
import { getPrisma } from "../lib/prisma.js";
import { httpError } from "../lib/http-error.js";

const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000;
const BCRYPT_ROUNDS = 12;

export type RegisterInput = {
  name: string;
  email: string;
  password: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type AuthResult = {
  user: {
    id: string;
    email: string;
    name: string;
    role: "OWNER" | "MEMBER";
  };
  token: string;
};

async function createSession(userId: string) {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);

  await getPrisma().session.create({
    data: { userId, token, expiresAt },
  });

  return { token, expiresAt };
}

export async function register(input: RegisterInput): Promise<AuthResult> {
  const prisma = getPrisma();
  const email = input.email.trim().toLowerCase();

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw httpError(409, "Ya existe una cuenta con ese correo electrónico");
  }

  const passwordHash = await bcrypt.hash(input.password, BCRYPT_ROUNDS);

  const user = await prisma.user.create({
    data: {
      name: input.name.trim(),
      email,
      passwordHash,
      role: "MEMBER",
    },
    select: { id: true, email: true, name: true, role: true },
  });

  const { token } = await createSession(user.id);

  return { user, token };
}

export async function login(input: LoginInput): Promise<AuthResult> {
  const prisma = getPrisma();
  const email = input.email.trim().toLowerCase();

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw httpError(401, "Credenciales inválidas");
  }

  const valid = await bcrypt.compare(input.password, user.passwordHash);
  if (!valid) {
    throw httpError(401, "Credenciales inválidas");
  }

  const { token } = await createSession(user.id);

  return {
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
    token,
  };
}

export async function logout(token: string) {
  await getPrisma().session.deleteMany({ where: { token } });
}

export async function getCurrentUser(userId: string) {
  const user = await getPrisma().user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, name: true, role: true },
  });
  if (!user) {
    throw httpError(401, "Sesión inválida");
  }
  return user;
}
