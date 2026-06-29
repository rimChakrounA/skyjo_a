import styles from './JoinForm.module.css';

export interface JoinFormProps {
  name: string;
  code: string;
  busy: boolean;
  error: string | null;
  onNameChange: (value: string) => void;
  onCodeChange: (value: string) => void;
  onCreate: () => void;
  onJoin: () => void;
}

export function JoinForm({
  name,
  code,
  busy,
  error,
  onNameChange,
  onCodeChange,
  onCreate,
  onJoin,
}: JoinFormProps): JSX.Element {
  return (
    <div className={styles.card}>
      <label className={styles.field}>
        <span>Pseudo</span>
        <input
          value={name}
          maxLength={20}
          placeholder="Votre nom"
          onChange={(event) => onNameChange(event.target.value)}
        />
      </label>

      <div className={styles.actions}>
        <button type="button" disabled={busy} onClick={onCreate}>
          Créer une salle
        </button>
      </div>

      <div className={styles.separator}>ou</div>

      <label className={styles.field}>
        <span>Code de salle</span>
        <input
          value={code}
          maxLength={8}
          placeholder="Ex : ABCDE"
          onChange={(event) => onCodeChange(event.target.value.toUpperCase())}
        />
      </label>

      <div className={styles.actions}>
        <button type="button" className="secondary" disabled={busy} onClick={onJoin}>
          Rejoindre
        </button>
      </div>

      {error !== null && <p className={styles.error}>{error}</p>}
    </div>
  );
}
