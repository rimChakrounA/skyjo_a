import { useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { useSocket } from '@/hooks/useSocket';
import { GamePage } from '@/pages/GamePage';
import { HomePage } from '@/pages/HomePage';
import { LoginPage } from '@/pages/LoginPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { RegisterPage } from '@/pages/RegisterPage';
import { RoomPage } from '@/pages/RoomPage';

function ReconnectNavigator(): null {
  const navigate = useNavigate();
  const { reconnectedRoom, clearReconnectedRoom } = useSocket();

  useEffect(() => {
    if (reconnectedRoom === null) return;
    if (reconnectedRoom.status === 'in-game') {
      navigate(`/game/${reconnectedRoom.code}`);
    } else {
      navigate(`/room/${reconnectedRoom.code}`);
    }
    clearReconnectedRoom();
  }, [reconnectedRoom, navigate, clearReconnectedRoom]);

  return null;
}

export function App(): JSX.Element {
  return (
    <>
      <ReconnectNavigator />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/room/:code" element={<RoomPage />} />
        <Route path="/game/:code" element={<GamePage />} />
      </Routes>
    </>
  );
}
