import type { RoomSummary } from '@shared/types/room.js';

/** État transmis lors de la navigation vers la page de salle. */
export interface RoomLocationState {
  room: RoomSummary;
}
