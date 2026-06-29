import type { PublicBoardCell } from '@shared/types/game.js';
import styles from './CardView.module.css';

export interface CardViewProps {
  cell: PublicBoardCell;
  clickable?: boolean | undefined;
  onClick?: (() => void) | undefined;
}

function valueClass(value: number): string {
  if (value < 0) return styles.negative ?? '';
  if (value === 0) return styles.zero ?? '';
  if (value <= 4) return styles.low ?? '';
  if (value <= 8) return styles.mid ?? '';
  return styles.high ?? '';
}

export function CardView({ cell, clickable = false, onClick }: CardViewProps): JSX.Element {
  if (cell === null) {
    return <div className={`${styles.card} ${styles.empty}`} aria-hidden="true" />;
  }

  const isFaceUp = cell.faceUp;
  const className = [
    styles.card,
    isFaceUp ? valueClass(cell.value) : styles.hidden,
    clickable ? styles.clickable : '',
  ]
    .filter(Boolean)
    .join(' ');

  if (clickable) {
    return (
      <button type="button" className={className} onClick={onClick}>
        {isFaceUp ? cell.value : ''}
      </button>
    );
  }

  return <div className={className}>{isFaceUp ? cell.value : ''}</div>;
}
