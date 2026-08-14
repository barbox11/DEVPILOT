import { beforeEach, describe, expect, it, vi } from "vitest";
import bcrypt from "bcryptjs";

vi.mock("../lib/prisma.js", () => ({
  getPrisma: () => prismaMock,
}));

const prismaMock = {
  session: {
    create: vi.fn(),
    deleteMany: vi.fn(),
  },
  user: {
    findUnique: vi.fn(),
    create: vi.fn(),
  },
};

import { getCurrentUser, login, logout, register } from "./authService.js";

describe("authService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("register", () => {
    it("crea un usuario con contraseña cifrada y devuelve sesión", async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);
      prismaMock.user.create.mockResolvedValue({
        id: "u1",
        email: "ana@ejemplo.com",
        name: "Ana",
        role: "MEMBER",
      });
      prismaMock.session.create.mockResolvedValue({
        token: "token-1",
        expiresAt: new Date(),
      });

      const result = await register({
        name: " Ana ",
        email: "ANA@ejemplo.com",
        password: "contraseña123",
      });

      expect(result.user.email).toBe("ana@ejemplo.com");
      expect(result.user.name).toBe("Ana");
      expect(result.token).toHaveLength(64);

      const created = prismaMock.user.create.mock.calls[0][0].data;
      expect(created.email).toBe("ana@ejemplo.com");
      expect(created.passwordHash).not.toBe("contraseña123");
      expect(await bcrypt.compare("contraseña123", created.passwordHash)).toBe(
        true,
      );
    });

    it("rechaza un correo ya registrado", async () => {
      prismaMock.user.findUnique.mockResolvedValue({ id: "u1" });

      await expect(
        register({
          name: "Ana",
          email: "ana@ejemplo.com",
          password: "contraseña123",
        }),
      ).rejects.toMatchObject({ status: 409 });
      expect(prismaMock.user.create).not.toHaveBeenCalled();
    });
  });

  describe("login", () => {
    it("devuelve sesión con credenciales válidas", async () => {
      const hash = await bcrypt.hash("contraseña123", 4);
      prismaMock.user.findUnique.mockResolvedValue({
        id: "u1",
        email: "ana@ejemplo.com",
        name: "Ana",
        role: "MEMBER",
        passwordHash: hash,
      });
      prismaMock.session.create.mockResolvedValue({
        token: "token-2",
        expiresAt: new Date(),
      });

      const result = await login({
        email: "ana@ejemplo.com",
        password: "contraseña123",
      });

      expect(result.user.id).toBe("u1");
      expect(result.token).toHaveLength(64);
      expect(prismaMock.session.create).toHaveBeenCalled();
    });

    it("rechaza contraseña incorrecta", async () => {
      const hash = await bcrypt.hash("contraseña123", 4);
      prismaMock.user.findUnique.mockResolvedValue({
        id: "u1",
        email: "ana@ejemplo.com",
        name: "Ana",
        role: "MEMBER",
        passwordHash: hash,
      });

      await expect(
        login({ email: "ana@ejemplo.com", password: "incorrecta" }),
      ).rejects.toMatchObject({ status: 401 });
      expect(prismaMock.session.create).not.toHaveBeenCalled();
    });

    it("rechaza un usuario inexistente", async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);

      await expect(
        login({ email: "nadie@ejemplo.com", password: "contraseña123" }),
      ).rejects.toMatchObject({ status: 401 });
    });
  });

  describe("logout", () => {
    it("elimina la sesión por token", async () => {
      prismaMock.session.deleteMany.mockResolvedValue({ count: 1 });
      await expect(logout("token-1")).resolves.toBeUndefined();
      expect(prismaMock.session.deleteMany).toHaveBeenCalledWith({
        where: { token: "token-1" },
      });
    });
  });

  describe("getCurrentUser", () => {
    it("devuelve el usuario existente", async () => {
      prismaMock.user.findUnique.mockResolvedValue({
        id: "u1",
        email: "ana@ejemplo.com",
        name: "Ana",
        role: "MEMBER",
      });

      const user = await getCurrentUser("u1");
      expect(user.id).toBe("u1");
    });

    it("lanza 401 si el usuario no existe", async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);
      await expect(getCurrentUser("desconocido")).rejects.toMatchObject({
        status: 401,
      });
    });
  });
});
