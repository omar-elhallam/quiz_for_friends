import React, { useState, useEffect } from 'react';
import '../styles/Game.css';

function Game({ question, roundInfo, timeLeft, hasAnswered, onSubmitAnswer, isAdmin, answerCount, players }) {
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
      {/* Player Sidebar */}
      <div className="game-players-sidebar">
        <h3>Players</h3>
        {players && players.map((player, index) => (
          <div key={index} className={`game-player-box ${player.connected === false ? 'disconnected' : ''}`}>
            <div className="game-player-username">{player.username || `Player${index + 1}`}</div>
            <div className="game-player-nickname">{player.name}</div>
            <div className="game-player-score">{player.score || 0} pts</div>
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
            <div className="game-image-wrapper" onClick={() => setLightboxImage({ src: `/images/${question.content}`, alt: 'Game Question' })}>
              <img src={`/images/${question.content}`} alt="Game" className="game-question-image" />
              <div className="game-image-zoom-icon">🔍</div>
            </div>
          )}
          
          {question.type === 'audio' && (
            <div className="game-question-audio">
              <p>🎵 Listen to the audio:</p>
              <audio controls autoPlay src={`/audio/${question.content}`} className="game-audio-player">
                Your browser does not support the audio element.
              </audio>
            </div>
          )}
          
          {(question.type === 'text' || question.type === 'review') && (
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
                    <button type="submit" className="game-submit-btn">
                      Submit Answer
                    </button>
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
