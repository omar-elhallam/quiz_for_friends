import React, { useState, useEffect } from 'react';
import '../styles/Game.css';

const SERVER_URL = process.env.REACT_APP_SERVER_URL || 'https://weekly-jessica-4t0m-ffbd776b.koyeb.app';

function Game({ question, roundInfo, timeLeft, hasAnswered, onSubmitAnswer, isAdmin, answerCount, players, countdown, isCountdown, wrongAnswerFeedback }) {
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [textAnswer, setTextAnswer] = useState('');
  const [lightboxImage, setLightboxImage] = useState(null);

  // Close lightbox on Escape key and prevent body scroll when open
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setLightboxImage(null);
      }
    };

    if (lightboxImage) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [lightboxImage]);

  if (!question) {
    return <div className="loading">Loading question...</div>;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!hasAnswered) {
      const answer = question.questionType === 'qcm' ? selectedAnswer : textAnswer;
      if (answer.trim()) {
        onSubmitAnswer(answer.trim());
      }
    }
  };

  const handleOptionClick = (option) => {
    if (!hasAnswered) {
      setSelectedAnswer(option);
      onSubmitAnswer(option);
    }
  };

  return (
    <div className="game-container">
      {/* Countdown Overlay */}
      {isCountdown && countdown !== null && (
        <div className="countdown-overlay">
          <div className="countdown-number">{countdown}</div>
        </div>
      )}

      {/* Player Sidebar */}
      <div className="game-players-sidebar">
        <h3>Players</h3>
        {players && players.map((player, index) => (
          <div key={index} className={`game-player-box ${player.connected === false ? 'disconnected' : ''}`}>
            <div className="game-player-username">{player.username || `Player${index + 1}`}</div>
            <div className="game-player-nickname">{player.name}</div>
            <div className="game-player-score">{player.score || 0} pts</div>
            {question && question.questionType !== 'qcm' && (
              <div className="game-player-lives">
                {[1, 2, 3].map(lifeNum => {
                  let boxClass = 'game-life-box';
                  const livesLost = 3 - (player.lives !== undefined ? player.lives : 3);
                  
                  if (lifeNum <= livesLost) {
                    // This life was lost (red)
                    boxClass += ' lost';
                  } else if (player.answeredCorrectly && lifeNum === livesLost + 1) {
                    // First remaining life turns green when correct
                    boxClass += ' correct';
                  }
                  return <div key={lifeNum} className={boxClass} />;
                })}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Header with Timer */}
      <div className="game-header">
        <h2 className="game-round-info">Round {roundInfo.round}/{roundInfo.total}</h2>
        <div className={`game-timer ${timeLeft <= 5 ? 'warning' : ''}`}>
          {timeLeft}s
        </div>
      </div>

      {/* Main Content Area */}
      <div className="game-content">
        {isAdmin && (
          <div className="game-admin-info">
            👑 Admin View - Players answering: {answerCount.answered}/{answerCount.total}
          </div>
        )}

        <div className="game-question-box">
          {question.type === 'image' && (
            <div className="game-image-wrapper" onClick={() => setLightboxImage({ src: question.content.startsWith('/media') ? `${SERVER_URL}${question.content}` : `/${question.content}`, alt: 'Game Question' })}>
              <img src={question.content.startsWith('/media') ? `${SERVER_URL}${question.content}` : `/${question.content}`} alt="Game" className="game-question-image" />
              <div className="game-image-zoom-icon">🔍</div>
            </div>
          )}
          
          {question.type === 'audio' && !isCountdown && (
            <div className="game-question-audio">
              <p>🎵 Listen to the audio:</p>
              <audio controls autoPlay src={question.content.startsWith('/media') ? `${SERVER_URL}${question.content}` : `/${question.content}`} className="game-audio-player">
                Your browser does not support the audio element.
              </audio>
            </div>
          )}
          
          {question.type === 'review' && (
            <div className="game-image-wrapper" onClick={() => setLightboxImage({ src: `/steamreviews/${question.content}`, alt: 'Steam Review' })}>
              <img src={`/steamreviews/${question.content}`} alt="Steam Review" className="game-question-image" />
              <div className="game-image-zoom-icon">🔍</div>
            </div>
          )}
          
          {question.type === 'text' && (
            <p className="game-question-text">{question.content}</p>
          )}
        </div>
        
        {!isAdmin && (
          <>
            {hasAnswered ? (
              <div className="game-submitted-info">
                ✓ Answer submitted! Waiting for other players...
              </div>
            ) : (
              <>
                {question.questionType === 'qcm' && question.options ? (
                  <div className="game-options-grid">
                    {question.options.map((option, index) => (
                      <button
                        key={index}
                        className={`game-option-btn ${selectedAnswer === option ? 'selected' : ''}`}
                        onClick={() => handleOptionClick(option)}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="game-answer-form">
                    <input
                      type="text"
                      placeholder="Type your answer..."
                      value={textAnswer}
                      onChange={(e) => setTextAnswer(e.target.value)}
                      autoFocus
                      maxLength={100}
                      className="game-text-input"
                    />
                    <div className="game-submit-wrapper">
                      <button 
                        type="submit" 
                        className={`game-submit-btn ${wrongAnswerFeedback ? 'wrong-shake' : ''}`}
                      >
                        Submit Answer
                      </button>
                      {wrongAnswerFeedback && (
                        <span className="wrong-answer-x">✖</span>
                      )}
                    </div>
                  </form>
                )}
              </>
            )}
          </>
        )}
      </div>

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div 
          className="lightbox-overlay" 
          onClick={() => setLightboxImage(null)}
        >
          <img 
            src={lightboxImage.src} 
            alt={lightboxImage.alt}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}

export default Game;
