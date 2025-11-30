import React from 'react';
import '../styles/Lobby.css';

function Lobby({ roomId, players, isAdmin, onStartGame }) {
  return (
    <div className="lobby-container">
      <div className="lobby-box">
        <h1>🎮 Waiting Room</h1>
        
        <div className="lobby-room-code">
          <strong>{roomId}</strong>
        </div>
        
        <div className="lobby-players">
          <h2>Players ({players.length}/8)</h2>
          {players.map((player, index) => (
            <div key={index} className={`lobby-player-card ${player.connected === false ? 'disconnected' : ''}`}>
              <span>
                {player.name} {player.connected === false && '(Disconnected)'}
              </span>
            </div>
          ))}
        </div>
        
        {players.length < 8 && (
          <div className="lobby-waiting">
            Waiting for more players to join...
          </div>
        )}
        
        {isAdmin ? (
          <button 
            className="lobby-button"
            onClick={onStartGame}
            disabled={players.length < 1}
          >
            {players.length < 1 ? 'Need at least 1 player' : 'Start Game'}
          </button>
        ) : (
          <div className="lobby-waiting">
            Waiting for admin to start the game...
          </div>
        )}
      </div>
    </div>
  );
}

export default Lobby;
