import { Router } from 'express';
import { login, me, register } from '../controllers/auth.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.post('/register', (req, res) => void register(req, res));
router.post('/login', (req, res) => void login(req, res));
router.get('/me', requireAuth, me);

export { router as authRouter };
