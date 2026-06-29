import type { PublicPlayer } from '@shared/types/game.js';
import { Scoreboard } from './Scoreboard';
import styles from './GameOver.module.css';

export interface GameOverProps {
  players: PublicPlayer[];
  winnerId: string | null;
  onBackToLobby: () => void;
}

export function GameOver({ players, winnerId, onBackToLobby }: GameOverProps): JSX.Element {
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
      <button type="button" onClick={onBackToLobby}>
        Retour à l’accueil
      </button>
    </div>
  );
}
