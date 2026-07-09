import { MIN_PLAYERS } from '@shared/constants/game.js';
import { setRoomPlayerConnected } from '../services/roomService.js';
import { roomStore } from '../services/roomStore.js';
import { sessionStore } from '../services/sessionStore.js';
import { broadcastGameState } from './gameBroadcast.js';
import { emitRoomUpdate } from './roomHandlers.js';
import type { TypedServer, TypedSocket } from './types.js';

/**
 * Gère la déconnexion d'un joueur pendant une partie.
 * Le joueur est marqué déconnecté et sa session est mise en attente d'expiration.
 * Si trop peu de joueurs restent, la partie est close.
 * Renvoie `true` si la déconnexion a été traitée comme une déconnexion en partie.
 */
export async function handleGameDisconnect(io: TypedServer, socket: TypedSocket): Promise<boolean> {
  const code = socket.data.roomCode;
  if (code === null) {
    return false;
  }
  const room = roomStore.get(code);
  if (room === undefined || room.status !== 'in-game' || room.game === null) {
    return false;
  }

  const playerId = socket.data.playerId ?? socket.id;

  setRoomPlayerConnected(room, playerId, false);
  room.game.setPlayerConnected(playerId, false);

  // Démarrer le compte à rebours d'expiration de la session (5 min)
  const token = sessionStore.findByPlayer(code, playerId);
  if (token !== undefined) {
    sessionStore.startExpiry(token);
  }

  if (room.game.connectedCount() < MIN_PLAYERS) {
    io.to(code).emit('room:closed', {
      reason: 'Trop de joueurs ont quitté : la partie est terminée.',
    });
    roomStore.delete(code);
    return true;
  }

  room.game.skipTurnIfCurrentDisconnected();
  emitRoomUpdate(io, room);
  await broadcastGameState(io, room);
  return true;
}
