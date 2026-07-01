import styles from './CardDeckDecor.module.css';

/** Décor animé : fan de cartes Skyjo (CSS pur). */
export function CardDeckDecor(): JSX.Element {
  return (
    <div className={styles.decor} aria-hidden="true">
      <div className={`${styles.card} ${styles.cardBack}`} />
      <div className={`${styles.card} ${styles.card7}`}>7</div>
      <div className={`${styles.card} ${styles.card12}`}>12</div>
      <div className={`${styles.card} ${styles.cardNeg}`}>-2</div>
      <div className={styles.stack}>
        <div className={styles.stackLayer} />
        <div className={styles.stackLayer} />
        <div className={styles.stackLayer} />
      </div>
    </div>
  );
}
