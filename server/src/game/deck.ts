import { DECK_COMPOSITION } from '@shared/constants/game.js';
import type { CardValue } from '@shared/types/game.js';
import type { Rng } from './rng.js';

/** Construit un paquet ordonné de 150 cartes selon la composition officielle. */
export function createDeck(): CardValue[] {
  const deck: CardValue[] = [];
  for (const { value, count } of DECK_COMPOSITION) {
    for (let i = 0; i < count; i++) {
      deck.push(value);
    }
  }
  return deck;
}

/**
 * Mélange un paquet (Fisher-Yates) et renvoie un nouveau tableau.
 * Le RNG est injecté pour garantir le déterminisme en test.
 */
export function shuffle(deck: readonly CardValue[], rng: Rng): CardValue[] {
  const result = [...deck];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const a = result[i] as CardValue;
    const b = result[j] as CardValue;
    result[i] = b;
    result[j] = a;
  }
  return result;
}
