import { MAX_PLAYERS, MIN_PLAYERS } from '@shared/constants/game.js';
import type { PublicRoomListItem } from '@shared/types/room.js';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { JoinForm } from '@/components/JoinForm';
import { RoomList } from '@/components/RoomList';
import { usePlayerIdentity } from '@/hooks/usePlayerIdentity';
import { MainLayout } from '@/layouts/MainLayout';
import { fetchPublicRooms } from '@/services/roomsService';
import { createRoom, joinRoom } from '@/services/socket';
import type { RoomLocationState } from '@/types/navigation';

const ROOMS_POLL_MS = 8000;

export function HomePage(): JSX.Element {
  const navigate = useNavigate();
  const { code: inviteCode } = useParams<{ code?: string }>();
  const { name, setName } = usePlayerIdentity();
  const [code, setCode] = useState(inviteCode ?? '');
  const [minPlayers, setMinPlayers] = useState(MIN_PLAYERS);
  const [maxPlayers, setMaxPlayers] = useState(MAX_PLAYERS);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rooms, setRooms] = useState<PublicRoomListItem[]>([]);
  const [roomsLoading, setRoomsLoading] = useState(true);
  const [roomsError, setRoomsError] = useState<string | null>(null);

  const loadRooms = useCallback(async (): Promise<void> => {
    try {
      const list = await fetchPublicRooms();
      setRooms(list);
      setRoomsError(null);
    } catch {
      setRoomsError('Impossible de charger les salles.');
    } finally {
      setRoomsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadRooms();
    const timer = window.setInterval(() => void loadRooms(), ROOMS_POLL_MS);
    return () => window.clearInterval(timer);
  }, [loadRooms]);

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
    const response = await createRoom(name.trim(), { minPlayers, maxPlayers });
    setBusy(false);
    if (response.ok) {
      const state: RoomLocationState = { room: response.data.room };
      navigate(`/room/${response.data.room.code}`, { state });
    } else {
      setError(response.error);
    }
  };

  const handleJoin = async (joinCode: string = code): Promise<void> => {
    if (!ensureName()) return;
    if (joinCode.trim().length === 0) {
      setError('Veuillez saisir un code de salle.');
      return;
    }
    setBusy(true);
    setError(null);
    const response = await joinRoom(joinCode.trim(), name.trim());
    setBusy(false);
    if (response.ok) {
      const state: RoomLocationState = { room: response.data.room };
      navigate(`/room/${response.data.room.code}`, { state });
    } else {
      setError(response.error);
    }
  };

  const handleMinPlayersChange = (value: number): void => {
    setMinPlayers(value);
    if (value > maxPlayers) {
      setMaxPlayers(value);
    }
  };

  const handleMaxPlayersChange = (value: number): void => {
    setMaxPlayers(value);
    if (value < minPlayers) {
      setMinPlayers(value);
    }
  };

  return (
    <MainLayout>
      <JoinForm
        name={name}
        code={code}
        minPlayers={minPlayers}
        maxPlayers={maxPlayers}
        busy={busy}
        error={error}
        onNameChange={setName}
        onCodeChange={setCode}
        onMinPlayersChange={handleMinPlayersChange}
        onMaxPlayersChange={handleMaxPlayersChange}
        onCreate={() => void handleCreate()}
        onJoin={() => void handleJoin()}
      />
      <RoomList
        rooms={rooms}
        loading={roomsLoading}
        error={roomsError}
        busy={busy}
        onJoin={(roomCode) => {
          setCode(roomCode);
          void handleJoin(roomCode);
        }}
      />
    </MainLayout>
  );
}
