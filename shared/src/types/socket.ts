/**
 * Contrat de communication temps réel (Socket.IO) entre le client et le serveur.
 * Source de vérité unique des noms d'événements et de leurs charges utiles.
 */
import type { GameAction } from './actions.js';
import type { PublicGameState } from './game.js';
import type { RoomSummary } from './room.js';

/** Réponse d'accusé de réception standard pour les actions client -> serveur. */
export type AckResponse<T> = { ok: true; data: T } | { ok: false; error: string };

/** Callback d'accusé de réception. */
export type Ack<T> = (response: AckResponse<T>) => void;

export interface CreateRoomPayload {
  playerName: string;
  minPlayers?: number;
  maxPlayers?: number;
}

export interface JoinRoomPayload {
  code: string;
  playerName: string;
}

export interface GameActionPayload {
  action: GameAction;
}

/** Données renvoyées lors de la création, de la jonction ou de la restauration d'une salle. */
export interface RoomJoinedData {
  room: RoomSummary;
  playerId: string;
  /** Token de session permettant la reconnexion transparente. */
  sessionToken: string;
}

/** Raison de fermeture d'une salle. */
export interface RoomClosedData {
  reason: string;
}

export interface RestoreSessionPayload {
  sessionToken: string;
}

/** Événements émis par le client vers le serveur. */
export interface ClientToServerEvents {
  'room:create': (payload: CreateRoomPayload, ack: Ack<RoomJoinedData>) => void;
  'room:join': (payload: JoinRoomPayload, ack: Ack<RoomJoinedData>) => void;
  'room:leave': (ack: Ack<null>) => void;
  'game:start': (ack: Ack<null>) => void;
  'game:action': (payload: GameActionPayload, ack: Ack<null>) => void;
  'game:rematch': (ack: Ack<null>) => void;
  'session:restore': (payload: RestoreSessionPayload, ack: Ack<RoomJoinedData>) => void;
}

/** Événements émis par le serveur vers le client. */
export interface ServerToClientEvents {
  'room:update': (room: RoomSummary) => void;
  'room:closed': (data: RoomClosedData) => void;
  'game:state': (state: PublicGameState) => void;
  'game:error': (data: { message: string }) => void;
  /** Tous les joueurs sont redirigés vers le lobby pour une revanche. */
  'game:rematch': (room: RoomSummary) => void;
}
