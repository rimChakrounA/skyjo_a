import type { RoomPlayer, RoomStatus, RoomSummary } from '@shared/types/room.js';
import type { GameSession } from './gameSession.js';

/** Représentation interne d'une salle (source de vérité en mémoire). */
export interface Room {
  code: string;
  hostId: string;
  status: RoomStatus;
  minPlayers: number;
  maxPlayers: number;
  players: RoomPlayer[];
  /** Session de partie active, présente uniquement lorsque le statut est `in-game`. */
  game: GameSession | null;
  /** Indique si la partie terminée a déjà été persistée (évite les doublons). */
  persisted: boolean;
}

/** Convertit une salle interne en résumé destiné aux clients. */
export function toRoomSummary(room: Room): RoomSummary {
  return {
    code: room.code,
    status: room.status,
    hostId: room.hostId,
    minPlayers: room.minPlayers,
    maxPlayers: room.maxPlayers,
    players: room.players.map((player) => ({ ...player })),
  };
}
