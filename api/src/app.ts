import Fastify from 'fastify';
import cors from '@fastify/cors';
import { screenshotRoutes } from './routes/screenshots.route';

export function buildApp() {
  const app = Fastify({
    logger: {
      transport: {
        target: 'pino-pretty',
        options: { colorize: true },
      },
    },
  });

  // Plugins
  app.register(cors, { origin: true });

  // Health check
  app.get('/health', async () => ({ status: 'ok', ts: new Date().toISOString() }));

  // Rutas
  app.register(screenshotRoutes, { prefix: '/api/v1' });

  return app;
}
