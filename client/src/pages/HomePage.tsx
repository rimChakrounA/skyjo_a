import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { JoinForm } from '@/components/JoinForm';
import { usePlayerIdentity } from '@/hooks/usePlayerIdentity';
import { MainLayout } from '@/layouts/MainLayout';
import { createRoom, joinRoom } from '@/services/socket';
import type { RoomLocationState } from '@/types/navigation';

export function HomePage(): JSX.Element {
  const navigate = useNavigate();
  const { code: inviteCode } = useParams<{ code?: string }>();
  const { name, setName } = usePlayerIdentity();
  const [code, setCode] = useState(inviteCode ?? '');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Si un code d'invitation est dans l'URL, rejoindre automatiquement si le pseudo est renseigné
  useEffect(() => {
    if (inviteCode !== undefined && inviteCode.length > 0 && name.trim().length > 0) {
      setCode(inviteCode);
    }
  }, [inviteCode, name]);

  const ensureName = (): boolean => {
    if (name.trim().length === 0) {
      setError('Veuillez saisir un pseudo.');
      return false;
    }
    return true;
  };

  const handleCreate = async (): Promise<void> => {
    if (!ensureName()) return;
    setBusy(true);
    setError(null);
    const response = await createRoom(name.trim());
    setBusy(false);
    if (response.ok) {
      const state: RoomLocationState = { room: response.data.room };
      navigate(`/room/${response.data.room.code}`, { state });
    } else {
      setError(response.error);
    }
  };

  const handleJoin = async (): Promise<void> => {
    if (!ensureName()) return;
    if (code.trim().length === 0) {
      setError('Veuillez saisir un code de salle.');
      return;
    }
    setBusy(true);
    setError(null);
    const response = await joinRoom(code.trim(), name.trim());
    setBusy(false);
    if (response.ok) {
      const state: RoomLocationState = { room: response.data.room };
      navigate(`/room/${response.data.room.code}`, { state });
    } else {
      setError(response.error);
    }
  };

  return (
    <MainLayout>
      <JoinForm
        name={name}
        code={code}
        busy={busy}
        error={error}
        onNameChange={setName}
        onCodeChange={setCode}
        onCreate={() => void handleCreate()}
        onJoin={() => void handleJoin()}
      />
    </MainLayout>
  );
}
