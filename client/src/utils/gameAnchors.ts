import { GRID_COLS } from '@shared/constants/game.js';
import type { PublicBoardCell } from '@shared/types/game.js';
import { columnIndices } from '@/utils/boardColumns';

export function anchorDeck(): string {
  return 'pile:deck';
}

export function anchorDiscard(): string {
  return 'pile:discard';
}

export function anchorHand(): string {
  return 'pile:hand';
}

export function anchorSlot(playerId: string, index: number): string {
  return `slot:${playerId}:${index}`;
}

export function detectClearedColumns(
  prevCells: readonly PublicBoardCell[],
  currCells: readonly PublicBoardCell[],
): number[] {
  const cleared: number[] = [];
  for (let col = 0; col < GRID_COLS; col++) {
    const indices = columnIndices(col);
    const hadCards = indices.some((i) => prevCells[i] !== null);
    const allEmpty = indices.every((i) => currCells[i] === null);
    if (hadCards && allEmpty) {
      cleared.push(col);
    }
  }
  return cleared;
}

export function cellSignature(cell: PublicBoardCell): string {
  if (cell === null) {
    return 'null';
  }
  if (!cell.faceUp) {
    return 'hidden';
  }
  return `up:${cell.value}`;
}
