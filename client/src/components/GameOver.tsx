import type { PublicPlayer } from '@shared/types/game.js';
import { useEffect } from 'react';
import { Confetti } from '@/components/game/Confetti';
import { Button } from '@/components/ui/Button';
import { Panel } from '@/components/ui/Panel';
import { playGameSound } from '@/services/gameSounds';
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

  useEffect(() => {
    playGameSound('gameWin');
  }, []);

  return (
    <>
      <Confetti />
      <Panel className={styles.container} glow padding="lg">
        <span className={styles.trophyIcon} aria-hidden="true">
          🏆
        </span>
        <h2 className={styles.title}>Partie terminée</h2>
        {winner !== null && (
          <p className={styles.winner}>
            <strong>{winner.name}</strong> remporte la partie !
            <span className={styles.winnerScore}>{winner.totalScore} points</span>
          </p>
        )}
        <Scoreboard players={players} roundEnderId={null} />
        <div className={styles.actions}>
          {isHost && (
            <Button fullWidth onClick={onRematch}>
              Rejouer
            </Button>
          )}
          <Button variant="secondary" fullWidth onClick={onBackToLobby}>
            Retour à l&apos;accueil
          </Button>
        </div>
        {!isHost && (
          <p className={styles.waiting}>En attente de la décision de l&apos;hôte…</p>
        )}
      </Panel>
    </>
  );
}
