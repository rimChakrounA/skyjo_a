import { leaveRoom } from '../services/roomService.js';
import { roomStore } from '../services/roomStore.js';
import { emitRoomUpdate } from './roomHandlers.js';
import type { TypedServer, TypedSocket } from './types.js';

/**
 * Gère la déconnexion d'un socket.
 * En lobby, le joueur est retiré de la salle. La gestion en cours de partie
 * est ajoutée par les gestionnaires de jeu.
 */
export function handleLobbyDisconnect(io: TypedServer, socket: TypedSocket): void {
  const code = socket.data.roomCode;
  if (code === null) {
    return;
  }
  const room = roomStore.get(code);
  if (room === undefined || room.status !== 'lobby') {
    return;
  }
  const updated = leaveRoom(roomStore, code, socket.id);
  if (updated !== null) {
    emitRoomUpdate(io, updated);
  }
}
