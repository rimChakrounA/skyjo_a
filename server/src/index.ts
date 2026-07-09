import { createServer } from 'node:http';
import { createApp } from './app.js';
import { config } from './config.js';
import { createSocketServer } from './socket/io.js';
import { registerSocketHandlers } from './socket/handlers.js';
import { sweepExpiredLobbyRooms } from './services/roomIdle.js';
import { roomStore } from './services/roomStore.js';

const LOBBY_SWEEP_INTERVAL_MS = 30_000;

const app = createApp();
const httpServer = createServer(app);
const io = createSocketServer(httpServer);

registerSocketHandlers(io);

const sweepLobbyRooms = (): void => {
  sweepExpiredLobbyRooms(io, roomStore);
};

setInterval(sweepLobbyRooms, LOBBY_SWEEP_INTERVAL_MS);

httpServer.listen(config.port, () => {
  console.log(`Serveur Skyjo démarré sur http://localhost:${config.port}`);
});
