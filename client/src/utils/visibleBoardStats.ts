import type { PublicBoardCell } from '@shared/types/game.js';

/** Somme et nombre de cartes face visible sur une grille publique. */
export function visibleBoardStats(cells: readonly PublicBoardCell[]): {
  sum: number;
  count: number;
} {
  return cells.reduce(
    (acc, cell) => {
      if (cell !== null && cell.faceUp) {
        return { sum: acc.sum + cell.value, count: acc.count + 1 };
      }
      return acc;
    },
    { sum: 0, count: 0 },
  );
}
