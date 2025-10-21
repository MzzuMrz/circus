import { useState, useEffect } from 'react';
import './Menu.css';

interface MenuProps {
  onStart?: () => void;
  onInfo?: () => void;
}

/**
 * Circus Finance - SEGA-Style Minimalist Menu
 *
 * Clean, simple, fits on screen. Like the classics.
 */
export const Menu: React.FC<MenuProps> = ({ onStart, onInfo }) => {
  const [blinkOn, setBlinkOn] = useState(true);
  const [selectedOption, setSelectedOption] = useState<'start' | 'info'>('start');

  useEffect(() => {
    const interval = setInterval(() => {
      setBlinkOn(prev => !prev);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      setSelectedOption(prev => prev === 'start' ? 'info' : 'start');
    }
    if (e.key === 'Enter' || e.key === ' ') {
      handleSelect();
    }
  };

  const handleSelect = () => {
    if (selectedOption === 'start') {
      onStart?.();
    } else {
      onInfo?.();
    }
  };

  return (
    <div className="sega-menu" onKeyDown={handleKeyDown} tabIndex={0}>
      {/* Black Background */}
      <div className="sky-gradient"></div>

      {/* Pixel Art Animations */}
      <div className="pixel-animations">
        {/* Circus Scene */}
        <div className="circus-charlie-scene-full">
          {/* Fire Hoops - Left and Right Sides Only */}
          <div className="fire-hoop hoop-left">
            <div className="hoop-ring"></div>
          </div>

          <div className="fire-hoop hoop-right">
            <div className="hoop-ring"></div>
          </div>

          {/* Single Elegant Clown Rider */}
          <div className="clown-bike">
            <div className="clown-sprite-red"></div>
          </div>

          {/* Platform/Ground */}
          <div className="circus-platform-full"></div>
        </div>

        {/* Subtle Floating Balloons */}
        {[...Array(2)].map((_, i) => (
          <div
            key={`balloon-${i}`}
            className="pixel-balloon"
            style={{
              left: `${30 + i * 40}%`,
              animationDelay: `${i * 2}s`,
              animationDuration: `${8 + i}s`
            }}
          >
            <div className={`balloon-body color-${i % 4}`}></div>
            <div className="balloon-string"></div>
          </div>
        ))}

        {/* Subtle Stars */}
        {[...Array(4)].map((_, i) => (
          <div
            key={`star-${i}`}
            className="pixel-star"
            style={{
              left: `${15 + i * 25}%`,
              top: `${10 + i * 10}%`,
              animationDelay: `${i * 0.5}s`
            }}
          />
        ))}
      </div>

      {/* Pixel Circus Tent */}
      <div className="circus-tent-bg"></div>

      {/* Main Content */}
      <div className="menu-main">

        {/* Title */}
        <div className="game-title">
          <h1 className="title-text">CIRCUS FINANCE</h1>
          <p className="subtitle-text">MONEY UNDER THE BIG TOP</p>
        </div>

        {/* Menu Options */}
        <div className="menu-list">
          <div
            className={`menu-option ${selectedOption === 'start' ? 'active' : ''}`}
            onClick={() => { setSelectedOption('start'); handleSelect(); }}
          >
            {selectedOption === 'start' && <span className="arrow">▶</span>}
            <span>START</span>
          </div>

          <div
            className={`menu-option ${selectedOption === 'info' ? 'active' : ''}`}
            onClick={() => { setSelectedOption('info'); handleSelect(); }}
          >
            {selectedOption === 'info' && <span className="arrow">▶</span>}
            <span>HOW TO PLAY</span>
          </div>
        </div>

        {/* Press Start */}
        <div className="press-start-container">
          {blinkOn && <p className="press-start-text">PRESS START</p>}
        </div>

        {/* Copyright */}
        <p className="copyright-text">© 2025 CIRCUS FINANCE</p>
      </div>
    </div>
  );
};
