import { Button } from '@/components/ui/Button';
import styles from './GameRulesBanner.module.css';

export function GameRulesBanner(): JSX.Element {
  return (
    <div className={styles.banner}>
      <div className={styles.content}>
        <span className={styles.shield} aria-hidden="true">
          🛡️
        </span>
        <p className={styles.text}>
          Si vous déclenchez la fin de manche, votre score de manche est <strong>doublé</strong> sauf
          si vous avez le plus bas score.
        </p>
      </div>
      <Button
        variant="accent"
        size="sm"
        onClick={() =>
          window.alert(
            'Règles Skyjo : piochez, remplacez ou défaussez. Retirez les colonnes de 3 cartes identiques. Le plus bas score total gagne !',
          )
        }
      >
        Voir les règles
      </Button>
    </div>
  );
}
