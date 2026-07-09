import type { CardValue } from '@shared/types/game.js';
import { useLayoutEffect, useRef } from 'react';
import type { CardMotion } from '@/utils/cardMotion';

/** Animation d'entrée de la carte en main et de la carte posée sur la défausse. */
export function usePileMotion(
  discardTop: CardValue | null,
  drawnCard: CardValue | null,
): { discardMotion: CardMotion; handMotion: CardMotion } {
  const prevDiscard = useRef<CardValue | null | undefined>(undefined);
  const prevDrawn = useRef<CardValue | null | undefined>(undefined);

  let discardMotion: CardMotion = 'idle';
  let handMotion: CardMotion = 'idle';

  if (prevDiscard.current !== undefined && discardTop !== prevDiscard.current && discardTop !== null) {
    discardMotion = 'discard';
  }

  if (prevDrawn.current !== undefined && drawnCard !== null && prevDrawn.current === null) {
    handMotion = 'hand';
  }

  useLayoutEffect(() => {
    prevDiscard.current = discardTop;
    prevDrawn.current = drawnCard;
  }, [discardTop, drawnCard]);

  return { discardMotion, handMotion };
}
