import { FastifyInstance } from "fastify";
import { z } from "zod";
import { randomUUID } from "crypto";
import { invokeLambda } from "../services/lambda.service";
import { listScreenshots, getPresignedUrl } from "../services/s3.service";
import { ScreenshotJob } from "../types";

const captureSchema = z.object({
  url: z.string().url({ message: "Debe ser una URL válida" }),
  fullPage: z.boolean().optional().default(true),
  width: z.number().int().min(320).max(3840).optional().default(1280),
  height: z.number().int().min(240).max(2160).optional().default(800),
});

export async function screenshotRoutes(app: FastifyInstance) {
  // POST /screenshots — Solicita una nueva captura
  app.post("/screenshots", async (request, reply) => {
    const parsed = captureSchema.safeParse(request.body);

    if (!parsed.success) {
      return reply.status(400).send({
        error: "Datos inválidos",
        details: parsed.error.flatten(),
      });
    }

    const { url, fullPage, width, height } = parsed.data;
    const jobId = randomUUID();
    const s3Key = `screenshots/${jobId}.png`;

    await invokeLambda({
      jobId,
      url,
      fullPage,
      s3Bucket: process.env.S3_BUCKET_NAME as string,
      s3Key,
    });

    const job: ScreenshotJob = {
      jobId,
      url,
      status: "queued",
      createdAt: new Date().toISOString(),
    };

    return reply.status(202).send(job);
  });

  // GET /screenshots — Lista todas las capturas almacenadas
  app.get("/screenshots", async (request, reply) => {
    const images = await listScreenshots();
    return reply.send({ total: images.length, images });
  });

  // GET /screenshots/:key — URL firmada de una captura específica
  app.get<{ Params: { "*": string } }>(
    "/screenshots/*",
    async (request, reply) => {
      const key = request.params["*"];

      if (!key) {
        return reply.status(400).send({ error: "Clave S3 requerida" });
      }

      try {
        const url = await getPresignedUrl(`screenshots/${key}`);
        return reply.send({ key: `screenshots/${key}`, url });
      } catch {
        return reply.status(404).send({ error: "Imagen no encontrada" });
      }
    },
  );
}
