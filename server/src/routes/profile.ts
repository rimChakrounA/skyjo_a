import { Router } from 'express';
import { myGames, myStats } from '../controllers/profile.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/users/me/games', requireAuth, (req, res) => void myGames(req, res));
router.get('/users/me/stats', requireAuth, (req, res) => void myStats(req, res));

export { router as profileRouter };
