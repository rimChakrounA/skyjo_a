import styles from './GameReminder.module.css';

export function GameReminder(): JSX.Element {
  return (
    <aside className={styles.reminder} aria-label="Rappel des règles">
      <div className={styles.title}>
        <span className={styles.icon} aria-hidden="true">
          💡
        </span>
        Rappel
      </div>
      <p className={styles.text}>
        Le but est d&apos;obtenir le <strong>score le plus bas</strong> possible. Révélez vos cartes
        stratégiquement et retirez les colonnes identiques !
      </p>
    </aside>
  );
}
