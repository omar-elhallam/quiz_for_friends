import React from 'react';
import '../styles/Results.css';

function Results({ roundResults, leaderboard, winner, isGameFinished, isAdmin, onNextRound, question }) {
  return (
    <div className="results-container">
      {isGameFinished ? (
        <>
          <h1 className="results-title">🏆 Game Finished!</h1>
          <div className="results-winner-box">
            <h2>Winner: {winner?.name} 🎉</h2>
            <p className="results-winner-score">Score: {winner?.score} points</p>
          </div>
        </>
      ) : (
        <div className="results-header">
          <h1 className="results-title">📊 Round Results</h1>
          {roundResults && (
            <h2 className="results-correct-answer">Correct Answer: {roundResults.correctAnswer}</h2>
          )}
        </div>
      )}
      
      <div className="results-main-content">
        {roundResults && (
          <div className="results-left-section">
            <h3>Player Answers</h3>
            <div className="results-answers">
              {roundResults.results.map((result, index) => (
                <div 
                  key={index} 
                  className={`results-answer-card ${result.isCorrect ? 'correct' : 'incorrect'} ${result.connected === false ? 'disconnected' : ''}`}
                >
                  <div>
                    <strong>
                      {result.playerName} {result.connected === false && '(Disconnected)'}
                    </strong>
                    <br />
                    <span className="results-answer-text">
                      {result.answer || 'No answer'} 
                      {result.timeElapsed !== null && ` (${result.timeElapsed}s)`}
                    </span>
                  </div>
                  <div className="results-points">
                    {result.isCorrect ? '✓' : '✗'} +{result.points}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {question && !isGameFinished && (
          <div className="results-center-section">
            <h3>Question</h3>
            <div className="results-question-display">
              {question.type === 'image' && (
                <img src={`/images/${question.content}`} alt="Question" className="results-question-image" />
              )}
              {question.type === 'audio' && (
                <div className="results-audio-display">
                  <p>🎵 Audio Question</p>
                  <audio controls src={`/audio/${question.content}`} className="results-audio-player">
                    Your browser does not support the audio element.
                  </audio>
                </div>
              )}
              {(question.type === 'text' || question.type === 'review') && (
                <p className="results-question-text">{question.content}</p>
              )}
            </div>
          </div>
        )}
        
        <div className="results-right-section">
          <h2>Leaderboard</h2>
          <div className="results-leaderboard-list">
            {leaderboard.map((player, index) => (
              <div 
                key={index} 
                className={`results-leaderboard-item ${
                  index === 0 ? 'first' : index === 1 ? 'second' : index === 2 ? 'third' : ''
                } ${player.connected === false ? 'disconnected' : ''}`}
              >
                <span>
                  {index + 1}. {player.name} {player.connected === false && '(Disconnected)'}
                </span>
                <span className="results-leaderboard-score">{player.score} pts</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {!isGameFinished && (
        <div className="results-footer">
          {isAdmin ? (
            <button onClick={onNextRound} className="results-next-btn">
              Next Round →
            </button>
          ) : (
            <div className="results-waiting">
              Waiting for admin to start next round...
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Results;
