import { GRID_COLS, GRID_ROWS } from '@shared/constants/game.js';
import type { PublicBoardCell } from '@shared/types/game.js';

/** Index de grille pour une colonne (3 lignes × 4 colonnes). */
export function columnIndices(col: number): number[] {
  const indices: number[] = [];
  for (let row = 0; row < GRID_ROWS; row++) {
    indices.push(row * GRID_COLS + col);
  }
  return indices;
}

/** Nombre de colonnes retirées (triples identiques) — toutes les cellules sont vides. */
export function countCompletedColumns(cells: readonly PublicBoardCell[]): number {
  let count = 0;
  for (let col = 0; col < GRID_COLS; col++) {
    const columnCells = columnIndices(col).map((index) => cells[index]);
    if (columnCells.every((cell) => cell === null)) {
      count++;
    }
  }
  return count;
}
