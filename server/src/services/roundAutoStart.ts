import { ROUND_OVER_AUTO_START_MS } from '@shared/constants/animation.js';
import { broadcastGameState } from '../socket/gameBroadcast.js';
import { emitRoomUpdate } from '../socket/roomHandlers.js';
import type { TypedServer } from '../socket/types.js';
import type { Room } from './room.js';
import { roomStore } from './roomStore.js';

/** Indique si la manche suivante peut démarrer automatiquement. */
export function isRoundReadyForNext(room: Room): boolean {
  return room.game !== null && room.game.phase === 'roundOver';
}

/** Démarre la manche suivante lorsque la précédente est terminée. Retourne `true` si avancé. */
export function tryAutoStartNextRound(room: Room): boolean {
  if (!isRoundReadyForNext(room)) {
    return false;
  }
  room.game!.nextRound();
  return true;
}

const scheduledTimers = new Map<string, ReturnType<typeof setTimeout>>();

/** Annule le démarrage auto programmé d'une salle. */
export function cancelAutoNextRound(code: string): void {
  const timer = scheduledTimers.get(code);
  if (timer !== undefined) {
    clearTimeout(timer);
    scheduledTimers.delete(code);
  }
}

/** Programme le démarrage auto de la manche suivante après le délai d'affichage. */
export function scheduleAutoNextRound(io: TypedServer, room: Room): void {
  if (!isRoundReadyForNext(room)) {
    return;
  }
  cancelAutoNextRound(room.code);
  const code = room.code;
  const timer = setTimeout(() => {
    scheduledTimers.delete(code);
    const current = roomStore.get(code);
    if (current === undefined || !isRoundReadyForNext(current)) {
      return;
    }
    current.game!.nextRound();
    emitRoomUpdate(io, current);
    void broadcastGameState(io, current);
  }, ROUND_OVER_AUTO_START_MS);
  scheduledTimers.set(code, timer);
}
