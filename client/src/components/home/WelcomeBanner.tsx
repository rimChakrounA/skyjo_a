import styles from './WelcomeBanner.module.css';

export interface WelcomeBannerProps {
  name: string;
}

export function WelcomeBanner({ name }: WelcomeBannerProps): JSX.Element {
  return (
    <div className={styles.banner}>
      <h2 className={styles.title}>
        Bienvenue, {name} !
        <span className={styles.wave} aria-hidden="true">
          {' '}
          👋
        </span>
      </h2>
      <p className={styles.subtitle}>Que voulez-vous faire aujourd&apos;hui ?</p>
    </div>
  );
}
