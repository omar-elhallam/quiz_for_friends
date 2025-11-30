import React, { useState } from 'react';
import '../styles/NicknameScreen.css';

function NicknameScreen({ username, onSubmit, error }) {
  const [displayName, setDisplayName] = useState(username || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (displayName.trim()) {
      onSubmit(displayName.trim());
    }
  };

  return (
    <div className="nickname-container">
      <div className="nickname-box">
        <h1>🎮 Choose Your Display Name</h1>
        <h2>Welcome to Quiz Game!</h2>
        
        {error && <div className="login-error">{error}</div>}
        
        <div className="nickname-info">
          Logged in as: <strong>{username}</strong>
        </div>
        
        <form onSubmit={handleSubmit} className="nickname-form">
          <label htmlFor="displayName">Display Name:</label>
          <input
            id="displayName"
            type="text"
            placeholder="Enter display name for game"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            autoFocus
            maxLength={20}
            required
          />
          
          <button type="submit">
            Join Game
          </button>
        </form>
        
        <div className="nickname-info" style={{ marginTop: '20px', fontSize: '0.9rem' }}>
          Your display name is what other players will see during the game.
          <br />
          You can use your username or create a fun nickname!
        </div>
      </div>
    </div>
  );
}

export default NicknameScreen;
