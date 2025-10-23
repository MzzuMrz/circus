import { useState, useEffect } from 'react';
import './StakingRaffle.css';

interface StakingRaffleProps {
  onBack: () => void;
}

type EpochStatus = 'Active' | 'Ended' | 'Completed';

export const StakingRaffle: React.FC<StakingRaffleProps> = ({ onBack }) => {
  const [ticketsToBuy, setTicketsToBuy] = useState(1);

  // Modal states
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);

  // Mock epoch data
  const [epochId] = useState(47);
  const [epochStatus] = useState<EpochStatus>('Active'); // Change to 'Completed' to test results screen

  // Mock countdown - starts at 5 hours
  const [timeRemaining, setTimeRemaining] = useState({
    hours: 5,
    minutes: 42,
    seconds: 18
  });

  // Mock pool data
  const [accruedInterest] = useState(12.5); // Total interest accumulated
  const [totalParticipants] = useState(89);
  const [totalTicketsSold] = useState(847);
  const [totalStaked] = useState(847); // Total SOL staked (1 SOL per ticket)

  // Mock user data
  const [userTickets] = useState(15); // User owns 15 tickets
  const [userTicketRange] = useState({ start: 23, end: 37 }); // Tickets 23-37

  // Mock results data (for Completed epochs)
  const [winningTicket] = useState(342);
  const [randomNumber] = useState('0x7f8a9b2c...');
  const [userWon] = useState(false); // Set to true to test winning state
  const [userStake] = useState(15); // 15 SOL staked

  // Constants
  const TICKET_PRICE = 1; // 1 SOL per ticket
  const PROTOCOL_FEE = 0.03; // 3% fee


  // Countdown animation (mock)
  useEffect(() => {
    const countdownInterval = setInterval(() => {
      setTimeRemaining(prev => {
        let { hours, minutes, seconds } = prev;

        seconds--;
        if (seconds < 0) {
          seconds = 59;
          minutes--;
          if (minutes < 0) {
            minutes = 59;
            hours--;
            if (hours < 0) {
              hours = 0;
              minutes = 0;
              seconds = 0;
            }
          }
        }

        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onBack();
    }
  };

  const formatNumber = (num: number) => {
    return num.toString().padStart(2, '0');
  };

  const handleTicketChange = (value: string) => {
    const num = parseInt(value) || 0;
    if (num >= 0 && num <= 999) {
      setTicketsToBuy(num);
    }
  };

  const calculateTotal = () => {
    return ticketsToBuy * TICKET_PRICE;
  };

  const calculateFee = () => {
    return calculateTotal() * PROTOCOL_FEE;
  };

  const calculateFinalAmount = () => {
    return calculateTotal() + calculateFee();
  };

  const getStatusColor = () => {
    switch (epochStatus) {
      case 'Active': return '#00FF88';
      case 'Ended': return '#FFD700';
      case 'Completed': return '#FF0066';
      default: return '#FFFFFF';
    }
  };

  const handleBuyClick = () => {
    setShowConfirmation(true);
  };

  const handleConfirmPurchase = () => {
    setShowConfirmation(false);
    setIsPurchasing(true);

    // Simulate transaction
    setTimeout(() => {
      setIsPurchasing(false);
      setShowSuccess(true);
    }, 2000);
  };

  const handleCancelPurchase = () => {
    setShowConfirmation(false);
  };

  const handleCloseSuccess = () => {
    setShowSuccess(false);
    setTicketsToBuy(1); // Reset input
  };

  return (
    <div className="staking-raffle-screen" onKeyDown={handleKeyDown} tabIndex={0}>
      {/* Background with CRT effects */}
      <div className="raffle-bg">
        <div className="raffle-scanlines"></div>
        <div className="raffle-stars"></div>
      </div>

      {/* Main Content */}
      <div className="raffle-content">

        {/* Header with Epoch Info */}
        <div className="raffle-header">
          <div className="epoch-info-display">
            <div className="epoch-number">EPOCH #{epochId}</div>
            <div className="epoch-status" style={{ color: getStatusColor() }}>
              ● {epochStatus.toUpperCase()}
            </div>
          </div>

          <div className="raffle-title">
            <h1>STAKING LOTTERY</h1>
            <p className="raffle-subtitle">BUY TICKETS • WIN THE POOL • WINNER TAKES ALL</p>
          </div>

          <div className="prize-pool-display">
            <div className="prize-label">TOTAL INTEREST</div>
            <div className="prize-amount">{accruedInterest.toFixed(2)} SOL</div>
            <div className="prize-sublabel">WINNER GETS: STAKE + INTEREST</div>
          </div>
        </div>

        {/* Countdown Timer */}
        <div className="countdown-section">
          <div className="countdown-label">NEXT DRAW</div>
          <div className="countdown-timer">
            <div className="time-segment">
              <div className="time-digit">{formatNumber(timeRemaining.hours)}</div>
              <div className="time-unit">HOURS</div>
            </div>
            <div className="time-separator">:</div>
            <div className="time-segment">
              <div className="time-digit">{formatNumber(timeRemaining.minutes)}</div>
              <div className="time-unit">MINUTES</div>
            </div>
            <div className="time-separator">:</div>
            <div className="time-segment">
              <div className="time-digit">{formatNumber(timeRemaining.seconds)}</div>
              <div className="time-unit">SECONDS</div>
            </div>
          </div>
        </div>

        {/* Status Banner for Ended Epoch */}
        {epochStatus === 'Ended' && (
          <div className="status-banner ended-banner">
            <div className="banner-icon">⏳</div>
            <div className="banner-content">
              <div className="banner-title">EPOCH CLOSED</div>
              <div className="banner-subtitle">Drawing winner... Results coming soon!</div>
            </div>
          </div>
        )}

        {/* Results Screen - Shown when epoch is Completed */}
        {epochStatus === 'Completed' ? (
          <div className="results-screen">
            {userWon ? (
              // Winner View
              <div className="result-container winner">
                <div className="result-icon">🎉</div>
                <div className="result-title">CONGRATULATIONS!</div>
                <div className="result-subtitle">YOU WON THE LOTTERY!</div>

                <div className="prize-breakdown">
                  <div className="breakdown-row main">
                    <span className="breakdown-label">YOUR PRIZE</span>
                    <span className="breakdown-value">{(userStake + accruedInterest).toFixed(2)} SOL</span>
                  </div>
                  <div className="breakdown-divider"></div>
                  <div className="breakdown-row">
                    <span className="breakdown-label">Original Stake</span>
                    <span className="breakdown-value">{userStake} SOL</span>
                  </div>
                  <div className="breakdown-row">
                    <span className="breakdown-label">Interest Won</span>
                    <span className="breakdown-value highlight">+{accruedInterest.toFixed(2)} SOL</span>
                  </div>
                </div>

                <div className="winning-details">
                  <div className="detail-card">
                    <div className="detail-label">WINNING TICKET</div>
                    <div className="detail-value">#{winningTicket}</div>
                  </div>
                  <div className="detail-card">
                    <div className="detail-label">RANDOM NUMBER</div>
                    <div className="detail-value">{randomNumber}</div>
                  </div>
                </div>

                <button className="result-action-button winner-button" onClick={onBack}>
                  JOIN NEXT EPOCH
                </button>
              </div>
            ) : (
              // Loser View
              <div className="result-container loser">
                <div className="result-icon">😔</div>
                <div className="result-title">BETTER LUCK NEXT TIME</div>
                <div className="result-subtitle">YOUR STAKE HAS BEEN RETURNED</div>

                <div className="prize-breakdown neutral">
                  <div className="breakdown-row main">
                    <span className="breakdown-label">STAKE RETURNED</span>
                    <span className="breakdown-value">{userStake} SOL</span>
                  </div>
                  <div className="breakdown-divider"></div>
                  <div className="breakdown-row">
                    <span className="breakdown-label">Your Tickets</span>
                    <span className="breakdown-value">{userTickets} tickets</span>
                  </div>
                  <div className="breakdown-row">
                    <span className="breakdown-label">Ticket Range</span>
                    <span className="breakdown-value">#{userTicketRange.start} - #{userTicketRange.end}</span>
                  </div>
                </div>

                <div className="winning-details">
                  <div className="detail-card">
                    <div className="detail-label">WINNING TICKET</div>
                    <div className="detail-value">#{winningTicket}</div>
                  </div>
                  <div className="detail-card">
                    <div className="detail-label">RANDOM NUMBER</div>
                    <div className="detail-value">{randomNumber}</div>
                  </div>
                </div>

                <button className="result-action-button loser-button" onClick={onBack}>
                  TRY NEXT EPOCH
                </button>
              </div>
            )}
          </div>
        ) : (
          // Main Content Grid - Active/Ended epochs
          <div className={`main-content-grid ${epochStatus === 'Ended' ? 'epoch-ended' : ''}`}>

          {/* Left Column: Pool Stats */}
          <div className="pool-stats-section">
            <div className="section-title">POOL STATISTICS</div>

            <div className="stat-card">
              <div className="stat-icon">👥</div>
              <div className="stat-info">
                <div className="stat-label">PARTICIPANTS</div>
                <div className="stat-value">{totalParticipants}</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">🎟️</div>
              <div className="stat-info">
                <div className="stat-label">TOTAL TICKETS</div>
                <div className="stat-value">{totalTicketsSold}</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">💰</div>
              <div className="stat-info">
                <div className="stat-label">TOTAL STAKED</div>
                <div className="stat-value">{totalStaked} SOL</div>
              </div>
            </div>

            <div className="stat-card highlight">
              <div className="stat-icon">🎫</div>
              <div className="stat-info">
                <div className="stat-label">YOUR TICKETS</div>
                <div className="stat-value">
                  {userTickets > 0 ? userTickets : '0'}
                </div>
                {userTickets > 0 && (
                  <div className="stat-sublabel">
                    RANGE: #{userTicketRange.start} - #{userTicketRange.end}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Buy Tickets */}
          <div className="buy-tickets-section">
            <div className="section-title">BUY TICKETS</div>

            <div className="ticket-purchase-card">
              <div className="ticket-input-group">
                <label className="input-label">NUMBER OF TICKETS</label>
                <div className="ticket-input-wrapper">
                  <button
                    className="ticket-btn ticket-btn-minus"
                    onClick={() => handleTicketChange((ticketsToBuy - 1).toString())}
                    disabled={ticketsToBuy <= 0}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    className="ticket-input"
                    value={ticketsToBuy}
                    onChange={(e) => handleTicketChange(e.target.value)}
                    min="0"
                    max="999"
                  />
                  <button
                    className="ticket-btn ticket-btn-plus"
                    onClick={() => handleTicketChange((ticketsToBuy + 1).toString())}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="calculation-display">
                <div className="calc-row">
                  <span className="calc-label">{ticketsToBuy} TICKETS × {TICKET_PRICE} SOL</span>
                  <span className="calc-value">{calculateTotal().toFixed(2)} SOL</span>
                </div>
                <div className="calc-row fee">
                  <span className="calc-label">PROTOCOL FEE (3%)</span>
                  <span className="calc-value">+{calculateFee().toFixed(2)} SOL</span>
                </div>
                <div className="calc-divider"></div>
                <div className="calc-row total">
                  <span className="calc-label">TOTAL</span>
                  <span className="calc-value">{calculateFinalAmount().toFixed(2)} SOL</span>
                </div>
              </div>

              <button
                className="buy-button"
                disabled={ticketsToBuy === 0 || epochStatus !== 'Active' || isPurchasing}
                onClick={handleBuyClick}
              >
                {isPurchasing ? 'PROCESSING...' : (epochStatus === 'Active' ? 'CONFIRM PURCHASE' : 'EPOCH CLOSED')}
              </button>

              {/* Dynamic Ticket Preview */}
              {ticketsToBuy > 0 && epochStatus === 'Active' && (
                <div className="ticket-preview-section">
                  <div className="section-subtitle preview-label">TICKETS YOU WILL RECEIVE</div>
                  <div className="ticket-range-display">
                    {Array.from({ length: Math.min(ticketsToBuy, 20) }, (_, i) => {
                      const ticketNumber = totalTicketsSold + 1 + i;
                      return (
                        <div key={ticketNumber} className="ticket-number preview">
                          #{ticketNumber}
                        </div>
                      );
                    })}
                    {ticketsToBuy > 20 && (
                      <div className="ticket-number more preview">
                        +{ticketsToBuy - 20} MORE
                      </div>
                    )}
                  </div>
                  <div className="ticket-summary">
                    {ticketsToBuy === 1
                      ? `TICKET #${totalTicketsSold + 1}`
                      : `TICKETS #${totalTicketsSold + 1} - #${totalTicketsSold + ticketsToBuy}`
                    }
                  </div>
                </div>
              )}
            </div>

            {/* Visual Ticket Representation - Owned Tickets */}
            {userTickets > 0 && (
              <div className="ticket-visual-section">
                <div className="section-subtitle">YOUR CURRENT TICKETS</div>
                <div className="ticket-range-display">
                  {Array.from({ length: Math.min(userTickets, 20) }, (_, i) => {
                    const ticketNumber = userTicketRange.start + i;
                    return (
                      <div key={ticketNumber} className="ticket-number owned">
                        #{ticketNumber}
                      </div>
                    );
                  })}
                  {userTickets > 20 && (
                    <div className="ticket-number more owned">
                      +{userTickets - 20} MORE
                    </div>
                  )}
                </div>
                <div className="ticket-summary">
                  TICKETS #{userTicketRange.start} - #{userTicketRange.end}
                </div>
              </div>
            )}
          </div>
        </div>
        )}

        {/* Action Bar */}
        <div className="raffle-footer">
          <div className="action-instructions">
            <p>1 TICKET = 1 SOL • WINNER TAKES ALL • ESC BACK</p>
          </div>

          <div className="action-buttons">
            <button className="raffle-button button-back" onClick={onBack}>
              ← BACK TO GAMES
            </button>
          </div>
        </div>

      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="modal-overlay" onClick={handleCancelPurchase}>
          <div className="modal-content confirmation-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-icon">⚠️</div>
              <h2 className="modal-title">CONFIRM PURCHASE</h2>
            </div>

            <div className="modal-body">
              <div className="confirmation-details">
                <div className="confirm-row">
                  <span className="confirm-label">TICKETS</span>
                  <span className="confirm-value">{ticketsToBuy} {ticketsToBuy === 1 ? 'TICKET' : 'TICKETS'}</span>
                </div>
                <div className="confirm-row">
                  <span className="confirm-label">TICKET RANGE</span>
                  <span className="confirm-value">
                    {ticketsToBuy === 1
                      ? `#${totalTicketsSold + 1}`
                      : `#${totalTicketsSold + 1} - #${totalTicketsSold + ticketsToBuy}`
                    }
                  </span>
                </div>
                <div className="confirm-divider"></div>
                <div className="confirm-row">
                  <span className="confirm-label">COST</span>
                  <span className="confirm-value">{calculateTotal().toFixed(2)} SOL</span>
                </div>
                <div className="confirm-row">
                  <span className="confirm-label">FEE (3%)</span>
                  <span className="confirm-value fee">+{calculateFee().toFixed(2)} SOL</span>
                </div>
                <div className="confirm-divider"></div>
                <div className="confirm-row total">
                  <span className="confirm-label">TOTAL</span>
                  <span className="confirm-value">{calculateFinalAmount().toFixed(2)} SOL</span>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="modal-button cancel-button" onClick={handleCancelPurchase}>
                CANCEL
              </button>
              <button className="modal-button confirm-button" onClick={handleConfirmPurchase}>
                CONFIRM
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccess && (
        <div className="modal-overlay" onClick={handleCloseSuccess}>
          <div className="modal-content success-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header success">
              <div className="modal-icon success">✓</div>
              <h2 className="modal-title">PURCHASE SUCCESSFUL!</h2>
            </div>

            <div className="modal-body">
              <div className="success-message">
                <p className="success-text">Your tickets have been added to the lottery!</p>
                <div className="success-tickets">
                  <div className="success-label">YOU RECEIVED</div>
                  <div className="success-value">
                    {ticketsToBuy} {ticketsToBuy === 1 ? 'TICKET' : 'TICKETS'}
                  </div>
                  <div className="success-range">
                    {ticketsToBuy === 1
                      ? `TICKET #${totalTicketsSold + 1}`
                      : `TICKETS #${totalTicketsSold + 1} - #${totalTicketsSold + ticketsToBuy}`
                    }
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="modal-button close-button" onClick={handleCloseSuccess}>
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
