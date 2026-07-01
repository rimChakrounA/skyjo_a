import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Field } from '@/components/ui/Field';
import { Input } from '@/components/ui/Input';
import { Panel } from '@/components/ui/Panel';
import { useAuth } from '@/hooks/useAuth';
import { MainLayout } from '@/layouts/MainLayout';
import styles from './AuthPage.module.css';

export function RegisterPage(): JSX.Element {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setError(null);
    if (password !== confirm) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }
    setBusy(true);
    try {
      await register(username.trim(), password);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'inscription.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <MainLayout>
      <Panel className={styles.wrapper} padding="lg">
        <form className={styles.form} onSubmit={(e) => void handleSubmit(e)}>
          <h2 className={styles.title}>Créer un compte</h2>

          <Field label="Pseudo">
            <Input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              minLength={2}
              maxLength={20}
              required
            />
          </Field>

          <Field label="Mot de passe">
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              minLength={6}
              required
            />
          </Field>

          <Field label="Confirmer le mot de passe">
            <Input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              autoComplete="new-password"
              required
            />
          </Field>

          {error !== null && <p className={styles.error}>{error}</p>}

          <Button type="submit" fullWidth disabled={busy}>
            {busy ? 'Création…' : 'Créer le compte'}
          </Button>

          <p className={styles.switch}>
            Déjà un compte ? <Link to="/login">Se connecter</Link>
          </p>
        </form>
      </Panel>
    </MainLayout>
  );
}
