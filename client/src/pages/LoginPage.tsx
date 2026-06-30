import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { MainLayout } from '@/layouts/MainLayout';
import styles from './AuthPage.module.css';

export function LoginPage(): JSX.Element {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await login(username.trim(), password);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de connexion.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <MainLayout>
      <form className={styles.form} onSubmit={(e) => void handleSubmit(e)}>
        <h2 className={styles.title}>Connexion</h2>

        <label className={styles.label}>
          Pseudo
          <input
            className={styles.input}
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            required
          />
        </label>

        <label className={styles.label}>
          Mot de passe
          <input
            className={styles.input}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </label>

        {error !== null && <p className={styles.error}>{error}</p>}

        <button type="submit" disabled={busy}>
          {busy ? 'Connexion…' : 'Se connecter'}
        </button>

        <p className={styles.switch}>
          Pas encore de compte ? <Link to="/register">S'inscrire</Link>
        </p>
      </form>
    </MainLayout>
  );
}
