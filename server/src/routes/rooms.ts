import { Router } from 'express';
import { listRooms } from '../controllers/rooms.js';

const router = Router();

router.get('/rooms', listRooms);

export { router as roomsRouter };
