import { handleLobbyDisconnect } from './disconnect.js';
import { handleGameDisconnect } from './gameDisconnect.js';
import { registerGameHandlers } from './gameHandlers.js';
import { registerRoomHandlers } from './roomHandlers.js';
import type { TypedServer } from './types.js';

/** Enregistre l'ensemble des gestionnaires d'événements Socket.IO. */
export function registerSocketHandlers(io: TypedServer): void {
  io.on('connection', (socket) => {
    socket.data.roomCode = null;

    registerRoomHandlers(io, socket);
    registerGameHandlers(io, socket);

    socket.on('disconnect', () => {
      void (async () => {
        const handled = await handleGameDisconnect(io, socket);
        if (!handled) {
          handleLobbyDisconnect(io, socket);
        }
      })();
    });
  });
}
