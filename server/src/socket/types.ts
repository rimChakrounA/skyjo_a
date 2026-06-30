import type { ClientToServerEvents, ServerToClientEvents } from '@shared/types/socket.js';
import type { Server, Socket } from 'socket.io';

/** Événements inter-serveurs (non utilisés : un seul nœud en V1). */
export type InterServerEvents = Record<string, never>;

/** Données attachées à chaque socket. */
export interface SocketData {
  roomCode: string | null;
  /** Identifiant logique du joueur, stable entre reconnexions. */
  playerId: string | null;
}

export type TypedServer = Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;

export type TypedSocket = Socket<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;
