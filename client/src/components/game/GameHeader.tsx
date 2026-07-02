import { END_SCORE } from '@shared/constants/game.js';
import { Button } from '@/components/ui/Button';
import styles from './GameHeader.module.css';

export interface GameHeaderProps {
  round: number;
  currentPlayerName: string | null;
  showTurnBanner: boolean;
  maxTotalScore: number;
  onQuit: () => void;
}

export function GameHeader({
  round,
  currentPlayerName,
  showTurnBanner,
  maxTotalScore,
  onQuit,
}: GameHeaderProps): JSX.Element {
  const progress = Math.min(100, Math.round((maxTotalScore / END_SCORE) * 100));
  const filledSegments = Math.min(10, Math.max(1, round));

  return (
    <header className={styles.header}>
      <div className={styles.roundBlock}>
        <span className={styles.roundLabel}>Manche {round}</span>
        <div className={styles.progressTrack} aria-hidden="true">
          {Array.from({ length: 10 }, (_, index) => (
            <span
              key={index}
              className={`${styles.progressSegment} ${index < filledSegments ? styles.progressFilled : ''}`}
            />
          ))}
        </div>
        <span className={styles.progressHint}>Progression {progress}%</span>
      </div>

      {showTurnBanner && currentPlayerName !== null && (
        <div className={styles.turnBanner} role="status">
          <span className={styles.sparkle} aria-hidden="true">
            ✦
          </span>
          C&apos;est au tour de <strong>{currentPlayerName}</strong>
          <span className={styles.sparkle} aria-hidden="true">
            ✦
          </span>
        </div>
      )}

      <div className={styles.actions}>
        <Button variant="danger" size="sm" onClick={onQuit}>
          Quitter
        </Button>
      </div>
    </header>
  );
}
