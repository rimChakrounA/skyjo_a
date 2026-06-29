import { Route, Routes } from 'react-router-dom';
import { GamePage } from '@/pages/GamePage';
import { HomePage } from '@/pages/HomePage';
import { RoomPage } from '@/pages/RoomPage';

export function App(): JSX.Element {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/room/:code" element={<RoomPage />} />
      <Route path="/game/:code" element={<GamePage />} />
    </Routes>
  );
}
