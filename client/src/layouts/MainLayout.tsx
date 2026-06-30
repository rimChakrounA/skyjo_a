import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useSocket } from '@/hooks/useSocket';
import styles from './MainLayout.module.css';

export function MainLayout({ children }: { children: ReactNode }): JSX.Element {
  const { connected } = useSocket();
  const { user, logout } = useAuth();

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <Link to="/" className={styles.titleLink}>
          <h1 className={styles.title}>Skyjo Online</h1>
        </Link>
        <nav className={styles.nav}>
          {user !== null ? (
            <>
              <Link to="/profile" className={styles.username}>
                {user.username}
              </Link>
              <button type="button" className={styles.logoutBtn} onClick={logout}>
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={styles.authLink}>Connexion</Link>
              <Link to="/register" className={styles.authLink}>Inscription</Link>
            </>
          )}
          <span className={connected ? styles.online : styles.offline}>
            {connected ? 'En ligne' : 'Hors ligne'}
          </span>
        </nav>
      </header>
      <main className={styles.main}>{children}</main>
    </div>
  );
}
