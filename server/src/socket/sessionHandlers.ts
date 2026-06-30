import { setRoomPlayerConnected } from '../services/roomService.js';
import { toRoomSummary } from '../services/room.js';
import { roomStore } from '../services/roomStore.js';
import { sessionStore } from '../services/sessionStore.js';
import { errorMessage, fail, ok } from './ack.js';
import { emitRoomUpdate } from './roomHandlers.js';
import type { TypedServer, TypedSocket } from './types.js';

/**
 * Enregistre le gestionnaire de restauration de session.
 * Permet à un joueur de reprendre sa place après une déconnexion involontaire.
 */
export function registerSessionHandlers(io: TypedServer, socket: TypedSocket): void {
  socket.on('session:restore', (payload, ack) => {
    try {
      const entry = sessionStore.get(payload.sessionToken);
      if (entry === undefined) {
        ack(fail('Session expirée ou introuvable.'));
        return;
      }

      const room = roomStore.get(entry.roomCode);
      if (room === undefined) {
        sessionStore.delete(payload.sessionToken);
        ack(fail('La salle n\'existe plus.'));
        return;
      }

      const isInRoom = room.players.some((p) => p.id === entry.playerId);
      if (!isInRoom) {
        sessionStore.delete(payload.sessionToken);
        ack(fail('Vous avez été retiré de la salle.'));
        return;
      }

      // Associer le nouveau socket à l'identité persistante du joueur
      socket.data.roomCode = entry.roomCode;
      socket.data.playerId = entry.playerId;
      void socket.join(entry.roomCode);
      sessionStore.cancelExpiry(payload.sessionToken);

      setRoomPlayerConnected(room, entry.playerId, true);
      if (room.game !== null) {
        room.game.setPlayerConnected(entry.playerId, true);
      }

      ack(ok({
        room: toRoomSummary(room),
        playerId: entry.playerId,
        sessionToken: payload.sessionToken,
      }));

      emitRoomUpdate(io, room);
      if (room.status === 'in-game' && room.game !== null) {
        socket.emit('game:state', room.game.publicStateFor(entry.playerId));
      }
    } catch (err) {
      ack(fail(errorMessage(err)));
    }
  });
}
