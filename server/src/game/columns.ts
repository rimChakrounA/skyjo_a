import { GRID_COLS } from '@shared/constants/game.js';
import type { Board, CardValue } from '@shared/types/game.js';
import { columnIndices } from './board.js';

/**
 * Supprime toute colonne dont les trois cartes sont révélées et de valeur identique.
 * Renvoie la grille mise à jour et la liste des cartes retirées (à placer en défausse).
 */
export function removeMatchingColumns(board: Board): { board: Board; removed: CardValue[] } {
  const cells = [...board.cells];
  const removed: CardValue[] = [];

  for (let col = 0; col < GRID_COLS; col++) {
    const indices = columnIndices(col);
    const columnCells = indices.map((index) => cells[index]);

    const allRevealed = columnCells.every((cell) => cell != null && cell.faceUp);
    if (!allRevealed) {
      continue;
    }

    const firstValue = columnCells[0]?.value;
    const allEqual = columnCells.every((cell) => cell?.value === firstValue);
    if (!allEqual) {
      continue;
    }

    for (const index of indices) {
      const cell = cells[index];
      if (cell != null) {
        removed.push(cell.value);
        cells[index] = null;
      }
    }
  }

  return { board: { cells }, removed };
}
