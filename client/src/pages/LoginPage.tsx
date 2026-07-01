import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Field } from '@/components/ui/Field';
import { Input } from '@/components/ui/Input';
import { Panel } from '@/components/ui/Panel';
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
      <Panel className={styles.wrapper} padding="lg">
        <form className={styles.form} onSubmit={(e) => void handleSubmit(e)}>
          <h2 className={styles.title}>Connexion</h2>

          <Field label="Pseudo">
            <Input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
            />
          </Field>

          <Field label="Mot de passe">
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </Field>

          {error !== null && <p className={styles.error}>{error}</p>}

          <Button type="submit" fullWidth disabled={busy}>
            {busy ? 'Connexion…' : 'Se connecter'}
          </Button>

          <p className={styles.switch}>
            Pas encore de compte ? <Link to="/register">S&apos;inscrire</Link>
          </p>
        </form>
      </Panel>
    </MainLayout>
  );
}
