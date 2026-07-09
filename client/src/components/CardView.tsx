import type { CSSProperties, MouseEvent } from 'react';
import { useCallback, useState } from 'react';
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
  hidden?: boolean;
}

export function CardView({
  cell,
  clickable = false,
  onClick,
  ariaLabel,
  motion = 'idle',
  slotRow = 0,
  hidden = false,
}: CardViewProps): JSX.Element {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((event: MouseEvent<HTMLElement>) => {
    if (!clickable) {
      return;
    }
    const rect = event.currentTarget.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: px * 8, y: -py * 6 });
  }, [clickable]);

  const handleMouseLeave = useCallback(() => setTilt({ x: 0, y: 0 }), []);

  const tiltStyle =
    clickable && motion === 'idle'
      ? ({
          ['--tilt-x' as string]: `${tilt.y}deg`,
          ['--tilt-y' as string]: `${tilt.x}deg`,
        } as CSSProperties)
      : undefined;

  const visibilityClass = hidden ? styles.hiddenDuringFlight : '';
  if (cell === null) {
    return (
      <div
        className={[styles.card, styles.empty, motionClass(styles, motion), visibilityClass].filter(Boolean).join(' ')}
        style={{ '--card-slot-row': slotRow, ...tiltStyle } as CSSProperties}
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
    visibilityClass,
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
        style={{ ...textureStyle, ...motionStyle, ...tiltStyle }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
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
