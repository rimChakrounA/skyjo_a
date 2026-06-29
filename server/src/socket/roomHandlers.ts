import { createRoomSchema, joinRoomSchema } from '../schemas/room.js';
import { createRoom, joinRoom, leaveRoom } from '../services/roomService.js';
import { toRoomSummary, type Room } from '../services/room.js';
import { roomStore } from '../services/roomStore.js';
import { parsePayload } from '../utils/validate.js';
import { errorMessage, fail, ok } from './ack.js';
import type { TypedServer, TypedSocket } from './types.js';

/** Diffuse l'état d'une salle à tous ses membres. */
export function emitRoomUpdate(io: TypedServer, room: Room): void {
  io.to(room.code).emit('room:update', toRoomSummary(room));
}

/** Enregistre les gestionnaires d'événements liés aux salles pour un socket. */
export function registerRoomHandlers(io: TypedServer, socket: TypedSocket): void {
  socket.on('room:create', (payload, ack) => {
    try {
      const { playerName } = parsePayload(createRoomSchema, payload);
      const room = createRoom(roomStore, socket.id, playerName);
      socket.data.roomCode = room.code;
      void socket.join(room.code);
      ack(ok({ room: toRoomSummary(room), playerId: socket.id }));
    } catch (err) {
      ack(fail(errorMessage(err)));
    }
  });

  socket.on('room:join', (payload, ack) => {
    try {
      const { code, playerName } = parsePayload(joinRoomSchema, payload);
      const normalizedCode = code.toUpperCase();
      const room = joinRoom(roomStore, normalizedCode, socket.id, playerName);
      socket.data.roomCode = room.code;
      void socket.join(room.code);
      ack(ok({ room: toRoomSummary(room), playerId: socket.id }));
      emitRoomUpdate(io, room);
    } catch (err) {
      ack(fail(errorMessage(err)));
    }
  });

  socket.on('room:leave', (ack) => {
    try {
      const code = socket.data.roomCode;
      if (code === null) {
        ack(ok(null));
        return;
      }
      const room = leaveRoom(roomStore, code, socket.id);
      void socket.leave(code);
      socket.data.roomCode = null;
      ack(ok(null));
      if (room !== null) {
        emitRoomUpdate(io, room);
      }
    } catch (err) {
      ack(fail(errorMessage(err)));
    }
  });
}
