import type { PublicPlayer } from '@shared/types/game.js';
import { Scoreboard } from './Scoreboard';
import styles from './GameOver.module.css';

export interface GameOverProps {
  players: PublicPlayer[];
  winnerId: string | null;
  isHost: boolean;
  onRematch: () => void;
  onBackToLobby: () => void;
}

export function GameOver({
  players,
  winnerId,
  isHost,
  onRematch,
  onBackToLobby,
}: GameOverProps): JSX.Element {
  const winner = players.find((player) => player.id === winnerId) ?? null;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Partie terminée</h2>
      {winner !== null && (
        <p className={styles.winner}>
          Vainqueur : <strong>{winner.name}</strong> avec {winner.totalScore} points
        </p>
      )}
      <Scoreboard players={players} roundEnderId={null} />
      <div className={styles.actions}>
        {isHost && (
          <button type="button" onClick={onRematch}>
            Rejouer
          </button>
        )}
        <button type="button" className="secondary" onClick={onBackToLobby}>
          Retour à l'accueil
        </button>
      </div>
      {!isHost && (
        <p className={styles.waiting}>En attente de la décision de l'hôte…</p>
      )}
    </div>
  );
}
