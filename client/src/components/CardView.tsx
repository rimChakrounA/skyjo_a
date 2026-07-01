import type { PublicBoardCell } from '@shared/types/game.js';
import { cardTextureStyle } from '@/utils/cardTextures';
import styles from './CardView.module.css';

export interface CardViewProps {
  cell: PublicBoardCell;
  clickable?: boolean | undefined;
  onClick?: (() => void) | undefined;
  ariaLabel?: string | undefined;
}

export function CardView({ cell, clickable = false, onClick, ariaLabel }: CardViewProps): JSX.Element {
  if (cell === null) {
    return <div className={`${styles.card} ${styles.empty}`} aria-hidden="true" />;
  }

  const isFaceUp = cell.faceUp;
  const textureStyle = cardTextureStyle(cell);
  const className = [
    styles.card,
    isFaceUp ? styles.faceUp : styles.hidden,
    clickable ? styles.clickable : '',
  ]
    .filter(Boolean)
    .join(' ');

  if (clickable) {
    const label =
      ariaLabel ??
      (isFaceUp && 'value' in cell ? String(cell.value) : 'Carte cachée');
    return (
      <button
        type="button"
        className={className}
        style={textureStyle}
        onClick={onClick}
        aria-label={label}
      >
        {isFaceUp ? <span className={styles.value}>{cell.value}</span> : ''}
      </button>
    );
  }

  return (
    <div className={className} style={textureStyle}>
      {isFaceUp ? <span className={styles.value}>{cell.value}</span> : ''}
    </div>
  );
}
