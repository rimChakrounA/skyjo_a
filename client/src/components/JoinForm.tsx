import { MAX_PLAYERS, MIN_PLAYERS } from '@shared/constants/game.js';
import { Button } from '@/components/ui/Button';
import { Field } from '@/components/ui/Field';
import { Input } from '@/components/ui/Input';
import { Panel } from '@/components/ui/Panel';
import { Select } from '@/components/ui/Select';
import { assetUrl } from '@/utils/assetUrl';
import styles from './JoinForm.module.css';

export interface JoinFormProps {
  code: string;
  minPlayers: number;
  maxPlayers: number;
  busy: boolean;
  pendingAction?: 'create' | 'join' | null;
  error: string | null;
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

function UsersIcon(): JSX.Element {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" width="20" height="20">
      <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="2" />
      <circle cx="17" cy="9" r="2.5" stroke="currentColor" strokeWidth="2" />
      <path
        d="M3 20c0-3.5 2.7-6 6-6M14 20c0-2.5 2-4.5 4.5-4.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ArrowIcon(): JSX.Element {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" width="20" height="20">
      <path
        d="M5 12h14M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function JoinForm({
  code,
  minPlayers,
  maxPlayers,
  busy,
  pendingAction = null,
  error,
  onCodeChange,
  onMinPlayersChange,
  onMaxPlayersChange,
  onCreate,
  onJoin,
}: JoinFormProps): JSX.Element {
  return (
    <div className={styles.wrapper} id="action-cards">
      <div className={styles.split}>
        <Panel className={styles.actionCard} padding="lg">
          <div className={styles.illustration}>
            <img
              className={styles.illustrationImg}
              src={assetUrl('characters/players-home.png')}
              alt="Trois joueurs souriants tenant des cartes Skyjo"
              loading="lazy"
            />
          </div>
          <h2 className={styles.cardTitle}>Créer une partie</h2>
          <p className={styles.cardSubtitle}>Lancez une salle et invitez vos amis</p>

          <div className={styles.playerBounds}>
            <Field label="Min. joueurs">
              <Select
                value={minPlayers}
                disabled={busy}
                onChange={(event) => onMinPlayersChange(Number(event.target.value))}
              >
                {PLAYER_OPTIONS.filter((value) => value <= maxPlayers).map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Max. joueurs">
              <Select
                value={maxPlayers}
                disabled={busy}
                onChange={(event) => onMaxPlayersChange(Number(event.target.value))}
              >
                {PLAYER_OPTIONS.filter((value) => value >= minPlayers).map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </Select>
            </Field>
          </div>

          <Button
            fullWidth
            size="lg"
            disabled={busy}
            icon={<UsersIcon />}
            onClick={onCreate}
          >
            {busy && pendingAction === 'create' ? 'Création…' : 'Créer une salle'}
          </Button>
        </Panel>

        <div className={styles.ou} aria-hidden="true">
          <span>OU</span>
        </div>

        <Panel className={styles.actionCard} padding="lg">
          <div className={styles.illustration}>
            <img
              className={styles.illustrationImg}
              src={assetUrl('cards/cartes_home.png')}
              alt="Éventail de cartes Skyjo"
              loading="lazy"
            />
          </div>
          <h2 className={styles.cardTitle}>Rejoindre une partie</h2>
          <p className={styles.cardSubtitle}>
            Entrez le code de la salle pour rejoindre vos amis
          </p>

          <Field label="Code de la salle">
            <Input
              value={code}
              maxLength={8}
              placeholder="EX : ABCDE"
              className={styles.codeInput}
              disabled={busy && pendingAction === 'create'}
              onChange={(event) => onCodeChange(event.target.value.toUpperCase())}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  onJoin();
                }
              }}
            />
          </Field>

          <Button
            variant="accent"
            fullWidth
            size="lg"
            disabled={busy && pendingAction === 'create'}
            icon={<ArrowIcon />}
            onClick={onJoin}
          >
            Rejoindre la partie
          </Button>
        </Panel>
      </div>

      {error !== null && <p className={styles.error}>{error}</p>}
    </div>
  );
}
