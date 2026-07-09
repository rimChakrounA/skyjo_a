import type { PublicBoardCell } from '@shared/types/game.js';
import { useLayoutEffect, useRef } from 'react';
import type { CardMotion } from '@/utils/cardMotion';
import { inferCardMotion } from '@/utils/cardMotion';

function cellSignature(cell: PublicBoardCell): string {
  if (cell === null) {
    return 'null';
  }
  if (!cell.faceUp) {
    return 'hidden';
  }
  return `up:${cell.value}`;
}

/** Déduit une animation par cellule en comparant l'état précédent du plateau. */
export function useCardMotions(cells: readonly PublicBoardCell[]): CardMotion[] {
  const prevRef = useRef<string[]>(cells.map(cellSignature));
  const motions = cells.map((cell, index) => inferCardMotion(prevRef.current[index], cell));

  useLayoutEffect(() => {
    prevRef.current = cells.map(cellSignature);
  }, [cells]);

  return motions;
}
