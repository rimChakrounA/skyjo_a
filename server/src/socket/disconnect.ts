import { leaveRoom } from '../services/roomService.js';
import { roomStore } from '../services/roomStore.js';
import { emitRoomUpdate } from './roomHandlers.js';
import type { TypedServer, TypedSocket } from './types.js';

/**
 * Gère la déconnexion d'un socket en lobby.
 * Le joueur est retiré de la salle ; la gestion en cours de partie
 * est assurée par `handleGameDisconnect`.
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
  const playerId = socket.data.playerId ?? socket.id;
  const updated = leaveRoom(roomStore, code, playerId);
  if (updated !== null) {
    emitRoomUpdate(io, updated);
  }
}
