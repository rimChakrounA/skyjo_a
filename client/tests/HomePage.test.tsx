import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { AuthContext } from '@/contexts/AuthContext';
import { HomePage } from '@/pages/HomePage';

vi.mock('@/services/roomsService', () => ({
  fetchPublicRooms: vi.fn().mockResolvedValue([]),
}));

vi.mock('@/services/socket', () => ({
  createRoom: vi.fn(),
  ensureSocketConnected: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('@/hooks/useSocket', () => ({
  useSocket: () => ({ connected: true }),
}));

const authValue = {
  user: null,
  loading: false,
  login: vi.fn(),
  register: vi.fn(),
  logout: vi.fn(),
};

function renderHome(): ReturnType<typeof render> {
  return render(
    <AuthContext.Provider value={authValue}>
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    </AuthContext.Provider>,
  );
}

describe('HomePage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('affiche l’écran landing par défaut', () => {
    renderHome();
    expect(screen.getByText('Jouer en invité')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Se connecter' })).toBeInTheDocument();
    expect(screen.queryByText(/Bienvenue,/)).not.toBeInTheDocument();
  });

  it('passe au dashboard après « Continuer en invité »', () => {
    renderHome();
    fireEvent.change(screen.getByPlaceholderText('Choisissez un pseudo'), {
      target: { value: 'Rima' },
    });
    fireEvent.click(screen.getByText('Continuer en invité'));
    expect(screen.getByText('Bienvenue, Rima !')).toBeInTheDocument();
    expect(screen.getByText('Créer une partie')).toBeInTheDocument();
    expect(screen.queryByText('Jouer en invité')).not.toBeInTheDocument();
  });

  it('revient au landing invité au clic sur le logo', () => {
    renderHome();
    fireEvent.change(screen.getByPlaceholderText('Choisissez un pseudo'), {
      target: { value: 'Rima' },
    });
    fireEvent.click(screen.getByText('Continuer en invité'));
    fireEvent.click(screen.getByRole('button', { name: 'Skyjo Online — retour à l’accueil' }));
    expect(screen.getByText('Jouer en invité')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Rima')).toBeInTheDocument();
    expect(screen.queryByText(/Bienvenue,/)).not.toBeInTheDocument();
  });

  it('affiche le landing au rechargement même si un ancien état invité est stocké', () => {
    localStorage.setItem('skyjo.guestReady', 'true');
    localStorage.setItem('skyjo.playerName', 'Rima');
    renderHome();
    expect(screen.getByText('Jouer en invité')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Rima')).toBeInTheDocument();
    expect(screen.queryByText(/Bienvenue,/)).not.toBeInTheDocument();
  });
});
