import styles from './JoinForm.module.css';
import { MAX_PLAYERS, MIN_PLAYERS } from '@shared/constants/game.js';

export interface JoinFormProps {
  name: string;
  code: string;
  minPlayers: number;
  maxPlayers: number;
  busy: boolean;
  error: string | null;
  onNameChange: (value: string) => void;
  onCodeChange: (value: string) => void;
  onMinPlayersChange: (value: number) => void;
  onMaxPlayersChange: (value: number) => void;
  onCreate: () => void;
  onJoin: () => void;
}

const PLAYER_OPTIONS = Array.from(
  { length: MAX_PLAYERS - MIN_PLAYERS + 1 },
  (_, index) => MIN_PLAYERS + index,
);

export function JoinForm({
  name,
  code,
  minPlayers,
  maxPlayers,
  busy,
  error,
  onNameChange,
  onCodeChange,
  onMinPlayersChange,
  onMaxPlayersChange,
  onCreate,
  onJoin,
}: JoinFormProps): JSX.Element {
  return (
    <div className={styles.card}>
      <label className={styles.field}>
        <span>Pseudo</span>
        <input
          value={name}
          maxLength={20}
          placeholder="Votre nom"
          onChange={(event) => onNameChange(event.target.value)}
        />
      </label>

      <div className={styles.playerBounds}>
        <label className={styles.field}>
          <span>Min. joueurs</span>
          <select
            value={minPlayers}
            disabled={busy}
            onChange={(event) => onMinPlayersChange(Number(event.target.value))}
          >
            {PLAYER_OPTIONS.filter((value) => value <= maxPlayers).map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </label>
        <label className={styles.field}>
          <span>Max. joueurs</span>
          <select
            value={maxPlayers}
            disabled={busy}
            onChange={(event) => onMaxPlayersChange(Number(event.target.value))}
          >
            {PLAYER_OPTIONS.filter((value) => value >= minPlayers).map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className={styles.actions}>
        <button type="button" disabled={busy} onClick={onCreate}>
          Créer une salle
        </button>
      </div>

      <div className={styles.separator}>ou</div>

      <label className={styles.field}>
        <span>Code de salle</span>
        <input
          value={code}
          maxLength={8}
          placeholder="Ex : ABCDE"
          onChange={(event) => onCodeChange(event.target.value.toUpperCase())}
        />
      </label>

      <div className={styles.actions}>
        <button type="button" className="secondary" disabled={busy} onClick={onJoin}>
          Rejoindre
        </button>
      </div>

      {error !== null && <p className={styles.error}>{error}</p>}
    </div>
  );
}
