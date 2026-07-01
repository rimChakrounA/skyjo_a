import { AccountPromoCard } from '@/components/home/AccountPromoCard';
import { GuestLoginPanel } from '@/components/home/GuestLoginPanel';
import { LoginPromoCard } from '@/components/home/LoginPromoCard';
import styles from './LandingAuthGrid.module.css';

export interface LandingAuthGridProps {
  name: string;
  busy: boolean;
  error: string | null;
  onNameChange: (value: string) => void;
  onContinue: () => void;
}

export function LandingAuthGrid({
  name,
  busy,
  error,
  onNameChange,
  onContinue,
}: LandingAuthGridProps): JSX.Element {
  return (
    <div className={styles.grid}>
      <GuestLoginPanel
        name={name}
        busy={busy}
        error={error}
        onNameChange={onNameChange}
        onContinue={onContinue}
      />
      <LoginPromoCard />
      <AccountPromoCard />
    </div>
  );
}
