import type { PublicPlayer } from '@shared/types/game.js';
import styles from './Scoreboard.module.css';

export interface ScoreboardProps {
  players: PublicPlayer[];
  roundEnderId: string | null;
}

export function Scoreboard({ players, roundEnderId }: ScoreboardProps): JSX.Element {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Joueur</th>
          <th>Manche</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        {players.map((player) => (
          <tr key={player.id}>
            <td>
              {player.name}
              {player.id === roundEnderId && <span className={styles.ender}> (a clôturé)</span>}
            </td>
            <td>{player.roundScore ?? '—'}</td>
            <td>{player.totalScore}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
