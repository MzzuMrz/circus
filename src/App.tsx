import { useState } from 'react';
import { Menu } from '@components/Menu/Menu';
import { GameSelection } from '@components/GameSelection/GameSelection';
import { StakingRaffle } from '@components/StakingRaffle/StakingRaffle';
import './App.css';

/**
 * Main Application Component
 *
 * Clean architecture, proper state management, zero compromises.
 */
function App() {
  const [currentView, setCurrentView] = useState<'menu' | 'game-selection' | 'game' | 'info'>('menu');
  const [selectedGame, setSelectedGame] = useState<string | null>(null);

  const handleStart = () => {
    console.log('🎪 Opening game selection...');
    setCurrentView('game-selection');
  };

  const handleInfo = () => {
    console.log('ℹ️ Info screen...');
    setCurrentView('info');
  };

  const handleSelectGame = (gameId: string) => {
    console.log('🎮 Selected game:', gameId);
    setSelectedGame(gameId);
    setCurrentView('game');
  };

  const handleBackToGameSelection = () => {
    console.log('🔙 Back to game selection...');
    setCurrentView('game-selection');
  };

  // Render based on current view
  const renderView = () => {
    switch (currentView) {
      case 'menu':
        return (
          <Menu
            onStart={handleStart}
            onInfo={handleInfo}
          />
        );
      case 'game-selection':
        return (
          <GameSelection
            onSelectGame={handleSelectGame}
            onBack={() => setCurrentView('menu')}
          />
        );
      case 'game':
        // Render specific game component based on selectedGame
        switch (selectedGame) {
          case 'staking-raffle':
            return <StakingRaffle onBack={handleBackToGameSelection} />;

          // Placeholder for other games
          default:
            return (
              <div className="placeholder-view">
                <h1>🎪 {getGameTitle(selectedGame)}</h1>
                <p className="game-id">Game ID: {selectedGame}</p>
                <p>Game view coming soon...</p>
                <button onClick={handleBackToGameSelection}>Back to Games</button>
              </div>
            );
        }
      case 'info':
        return (
          <div className="placeholder-view">
            <h1>ℹ️ How to Play</h1>
            <p>Info view coming soon...</p>
            <button onClick={() => setCurrentView('menu')}>Back to Menu</button>
          </div>
        );
      default:
        return (
          <Menu
            onStart={handleStart}
            onInfo={handleInfo}
          />
        );
    }
  };

  const getGameTitle = (gameId: string | null): string => {
    const gameTitles: Record<string, string> = {
      'staking-raffle': 'Staking Pool Raffle',
      'balloon-game': 'Balloon Game',
      'scratch-card': 'Scratch Card Experience',
      'community-raffles': 'Community Raffles Marketplace',
      'prediction-markets': 'Prediction Markets',
      'monkey-battles': 'Monkey Battles Arena',
      'dashboard': 'Dashboard/Wallet View',
      'pro-mode': 'Pro Mode'
    };
    return gameTitles[gameId || ''] || 'Unknown Game';
  };

  return (
    <div className="app">
      {renderView()}
    </div>
  );
}

export default App;
