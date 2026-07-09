import type { PublicPlayer } from '@shared/types/game.js';
import styles from './RoundWinOverlay.module.css';

export interface RoundWinOverlayProps {
  players: PublicPlayer[];
  roundEnderId: string | null;
}

function roundWinner(players: PublicPlayer[]): PublicPlayer | null {
  const scored = players.filter((p) => p.roundScore !== null);
  if (scored.length === 0) {
    return null;
  }
  return scored.reduce((best, p) =>
    (p.roundScore ?? Infinity) < (best.roundScore ?? Infinity) ? p : best,
  );
}

export function RoundWinOverlay({ players, roundEnderId }: RoundWinOverlayProps): JSX.Element {
  const winner = roundWinner(players);
  const points = winner?.roundScore ?? null;

  return (
    <div className={styles.overlay} role="status" aria-live="polite">
      <div className={styles.card}>
        <span className={styles.trophy} aria-hidden="true">
          🏆
        </span>
        {winner !== null ? (
          <>
            <p className={styles.title}>{winner.name} remporte la manche !</p>
            {points !== null && (
              <p className={styles.points}>
                {points > 0 ? '+' : ''}
                {points} points
              </p>
            )}
          </>
        ) : (
          <p className={styles.title}>Fin de manche</p>
        )}
        {roundEnderId !== null && winner?.id === roundEnderId && (
          <p className={styles.hint}>Clôture de la manche</p>
        )}
        <p className={styles.next}>Manche suivante…</p>
      </div>
    </div>
  );
}
