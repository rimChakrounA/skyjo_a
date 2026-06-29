import { Router } from 'express';
import { getGame } from '../controllers/games.js';

export const gamesRouter = Router();

gamesRouter.get('/games/:id', getGame);
