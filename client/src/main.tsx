import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { App } from './App';
import { GameStateProvider } from './contexts/GameStateContext';
import { SocketProvider } from './contexts/SocketContext';
import './styles/global.css';

const rootElement = document.getElementById('root');
if (rootElement === null) {
  throw new Error('Élément racine #root introuvable.');
}

createRoot(rootElement).render(
  <StrictMode>
    <BrowserRouter>
      <SocketProvider>
        <GameStateProvider>
          <App />
        </GameStateProvider>
      </SocketProvider>
    </BrowserRouter>
  </StrictMode>,
);
