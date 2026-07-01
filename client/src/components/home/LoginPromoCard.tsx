import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Panel } from '@/components/ui/Panel';
import { assetUrl } from '@/utils/assetUrl';
import shared from './LandingAuthCard.module.css';

export function LoginPromoCard(): JSX.Element {
  return (
    <Panel className={`${shared.card} ${shared.cardLogin}`} padding="lg">
      <div className={shared.header}>
        <h2 className={`${shared.title} ${shared.titleLogin}`}>Se connecter</h2>
        <p className={shared.subtitle}>
          Vous avez déjà un compte ? Connectez-vous pour retrouver vos statistiques et amis.
        </p>
      </div>

      <div className={shared.body}>
        <div className={shared.illustration}>
          <img
            className={`${shared.illustrationImg} ${shared.illustrationImgLogin}`}
            src={assetUrl('characters/compte.png')}
            alt=""
            aria-hidden="true"
            loading="lazy"
          />
        </div>
      </div>

      <div className={shared.actions}>
        <Link to="/login" className={shared.actionLink}>
          <Button variant="accent" fullWidth size="lg">
            Se connecter
          </Button>
        </Link>
      </div>
    </Panel>
  );
}
