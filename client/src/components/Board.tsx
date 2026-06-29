import { GRID_COLS } from '@shared/constants/game.js';
import type { PublicPlayer } from '@shared/types/game.js';
import { CardView } from './CardView';
import styles from './Board.module.css';

export interface BoardProps {
  player: PublicPlayer;
  isSelf: boolean;
  isCurrent: boolean;
  canClick?: (index: number) => boolean;
  onCardClick?: (index: number) => void;
}

export function Board({
  player,
  isSelf,
  isCurrent,
  canClick,
  onCardClick,
}: BoardProps): JSX.Element {
  return (
    <div className={`${styles.board} ${isCurrent ? styles.current : ''}`}>
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
              onClick={clickable ? () => onCardClick?.(index) : undefined}
            />
          );
        })}
      </div>
    </div>
  );
}
