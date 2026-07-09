import type { PublicBoardCell } from '@shared/types/game.js';

export type CardMotion = 'idle' | 'reveal' | 'replace' | 'removed' | 'draw' | 'discard' | 'hand';

function cellSignature(cell: PublicBoardCell): string {
  if (cell === null) {
    return 'null';
  }
  if (!cell.faceUp) {
    return 'hidden';
  }
  return `up:${cell.value}`;
}

export function inferCardMotion(prev: string | undefined, cell: PublicBoardCell): CardMotion {
  const curr = cellSignature(cell);
  if (prev === undefined || prev === curr) {
    return 'idle';
  }
  if (curr === 'null') {
    return 'removed';
  }
  if (prev === 'hidden' && curr.startsWith('up:')) {
    return 'reveal';
  }
  if (prev.startsWith('up:') && curr.startsWith('up:')) {
    return 'replace';
  }
  return 'idle';
}

export function motionClass(
  styles: Record<string, string>,
  motion: CardMotion,
): string | undefined {
  switch (motion) {
    case 'reveal':
      return styles.motionReveal;
    case 'replace':
      return styles.motionReplace;
    case 'removed':
      return styles.motionRemoved;
    case 'draw':
      return styles.motionDraw;
    case 'discard':
      return styles.motionDiscard;
    case 'hand':
      return styles.motionHand;
    default:
      return undefined;
  }
}
