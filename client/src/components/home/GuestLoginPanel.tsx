import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Panel } from '@/components/ui/Panel';
import { assetUrl } from '@/utils/assetUrl';
import shared from './LandingAuthCard.module.css';
import styles from './GuestLoginPanel.module.css';

export interface GuestLoginPanelProps {
  name: string;
  busy: boolean;
  error: string | null;
  onNameChange: (value: string) => void;
  onContinue: () => void;
}

function UserIcon(): JSX.Element {
  return (
    <svg className={styles.inputIcon} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" />
      <path
        d="M4 20c0-4 3.6-7 8-7s8 3 8 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function GuestLoginPanel({
  name,
  busy,
  error,
  onNameChange,
  onContinue,
}: GuestLoginPanelProps): JSX.Element {
  return (
    <Panel className={`${shared.card} ${shared.cardGuest}`} padding="lg">
      <div className={shared.header}>
        <h2 className={`${shared.title} ${shared.titleGuest}`}>Jouer en invité</h2>
        <p className={shared.subtitle}>Jouez immédiatement sans créer de compte.</p>
      </div>

      <div className={shared.body}>
        <div className={shared.illustration}>
          <img
            className={shared.illustrationImg}
            src={assetUrl('characters/players-home.png')}
            alt=""
            aria-hidden="true"
            loading="lazy"
          />
        </div>

        <div className={styles.inputWrap}>
          <UserIcon />
          <Input
            className={styles.input}
            value={name}
            maxLength={20}
            placeholder="Choisissez un pseudo"
            aria-label="Choisissez un pseudo"
            onChange={(event) => onNameChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                onContinue();
              }
            }}
          />
        </div>

        {error !== null && <p className={styles.error}>{error}</p>}
      </div>

      <div className={shared.actions}>
        <Button variant="primary" fullWidth size="lg" disabled={busy} onClick={onContinue}>
          Continuer en invité
        </Button>
      </div>
    </Panel>
  );
}
