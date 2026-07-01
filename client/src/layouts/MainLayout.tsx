import type { ReactNode } from 'react';

import { Link } from 'react-router-dom';

import { Badge } from '@/components/ui/Badge';

import { Button } from '@/components/ui/Button';

import { useAuth } from '@/hooks/useAuth';

import { useSocket } from '@/hooks/useSocket';

import { assetUrl } from '@/utils/assetUrl';

import styles from './MainLayout.module.css';



export interface MainLayoutProps {

  children: ReactNode;

  variant?: 'default' | 'scene';

  onBrandClick?: () => void;

}



export function MainLayout({

  children,

  variant = 'default',

  onBrandClick,

}: MainLayoutProps): JSX.Element {

  const { connected } = useSocket();

  const { user, logout } = useAuth();

  const isScene = variant === 'scene';



  return (

    <div className={`${styles.layout} ${isScene ? styles.layoutScene : ''}`}>

      <header className={`${styles.header} ${isScene ? styles.headerScene : ''}`}>

        {!isScene && (

          <Link to="/" className={styles.titleLink} onClick={onBrandClick} aria-label="Skyjo Online — accueil">

            <img

              className={styles.titleLogo}

              src={assetUrl('logo/logo1.png')}

              alt="Skyjo Online"

              decoding="async"

            />

          </Link>

        )}

        {isScene && (

          <Link

            to="/"

            className={styles.sceneBrand}

            aria-label="Skyjo Online — accueil"

            onClick={onBrandClick}

          >

            <img

              className={styles.sceneBrandLogo}

              src={assetUrl('logo/logo1.png')}

              alt=""

              decoding="async"

              aria-hidden="true"

            />

          </Link>

        )}

        <nav className={styles.nav}>

          {user !== null ? (

            <>

              <Link

                to="/profile"

                className={isScene ? styles.sceneProfileLink : styles.username}

              >

                {isScene && <span aria-hidden="true">🏆 </span>}

                {user.username}

              </Link>

              <Button

                variant="ghost"

                size="sm"

                className={isScene ? styles.sceneGhostBtn : undefined}

                onClick={logout}

              >

                Déconnexion

              </Button>

            </>

          ) : (

            <>

              <Link

                to="/login"

                className={isScene ? styles.btnNavy : styles.authLink}

              >

                Connexion

              </Link>

              <Link

                to="/register"

                className={isScene ? styles.btnPrimary : styles.authLink}

              >

                Inscription

              </Link>

            </>

          )}

          {isScene ? (

            <div className={styles.langSelect} aria-label="Langue">

              <span className={styles.langFlag} aria-hidden="true">

                🇫🇷

              </span>

              <span>FR</span>

            </div>

          ) : (

            <Badge variant={connected ? 'success' : 'danger'}>

              {connected ? 'En ligne' : 'Hors ligne'}

            </Badge>

          )}

        </nav>

      </header>

      <main className={`${styles.main} ${isScene ? styles.mainScene : ''}`}>{children}</main>

    </div>

  );

}

