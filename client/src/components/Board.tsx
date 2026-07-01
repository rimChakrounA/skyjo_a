import { GRID_COLS } from '@shared/constants/game.js';
import type { PublicPlayer } from '@shared/types/game.js';
import { CardView } from './CardView';
import styles from './Board.module.css';

export interface BoardProps {
  player: PublicPlayer;
  isSelf: boolean;
  isCurrent: boolean;
  compact?: boolean;
  canClick?: (index: number) => boolean;
  onCardClick?: (index: number) => void;
}

function cardAriaLabel(
  cell: PublicPlayer['cells'][number],
  clickable: boolean,
): string | undefined {
  if (!clickable || cell === null) {
    return undefined;
  }
  if (!cell.faceUp) {
    return 'Révéler cette carte';
  }
  return `Remplacer la carte ${cell.value}`;
}

export function Board({
  player,
  isSelf,
  isCurrent,
  compact = false,
  canClick,
  onCardClick,
}: BoardProps): JSX.Element {
  return (
    <div
      className={`${styles.board} ${compact ? styles.compact : ''} ${isCurrent ? styles.current : ''}`}
    >
      <div className={styles.header}>
        <span className={styles.name}>
          {player.name}
          {isSelf && <span className={styles.you}> (vous)</span>}
        </span>
        <span className={styles.score}>Total : {player.totalScore}</span>
      </div>

      <div className={styles.grid} style={{ gridTemplateColumns: `repeat(${GRID_COLS}, auto)` }}>
        {player.cells.map((cell, index) => {
          const clickable = canClick?.(index) ?? false;
          return (
            <CardView
              key={index}
              cell={cell}
              clickable={clickable}
              ariaLabel={cardAriaLabel(cell, clickable)}
              onClick={clickable ? () => onCardClick?.(index) : undefined}
            />
          );
        })}
      </div>
    </div>
  );
}
