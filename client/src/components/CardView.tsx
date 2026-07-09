import type { CSSProperties } from 'react';
import type { PublicBoardCell } from '@shared/types/game.js';
import type { CardMotion } from '@/utils/cardMotion';
import { motionClass } from '@/utils/cardMotion';
import { cardTextureStyle } from '@/utils/cardTextures';
import styles from './CardView.module.css';

export interface CardViewProps {
  cell: PublicBoardCell;
  clickable?: boolean | undefined;
  onClick?: (() => void) | undefined;
  ariaLabel?: string | undefined;
  motion?: CardMotion;
  slotRow?: number;
}

export function CardView({
  cell,
  clickable = false,
  onClick,
  ariaLabel,
  motion = 'idle',
  slotRow = 0,
}: CardViewProps): JSX.Element {
  if (cell === null) {
    return (
      <div
        className={[styles.card, styles.empty, motionClass(styles, motion)].filter(Boolean).join(' ')}
        style={{ '--card-slot-row': slotRow } as CSSProperties}
        aria-hidden="true"
      />
    );
  }

  const isFaceUp = cell.faceUp;
  const textureStyle = cardTextureStyle(cell);
  const motionStyle = { '--card-slot-row': slotRow } as CSSProperties;
  const className = [
    styles.card,
    isFaceUp ? styles.faceUp : styles.hidden,
    clickable ? styles.clickable : '',
    motionClass(styles, motion),
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
        style={{ ...textureStyle, ...motionStyle }}
        onClick={onClick}
        aria-label={label}
      >
        {isFaceUp ? (
          <>
            <span className={styles.cornerTL} aria-hidden="true">
              {cell.value}
            </span>
            <span className={styles.value}>{cell.value}</span>
            <span className={styles.cornerBR} aria-hidden="true">
              {cell.value}
            </span>
          </>
        ) : (
          ''
        )}
      </button>
    );
  }

  return (
    <div className={className} style={{ ...textureStyle, ...motionStyle }}>
      {isFaceUp ? (
        <>
          <span className={styles.cornerTL} aria-hidden="true">
            {cell.value}
          </span>
          <span className={styles.value}>{cell.value}</span>
          <span className={styles.cornerBR} aria-hidden="true">
            {cell.value}
          </span>
        </>
      ) : (
        ''
      )}
    </div>
  );
}
