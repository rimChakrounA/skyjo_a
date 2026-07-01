import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Panel } from '@/components/ui/Panel';
import styles from './AccountPromoBanner.module.css';

const FEATURES = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M14 2H6a2 2 0 0 0-2 2v16l4-2 4 2 4-2 4 2V8l-6-6z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path d="M14 2v6h6" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      </svg>
    ),
    label: 'Sauvegardez vos statistiques',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M8 21h8M12 17v4M6 4h12l1 7H5l1-7zM7 11v5a5 5 0 0 0 10 0v-5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    label: 'Gagnez des trophées',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M12 2l2.4 7.4H22l-6 4.6 2.3 7L12 17.8 5.7 21l2.3-7-6-4.6h7.6L12 2z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>
    ),
    label: 'Débloquez des succès',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" />
        <path
          d="M4 20c0-4 3.6-7 8-7s8 3 8 7"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
    label: 'Personnalisez votre profil',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="2" />
        <circle cx="17" cy="9" r="2.5" stroke="currentColor" strokeWidth="2" />
        <path
          d="M3 20c0-3.5 2.7-6 6-6M14 20c0-2.5 2-4.5 4.5-4.5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
    label: 'Retrouvez vos amis',
  },
] as const;

export function AccountPromoBanner(): JSX.Element {
  return (
    <Panel className={styles.banner} padding="lg">
      <div className={styles.header}>
        <span className={styles.star} aria-hidden="true">
          ★
        </span>
        <p className={styles.headline}>
          Créez un compte gratuitement pour encore plus d&apos;avantages !
        </p>
      </div>

      <div className={styles.features}>
        {FEATURES.map((feature) => (
          <div key={feature.label} className={styles.feature}>
            <span className={styles.featureIcon}>{feature.icon}</span>
            <span className={styles.featureLabel}>{feature.label}</span>
          </div>
        ))}
      </div>

      <Link to="/register" className={styles.ctaLink}>
        <Button variant="secondary" size="lg" className={styles.cta}>
          Créer un compte
        </Button>
      </Link>
    </Panel>
  );
}
