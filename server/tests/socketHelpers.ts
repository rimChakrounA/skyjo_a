import { createServer, type Server as HttpServer } from 'node:http';
import type { AddressInfo } from 'node:net';
import type { ClientToServerEvents, ServerToClientEvents } from '@shared/types/socket.js';
import { io as ioClient, type Socket as ClientSocket } from 'socket.io-client';
import { createApp } from '../src/app.js';
import { registerSocketHandlers } from '../src/socket/handlers.js';
import { createSocketServer } from '../src/socket/io.js';
import type { TypedServer } from '../src/socket/types.js';

/** Socket client typé selon le contrat partagé (inversion des sens d'événements). */
export type TestClient = ClientSocket<ServerToClientEvents, ClientToServerEvents>;

export interface TestEnv {
  httpServer: HttpServer;
  io: TypedServer;
  url: string;
  close: () => Promise<void>;
}

/** Démarre un serveur HTTP + Socket.IO sur un port éphémère pour les tests. */
export async function startTestServer(): Promise<TestEnv> {
  const httpServer = createServer(createApp());
  const io = createSocketServer(httpServer);
  registerSocketHandlers(io);
  await new Promise<void>((resolve) => httpServer.listen(0, resolve));
  const { port } = httpServer.address() as AddressInfo;
  const url = `http://localhost:${port}`;

  const close = async (): Promise<void> => {
    await io.close();
    await new Promise<void>((resolve) => httpServer.close(() => resolve()));
  };

  return { httpServer, io, url, close };
}

/** Ouvre une connexion client et résout lorsque la connexion est établie. */
export function connectClient(url: string): Promise<TestClient> {
  const socket = ioClient(url, { transports: ['websocket'], forceNew: true }) as TestClient;
  return new Promise((resolve) => {
    socket.on('connect', () => resolve(socket));
  });
}

/** Attend la prochaine occurrence d'un événement serveur -> client. */
export function waitFor<E extends keyof ServerToClientEvents>(
  socket: TestClient,
  event: E,
): Promise<Parameters<ServerToClientEvents[E]>> {
  return new Promise((resolve) => {
    socket.once(event, ((...args: unknown[]) => resolve(args as Parameters<ServerToClientEvents[E]>)) as never);
  });
}
