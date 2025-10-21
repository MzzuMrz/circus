import { useState } from 'react';
import { Menu } from '@components/Menu/Menu';
import './App.css';

/**
 * Main Application Component
 *
 * Clean architecture, proper state management, zero compromises.
 */
function App() {
  const [currentView, setCurrentView] = useState<'menu' | 'game' | 'info'>('menu');

  const handleStart = () => {
    console.log('🎪 Game starting...');
    // Navigation logic will go here
    setCurrentView('game');
  };

  const handleInfo = () => {
    console.log('ℹ️ Info screen...');
    // Navigation logic will go here
    setCurrentView('info');
  };

  // Render based on current view
  const renderView = () => {
    switch (currentView) {
      case 'menu':
        return <Menu onStart={handleStart} onInfo={handleInfo} />;
      case 'game':
        return (
          <div className="placeholder-view">
            <h1>Game View Coming Soon</h1>
            <button onClick={() => setCurrentView('menu')}>Back to Menu</button>
          </div>
        );
      case 'info':
        return (
          <div className="placeholder-view">
            <h1>Info View Coming Soon</h1>
            <button onClick={() => setCurrentView('menu')}>Back to Menu</button>
          </div>
        );
      default:
        return <Menu onStart={handleStart} onInfo={handleInfo} />;
    }
  };

  return (
    <div className="app">
      {renderView()}
    </div>
  );
}

export default App;
