import { createRoomSchema, joinRoomSchema } from '../schemas/room.js';
import { tryAutoStartLobby } from '../services/lobbyStart.js';
import { createRoom, joinRoom, leaveRoom } from '../services/roomService.js';
import { toRoomSummary, type Room } from '../services/room.js';
import { roomStore } from '../services/roomStore.js';
import { sessionStore } from '../services/sessionStore.js';
import { parsePayload } from '../utils/validate.js';
import { errorMessage, fail, ok } from './ack.js';
import { broadcastGameState } from './gameBroadcast.js';
import type { TypedServer, TypedSocket } from './types.js';

/** Diffuse l'état d'une salle à tous ses membres. */
export function emitRoomUpdate(io: TypedServer, room: Room): void {
  io.to(room.code).emit('room:update', toRoomSummary(room));
}

/** Enregistre les gestionnaires d'événements liés aux salles pour un socket. */
export function registerRoomHandlers(io: TypedServer, socket: TypedSocket): void {
  socket.on('room:create', (payload, ack) => {
    try {
      const { playerName, minPlayers, maxPlayers } = parsePayload(createRoomSchema, payload);
      const config =
        minPlayers !== undefined || maxPlayers !== undefined
          ? { ...(minPlayers !== undefined ? { minPlayers } : {}), ...(maxPlayers !== undefined ? { maxPlayers } : {}) }
          : {};
      const room = createRoom(roomStore, socket.id, playerName, config);
      const sessionToken = sessionStore.create(room.code, socket.id, playerName, socket.data.userId);
      socket.data.roomCode = room.code;
      socket.data.playerId = socket.id;
      void socket.join(room.code);
      ack(ok({ room: toRoomSummary(room), playerId: socket.id, sessionToken }));
    } catch (err) {
      ack(fail(errorMessage(err)));
    }
  });

  socket.on('room:join', async (payload, ack) => {
    try {
      const { code, playerName } = parsePayload(joinRoomSchema, payload);
      const normalizedCode = code.toUpperCase();
      const room = joinRoom(roomStore, normalizedCode, socket.id, playerName);
      const sessionToken = sessionStore.create(room.code, socket.id, playerName, socket.data.userId);
      socket.data.roomCode = room.code;
      socket.data.playerId = socket.id;
      void socket.join(room.code);
      const started = tryAutoStartLobby(room);
      ack(ok({ room: toRoomSummary(room), playerId: socket.id, sessionToken }));
      emitRoomUpdate(io, room);
      if (started) {
        await broadcastGameState(io, room);
      }
    } catch (err) {
      ack(fail(errorMessage(err)));
    }
  });

  socket.on('room:leave', (ack) => {
    try {
      const code = socket.data.roomCode;
      const playerId = socket.data.playerId ?? socket.id;

      if (code !== null) {
        // Supprimer la session lors d'un départ volontaire
        const token = sessionStore.findByPlayer(code, playerId);
        if (token !== undefined) {
          sessionStore.delete(token);
        }
        const room = leaveRoom(roomStore, code, playerId);
        void socket.leave(code);
        socket.data.roomCode = null;
        socket.data.playerId = null;
        ack(ok(null));
        if (room !== null) {
          emitRoomUpdate(io, room);
        }
      } else {
        ack(ok(null));
      }
    } catch (err) {
      ack(fail(errorMessage(err)));
    }
  });
}
