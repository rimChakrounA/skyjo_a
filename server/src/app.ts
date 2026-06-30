import cors from 'cors';
import express, { type Express } from 'express';
import { config } from './config.js';
import { errorHandler } from './middleware/errorHandler.js';
import { authRouter } from './routes/auth.js';
import { gamesRouter } from './routes/games.js';
import { healthRouter } from './routes/health.js';
import { profileRouter } from './routes/profile.js';

/** Construit l'application Express avec ses middlewares et ses routes REST. */
export function createApp(): Express {
  const app = express();

  app.use(cors({ origin: config.clientOrigin }));
  app.use(express.json());

  app.use('/api', healthRouter);
  app.use('/api', gamesRouter);
  app.use('/api/auth', authRouter);
  app.use('/api', profileRouter);

  app.use(errorHandler);

  return app;
}
