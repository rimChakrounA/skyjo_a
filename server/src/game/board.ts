import { BOARD_SIZE, GRID_COLS, GRID_ROWS } from '@shared/constants/game.js';
import type { Board, BoardCell, CardValue } from '@shared/types/game.js';

/** Crée une grille à partir de 12 cartes, toutes face cachée. */
export function createBoard(cards: readonly CardValue[]): Board {
  if (cards.length !== BOARD_SIZE) {
    throw new Error(`Une grille doit contenir exactement ${BOARD_SIZE} cartes.`);
  }
  return {
    cells: cards.map((value) => ({ value, faceUp: false })),
  };
}

/** Renvoie les index de la grille correspondant à une colonne donnée. */
export function columnIndices(col: number): number[] {
  const indices: number[] = [];
  for (let row = 0; row < GRID_ROWS; row++) {
    indices.push(row * GRID_COLS + col);
  }
  return indices;
}

/** Indique si un index appartient bien à la grille. */
export function isValidCellIndex(index: number): boolean {
  return Number.isInteger(index) && index >= 0 && index < BOARD_SIZE;
}

/** Nombre de cartes face visible dans une grille. */
export function countFaceUp(board: Board): number {
  return board.cells.filter((cell) => cell !== null && cell.faceUp).length;
}

/** Une grille est entièrement résolue si chaque cellule est révélée ou retirée. */
export function isBoardFullyResolved(board: Board): boolean {
  return board.cells.every((cell) => cell === null || cell.faceUp);
}

/** Somme des valeurs des cartes encore présentes et révélées. */
export function boardScore(board: Board): number {
  return board.cells.reduce<number>((sum, cell) => {
    if (cell !== null && cell.faceUp) {
      return sum + cell.value;
    }
    return sum;
  }, 0);
}

/** Révèle toutes les cartes encore cachées d'une grille (fin de manche). */
export function revealAll(board: Board): Board {
  return {
    cells: board.cells.map((cell) => (cell === null ? null : { ...cell, faceUp: true })),
  };
}

/** Remplace une cellule par une nouvelle valeur révélée et renvoie l'ancienne valeur. */
export function replaceCell(
  board: Board,
  index: number,
  value: CardValue,
): { board: Board; previous: CardValue } {
  const cell = board.cells[index];
  if (cell === null || cell === undefined) {
    throw new Error('Impossible de remplacer une cellule vide.');
  }
  const cells = [...board.cells];
  cells[index] = { value, faceUp: true };
  return { board: { cells }, previous: cell.value };
}

/** Révèle une cellule cachée et renvoie la grille mise à jour. */
export function flipCell(board: Board, index: number): Board {
  const cell = board.cells[index];
  if (cell === null || cell === undefined) {
    throw new Error('Impossible de révéler une cellule vide.');
  }
  const cells = [...board.cells];
  cells[index] = { ...cell, faceUp: true } satisfies BoardCell;
  return { cells };
}
