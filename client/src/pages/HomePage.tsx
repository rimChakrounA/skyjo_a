import { MAX_PLAYERS, MIN_PLAYERS } from '@shared/constants/game.js';

import type { PublicRoomListItem } from '@shared/types/room.js';

import { useCallback, useEffect, useState } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { GlobalStatsBar } from '@/components/home/GlobalStatsBar';

import { LandingAuthGrid } from '@/components/home/LandingAuthGrid';

import { SceneShell } from '@/components/home/SceneShell';

import { SkyjoLogo } from '@/components/home/SkyjoLogo';

import { UserStatsBar } from '@/components/home/UserStatsBar';

import { WelcomeBanner } from '@/components/home/WelcomeBanner';

import { JoinForm } from '@/components/JoinForm';

import { RoomList } from '@/components/RoomList';

import { useAuth } from '@/hooks/useAuth';

import { usePlayerIdentity } from '@/hooks/usePlayerIdentity';

import { useUserStats } from '@/hooks/useUserStats';

import { MainLayout } from '@/layouts/MainLayout';

import { saveGuestReady } from '@/services/identity';

import { fetchPublicRooms } from '@/services/roomsService';

import { createRoom, joinRoom } from '@/services/socket';

import type { RoomLocationState } from '@/types/navigation';

import styles from './HomePage.module.css';



const ROOMS_POLL_MS = 8000;



export function HomePage(): JSX.Element {

  const navigate = useNavigate();

  const { code: inviteCode } = useParams<{ code?: string }>();

  const { user } = useAuth();

  const { name, setName } = usePlayerIdentity();

  const [guestReady, setGuestReady] = useState(false);

  const [code, setCode] = useState(inviteCode ?? '');

  const [minPlayers, setMinPlayers] = useState(MIN_PLAYERS);

  const [maxPlayers, setMaxPlayers] = useState(MAX_PLAYERS);

  const [busy, setBusy] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [guestError, setGuestError] = useState<string | null>(null);

  const [rooms, setRooms] = useState<PublicRoomListItem[]>([]);

  const [roomsLoading, setRoomsLoading] = useState(true);

  const [roomsError, setRoomsError] = useState<string | null>(null);



  const isDashboard =

    user !== null || (guestReady && name.trim().length > 0);

  const displayName = user?.username ?? name.trim();

  const isLoggedIn = user !== null;
  const { stats: userStats, loading: statsLoading } = useUserStats(isLoggedIn);



  const resetLanding = useCallback((): void => {

    setGuestReady(false);

    saveGuestReady(false);

    setGuestError(null);

  }, []);



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

    if (user !== null) {

      setName(user.username);

    } else {

      resetLanding();

    }

  }, [user, setName, resetLanding]);



  useEffect(() => {

    if (inviteCode !== undefined && inviteCode.length > 0 && displayName.length > 0) {

      setCode(inviteCode);

    }

  }, [inviteCode, displayName]);



  const ensureName = (): boolean => {

    if (displayName.length === 0) {

      setError('Veuillez saisir un pseudo.');

      return false;

    }

    return true;

  };



  const handleGuestContinue = (): void => {

    setGuestError(null);

    if (name.trim().length === 0) {

      setGuestError('Veuillez saisir un pseudo.');

      return;

    }

    setGuestReady(true);

  };



  const handleCreate = async (): Promise<void> => {

    if (!ensureName()) return;

    setBusy(true);

    setError(null);

    const response = await createRoom(displayName, { minPlayers, maxPlayers });

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

    const response = await joinRoom(joinCode.trim(), displayName);

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



  const handleGuestBrandClick = user === null ? resetLanding : undefined;
  const brandClickProps =
    handleGuestBrandClick !== undefined ? { onBrandClick: handleGuestBrandClick } : {};

  return (

    <MainLayout variant="scene" {...brandClickProps}>

      <SceneShell

        footer={

          <footer

            className={

              isDashboard && isLoggedIn ? styles.woodFooter : styles.lightFooter

            }

          >

            {isDashboard && isLoggedIn ? (

              <UserStatsBar stats={userStats} loading={statsLoading} />

            ) : (

              <GlobalStatsBar rooms={rooms} />

            )}

          </footer>

        }

      >

          <SkyjoLogo {...(handleGuestBrandClick !== undefined ? { onClick: handleGuestBrandClick } : {})} />



          {!isDashboard ? (

            <>

              <p className={styles.tagline}>

                Le célèbre jeu de cartes à jouer entre amis

              </p>

              <LandingAuthGrid

                name={name}

                busy={busy}

                error={guestError}

                onNameChange={setName}

                onContinue={handleGuestContinue}

              />

            </>

          ) : (

            <>

              <WelcomeBanner name={displayName} />



              <JoinForm

                code={code}

                minPlayers={minPlayers}

                maxPlayers={maxPlayers}

                busy={busy}

                error={error}

                onCodeChange={setCode}

                onMinPlayersChange={handleMinPlayersChange}

                onMaxPlayersChange={handleMaxPlayersChange}

                onCreate={() => void handleCreate()}

                onJoin={() => void handleJoin()}

              />

              <div className={styles.roomsSection}>

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

              </div>

            </>

          )}

      </SceneShell>

    </MainLayout>

  );

}

