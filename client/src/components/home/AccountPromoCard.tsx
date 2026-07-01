import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Panel } from '@/components/ui/Panel';
import shared from './LandingAuthCard.module.css';
import styles from './AccountPromoCard.module.css';

const FEATURES = [
  {
    iconClass: 'iconStat',
    label: 'Sauvegarder vos statistiques',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="4" y="13" width="4" height="7" rx="1" fill="currentColor" />
        <rect x="10" y="9" width="4" height="11" rx="1" fill="currentColor" />
        <rect x="16" y="5" width="4" height="15" rx="1" fill="currentColor" />
      </svg>
    ),
  },
  {
    iconClass: 'iconTrophy',
    label: 'Gagner des trophées',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M8 4h8v3a4 4 0 0 1-8 0V4z" fill="currentColor" />
        <path
          d="M6 4H4a2 2 0 0 0-2 2v1a3 3 0 0 0 3 3h1V4zm14 0v6h1a3 3 0 0 0 3-3V6a2 2 0 0 0-2-2h-2z"
          fill="currentColor"
        />
        <path d="M10 14h4v2H10v-2zm-1 4h6l1 3H8l1-3z" fill="currentColor" />
      </svg>
    ),
  },
  {
    iconClass: 'iconRank',
    label: 'Monter dans le classement',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="9" r="4" fill="currentColor" />
        <path d="M8.5 13.5 6 20h12l-2.5-6.5H8.5z" fill="currentColor" />
        <path d="M12 2 9.5 7h5L12 2z" fill="currentColor" />
      </svg>
    ),
  },
  {
    iconClass: 'iconProfile',
    label: 'Personnaliser votre profil',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="8" r="4" fill="currentColor" />
        <path d="M5 20c0-3.9 3.1-7 7-7s7 3.1 7 7H5z" fill="currentColor" />
      </svg>
    ),
  },
  {
    iconClass: 'iconFriends',
    label: 'Ajouter vos amis',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="9" cy="9" r="3.5" fill="currentColor" />
        <path
          d="M3 20c0-3.3 2.7-6 6-6 1.1 0 2.1.3 3 .8-1.8 1.4-3 3.6-3 6.2H3z"
          fill="currentColor"
        />
        <circle cx="17" cy="10" r="2.5" fill="currentColor" />
        <path
          d="M14.5 20c.3-2.2 2-4 4.5-4 1.2 0 2.2.5 3 1.2-.9 1.7-2.7 2.8-4.7 2.8h-2.8z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    iconClass: 'iconHistory',
    label: "Retrouver l'historique de vos parties",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M12 4a8 8 0 1 0 7.4 11.1l-1.9-.8A6 6 0 1 1 12 6V4z"
          fill="currentColor"
        />
        <path
          d="M12 6v5.5l3.5 2"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
] as const;

export function AccountPromoCard(): JSX.Element {
  return (
    <Panel className={`${shared.card} ${shared.cardRegister}`} padding="lg">
      <div className={shared.header}>
        <h2 className={`${shared.title} ${shared.titleRegister}`}>Créer un compte</h2>
        <p className={shared.subtitle}>
          Créez votre compte gratuitement et profitez de nombreux avantages !
        </p>
      </div>

      <div className={shared.body}>
        <ul className={styles.features}>
          {FEATURES.map((feature) => (
            <li key={feature.label} className={styles.feature}>
              <span className={`${styles.featureIcon} ${styles[feature.iconClass]}`}>
                {feature.icon}
              </span>
              <span className={styles.featureLabel}>{feature.label}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className={shared.actions}>
        <Link to="/register" className={shared.actionLink}>
          <Button variant="register" fullWidth size="lg">
            Créer un compte
          </Button>
        </Link>
      </div>
    </Panel>
  );
}
