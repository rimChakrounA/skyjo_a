import { BOARD_SIZE } from '@shared/constants/game.js';
import { DEAL_STAGGER_MS } from '@shared/constants/animation.js';
import type { PublicGameState } from '@shared/types/game.js';
import { useEffect, useRef } from 'react';
import { useGameFeel } from '@/contexts/GameFeelContext';
import {
  anchorDeck,
  anchorDiscard,
  anchorHand,
  anchorSlot,
  cellSignature,
  detectClearedColumns,
} from '@/utils/gameAnchors';

async function runDealSequence(
  feel: ReturnType<typeof useGameFeel>,
  gameState: PublicGameState,
): Promise<void> {
  feel.pulseCamera('draw');
  let delay = 0;
  const tasks: Promise<void>[] = [];
  for (const player of gameState.players) {
    for (let index = 0; index < BOARD_SIZE; index++) {
      const toKey = anchorSlot(player.id, index);
      const stagger = delay;
      delay += DEAL_STAGGER_MS + Math.random() * 25;
      tasks.push(
        new Promise<void>((resolve) => window.setTimeout(resolve, stagger)).then(() =>
          feel.launchFlight(anchorDeck(), toKey, { faceUp: false }, {
            arcHeight: -36 - Math.random() * 40,
            sound: 'draw',
          }),
        ),
      );
    }
  }
  await Promise.all(tasks);
}

/** Orchestre les vols de cartes et effets à partir des diffs d'état serveur. */
export function useGameAnimations(
  gameState: PublicGameState | null,
  selfId: string | null,
): void {
  const feel = useGameFeel();
  const prevRef = useRef<PublicGameState | null>(null);
  const busyRef = useRef(false);

  useEffect(() => {
    if (gameState === null) {
      prevRef.current = null;
      return;
    }

    const prev = prevRef.current;
    if (prev === null) {
      prevRef.current = gameState;
      return;
    }

    if (busyRef.current) {
      prevRef.current = gameState;
      return;
    }

    const run = async (): Promise<void> => {
      busyRef.current = true;
      try {
        if (gameState.round > prev.round) {
          feel.resetLayout();
        }

        if (gameState.round > prev.round && gameState.phase === 'initialReveal') {
          await runDealSequence(feel, gameState);
        }

        if (gameState.phase === 'roundOver' && prev.phase !== 'roundOver') {
          feel.pulseCamera('roundEnd');
          feel.playSound('roundWin');
        }

        if (prev.drawnCard === null && gameState.drawnCard !== null) {
          const fromDeck = gameState.deckCount < prev.deckCount;
          const fromKey = fromDeck ? anchorDeck() : anchorDiscard();
          feel.pulseCamera('draw');
          await feel.launchFlight(
            fromKey,
            anchorHand(),
            { faceUp: true, value: gameState.drawnCard },
            { sound: 'draw' },
          );
        }

        if (selfId !== null) {
          const prevSelf = prev.players.find((p) => p.id === selfId);
          const currSelf = gameState.players.find((p) => p.id === selfId);
          if (prevSelf !== undefined && currSelf !== undefined) {
            if (prev.drawnCard !== null && gameState.drawnCard === null) {
              let replaced = false;
              for (let index = 0; index < currSelf.cells.length; index++) {
                const before = prevSelf.cells[index] ?? null;
                const after = currSelf.cells[index] ?? null;
                if (before !== after && after !== null && cellSignature(after).startsWith('up:')) {
                  feel.pulseCamera('swap');
                  await feel.launchFlight(
                    anchorHand(),
                    anchorSlot(selfId, index),
                    currSelf.cells[index] as { faceUp: true; value: number },
                    { sound: 'place' },
                  );
                  replaced = true;
                  break;
                }
              }
              if (!replaced && gameState.discardTop !== prev.discardTop && prev.drawnCard !== null) {
                await feel.launchFlight(
                  anchorHand(),
                  anchorDiscard(),
                  { faceUp: true, value: prev.drawnCard },
                  { sound: 'place' },
                );
              }
            }

            for (let index = 0; index < currSelf.cells.length; index++) {
              const before = prevSelf.cells[index] ?? null;
              const after = currSelf.cells[index] ?? null;
              if (before !== null && !before.faceUp && after !== null && after.faceUp) {
                feel.playSound('flip');
              }
            }
          }
        }

        for (const player of gameState.players) {
          const prevPlayer = prev.players.find((p) => p.id === player.id);
          if (prevPlayer === undefined) {
            continue;
          }
          const cleared = detectClearedColumns(prevPlayer.cells, player.cells);
          for (const col of cleared) {
            await feel.triggerColumnClear(player.id, col);
          }
        }
      } finally {
        busyRef.current = false;
      }
    };

    void run();
    prevRef.current = gameState;
  }, [gameState, selfId, feel]);
}
