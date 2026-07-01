import { assetUrl } from '@/utils/assetUrl';

import styles from './SkyjoLogo.module.css';

export interface SkyjoLogoProps {
  onClick?: () => void;
}

export function SkyjoLogo({ onClick }: SkyjoLogoProps): JSX.Element {
  const interactive = onClick !== undefined;

  return (
    <div
      className={`${styles.logo} ${interactive ? styles.logoClickable : ''}`}
      aria-label={interactive ? 'Skyjo Online — retour à l’accueil' : 'Skyjo Online'}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      onClick={onClick}
      onKeyDown={
        interactive
          ? (event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                onClick();
              }
            }
          : undefined
      }
    >
      <h1 className={styles.wordmark}>
        <img
          className={styles.image}
          src={assetUrl('logo/logo1.png')}
          alt="Skyjo"
          decoding="async"
        />
      </h1>
      <div className={styles.ribbon}>
        <span>ONLINE</span>
      </div>
    </div>
  );
}
