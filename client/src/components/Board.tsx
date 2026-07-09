import { GRID_COLS } from '@shared/constants/game.js';
import type { PublicPlayer } from '@shared/types/game.js';
import { useCardMotions } from '@/hooks/useCardMotions';
import { AnimatedScore } from '@/components/game/AnimatedScore';
import { CardSlot } from '@/components/game/CardSlot';
import { useGameFeel } from '@/contexts/GameFeelContext';
import type { PlayerAvatar } from '@/utils/playerAvatar';
import { anchorSlot } from '@/utils/gameAnchors';
import { columnIndices } from '@/utils/boardColumns';
import { visibleBoardStats } from '@/utils/visibleBoardStats';
import { CardView } from './CardView';
import styles from './Board.module.css';

export interface BoardProps {
  player: PublicPlayer;
  avatar: PlayerAvatar;
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

function TrophyIcon(): JSX.Element {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" width="16" height="16">
      <path
        d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4zM5 5H3v1a3 3 0 0 0 3 3M19 5h2v1a3 3 0 0 1-3 3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Board({
  player,
  avatar,
  isSelf,
  isCurrent,
  compact = false,
  canClick,
  onCardClick,
}: BoardProps): JSX.Element {
  const { isAnchorHidden, collapsedColumns, columnEffects } = useGameFeel();
  const { sum: revealedSum } = visibleBoardStats(player.cells);
  const cardMotions = useCardMotions(player.cells);
  const collapsed = collapsedColumns.get(player.id) ?? new Set<number>();
  const clearingCols = new Set(columnEffects.filter((fx) => fx.playerId === player.id).map((fx) => fx.col));
  const themeClass = isSelf ? styles.self : isCurrent ? styles.activeOpponent : styles.opponent;

  return (
    <div
      className={`${styles.board} ${compact ? styles.compact : ''} ${themeClass} ${isCurrent ? styles.current : ''} ${isCurrent ? styles.breathing : ''}`}
    >
      <div className={styles.header}>
        <div className={styles.profile}>
          <span
            className={styles.avatar}
            style={{ backgroundColor: avatar.background }}
            aria-hidden="true"
          >
            <span className={styles.avatarGlyph}>{avatar.emoji}</span>
          </span>
          <div className={styles.profileInfo}>
            <div className={styles.nameRow}>
              <span className={styles.name}>{player.name}</span>
              {isSelf && <span className={styles.badgeYou}>Vous</span>}
              {isCurrent && !isSelf && <span className={styles.badgeTurn}>Tour actif</span>}
            </div>
            <div className={styles.scoreBox}>
              <span className={styles.scoreIcon} aria-hidden="true">
                <TrophyIcon />
              </span>
              <span className={styles.scoreLabel}>Score</span>
              <span className={styles.scoreValue}>
                <AnimatedScore value={player.totalScore} />
              </span>
            </div>
          </div>
        </div>
        <div className={styles.totalBox}>
          <span className={styles.totalLabel}>Total</span>
          <span className={styles.totalValue}>{revealedSum}</span>
        </div>
      </div>

      <div
        className={styles.grid}
        style={{
          gridTemplateColumns: Array.from({ length: GRID_COLS }, (_, col) =>
            collapsed.has(col) ? '0px' : 'var(--game-card-w)',
          ).join(' '),
        }}
      >
        {player.cells.map((cell, index) => {
          const clickable = canClick?.(index) ?? false;
          const col = index % GRID_COLS;
          const slotKey = anchorSlot(player.id, index);
          const isClearing = clearingCols.has(col) && columnIndices(col).includes(index);
          return (
            <CardSlot
              key={index}
              slotKey={slotKey}
              className={`${styles.slot} ${collapsed.has(col) ? styles.slotCollapsed : ''} ${isClearing ? styles.slotClearing : ''}`}
            >
              <CardView
                cell={cell}
                motion={cardMotions[index] ?? 'idle'}
                slotRow={Math.floor(index / GRID_COLS)}
                clickable={clickable}
                hidden={isAnchorHidden(slotKey)}
                ariaLabel={cardAriaLabel(cell, clickable)}
                onClick={clickable ? () => onCardClick?.(index) : undefined}
              />
            </CardSlot>
          );
        })}
      </div>
    </div>
  );
}
