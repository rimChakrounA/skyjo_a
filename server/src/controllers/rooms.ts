import type { Request, Response } from 'express';
import { listPublicRooms } from '../services/publicRoomList.js';
import { roomStore } from '../services/roomStore.js';

/** GET /api/rooms — liste publique des salles en lobby et des parties en cours. */
export function listRooms(_req: Request, res: Response): void {
  const rooms = listPublicRooms(roomStore.all());
  res.json({ rooms });
}
