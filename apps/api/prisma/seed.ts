import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("devpilot123", 12);

  const user = await prisma.user.upsert({
    where: { email: "demo@devpilot.app" },
    update: {},
    create: {
      email: "demo@devpilot.app",
      name: "Demo DevPilot",
      role: "OWNER",
      passwordHash,
    },
  });

  const projects = await prisma.project.createMany({
    data: [
      {
        name: "web-app",
        repoUrl: "https://github.com/barbox11/web-app",
        defaultBranch: "main",
        ownerId: user.id,
      },
      {
        name: "api-gateway",
        repoUrl: "https://github.com/barbox11/api-gateway",
        defaultBranch: "main",
        ownerId: user.id,
      },
      {
        name: "legacy-crm",
        repoUrl: "https://github.com/barbox11/legacy-crm",
        defaultBranch: "master",
        ownerId: user.id,
      },
    ],
    skipDuplicates: true,
  });

  const project = await prisma.project.findFirstOrThrow({
    where: { ownerId: user.id },
    orderBy: { createdAt: "asc" },
  });

  const analysis = await prisma.analysis.create({
    data: {
      projectId: project.id,
      status: "COMPLETED",
      branch: "main",
      commitSha: "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0",
      startedAt: new Date(),
      completedAt: new Date(),
      healthScore: 78,
      qualityScore: 82,
      securityScore: 71,
      testingScore: 64,
      architectureScore: 88,
      issues: {
        create: [
          {
            severity: "CRITICAL",
            category: "SECURITY",
            file: "apps/api/src/routes/auth.ts",
            lineStart: 12,
            lineEnd: 12,
            title: "Falta rate limiting en el endpoint de login",
            description:
              "El endpoint de autenticación no limita los intentos, lo que permite ataques de fuerza bruta contra contraseñas.",
            recommendation:
              "Introduce rate limiting por IP con reintentos y ventana de bloqueo exponencial antes de devolver 401.",
            suggestedFix:
              "import rateLimit from 'express-rate-limit';\n\nconst loginLimiter = rateLimit({\n  windowMs: 15 * 60 * 1000,\n  max: 5,\n});\n\nrouter.post('/login', loginLimiter, async (req, res) => { ... });",
            status: "OPEN",
          },
          {
            severity: "HIGH",
            category: "SECURITY",
            file: "apps/web/src/lib/api.ts",
            lineStart: 18,
            lineEnd: 22,
            title: "Token de sesión persistido en localStorage",
            description:
              "El token Bearer se guarda en localStorage y queda expuesto a scripts inyectados vía XSS.",
            recommendation:
              "Almacena el token en una cookie httpOnly SameSite=Strict gestionada por el servidor, o usa un storage con memoria + renovación.",
            suggestedFix:
              "document.cookie = `devpilot_token=${token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${60*60*24*30}`;",
            status: "OPEN",
          },
          {
            severity: "MEDIUM",
            category: "TESTING",
            file: "apps/api/src/services/authService.ts",
            lineStart: 40,
            lineEnd: 60,
            title: "Sin test para el flujo de logout",
            description:
              "No existe cobertura de tests para la revocación de sesión al hacer logout.",
            recommendation:
              "Añade un test que verifique que el token se elimina y las llamadas posteriores devuelven 401.",
            suggestedFix:
              "it('revoca la sesión al hacer logout', async () => {\n  const sesion = await authService.login(creds);\n  await authService.logout(sesion.token);\n  await expect(authService.me(sesion.token)).rejects.toThrow();\n});",
            status: "OPEN",
          },
          {
            severity: "LOW",
            category: "QUALITY",
            file: "apps/web/src/lib/api.ts",
            lineStart: 55,
            lineEnd: 57,
            title: "Cuerpos de error sin normalizar",
            description:
              "Cuando la API responde sin JSON, el cliente muestra un mensaje genérico que no ayuda a depurar.",
            recommendation:
              "Centraliza la extracción del mensaje de error y añade el status HTTP al detalle.",
            suggestedFix:
              "const mensaje = res.headers.get('content-type')?.includes('application/json')\n  ? (await res.json()).error?.message\n  : \`HTTP ${res.status}\`;",
            status: "OPEN",
          },
        ],
      },
    },
  });

  const criticalIssue = await prisma.issue.findFirstOrThrow({
    where: {
      analysisId: analysis.id,
      severity: "CRITICAL",
    },
  });

  const securityIssue = await prisma.issue.findFirstOrThrow({
    where: {
      analysisId: analysis.id,
      title: { contains: "localStorage" },
    },
  });

  await prisma.recommendation.createMany({
    data: [
      {
        analysisId: analysis.id,
        issueId: criticalIssue.id,
        title: "Endurece el login contra fuerza bruta",
        body:
          "Aplica rate limiting de 5 intentos por ventana de 15 minutos con bloqueo exponencial y auditoría en el registro de actividad.",
      },
      {
        analysisId: analysis.id,
        issueId: securityIssue.id,
        title: "Mueve el token a cookie httpOnly",
        body:
          "Las cookies httpOnly con SameSite=Strict eliminan la exposición del token a scripts de terceros y reducen el vector XSS.",
      },
      {
        analysisId: analysis.id,
        title: "Amplía la cobertura de tests del auth",
        body:
          "Prioriza tests para logout, expiración de sesión y recuperación de contraseña antes de abrir la fase de auditoría externa.",
      },
    ],
  });

  await prisma.generatedTest.createMany({
    data: [
      {
        analysisId: analysis.id,
        name: "login-rate-limit",
        status: "FAILED",
        durationMs: 320,
        filePath: "apps/api/src/routes/auth.test.ts",
      },
      {
        analysisId: analysis.id,
        name: "logout-revoca-sesion",
        status: "PASSED",
        durationMs: 48,
        filePath: "apps/api/src/services/authService.test.ts",
      },
      {
        analysisId: analysis.id,
        name: "me-con-token-invalido",
        status: "PASSED",
        durationMs: 41,
        filePath: "apps/api/src/services/authService.test.ts",
      },
    ],
  });

  await prisma.activity.createMany({
    data: [
      {
        userId: user.id,
        projectId: project.id,
        analysisId: analysis.id,
        action: "ANALYSIS_COMPLETED",
        metadata: { healthScore: 78 },
      },
      {
        userId: user.id,
        projectId: project.id,
        action: "PROJECT_CREATED",
        metadata: { name: project.name },
      },
      {
        userId: user.id,
        action: "USER_REGISTERED",
        metadata: { email: user.email },
      },
    ],
  });

  const counts = {
    user: await prisma.user.count(),
    projects: await prisma.project.count(),
    analyses: await prisma.analysis.count(),
    issues: await prisma.issue.count(),
    recommendations: await prisma.recommendation.count(),
    generatedTests: await prisma.generatedTest.count(),
    activity: await prisma.activity.count(),
  };

  console.log("Seed completado:", counts);
  console.log(
    "Usuario demo: demo@devpilot.app / devpilot123 (email y contraseña para login)",
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());