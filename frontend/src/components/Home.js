import React, { useState } from 'react';

function Home({ onCreateRoom, onJoinRoom, error }) {
  const [playerName, setPlayerName] = useState('');
  const [roomId, setRoomId] = useState('');
  const [showJoin, setShowJoin] = useState(false);

  const handleCreate = (e) => {
    e.preventDefault();
    if (playerName.trim()) {
      onCreateRoom(playerName.trim());
    }
  };

  const handleJoin = (e) => {
    e.preventDefault();
    if (playerName.trim() && roomId.trim()) {
      onJoinRoom(playerName.trim(), roomId.trim().toUpperCase());
    }
  };

  return (
    <div>
      <h1>🎮 Quiz Game</h1>
      
      {error && <div className="error">{error}</div>}
      
      <form onSubmit={showJoin ? handleJoin : handleCreate}>
        <input
          type="text"
          placeholder="Enter your name"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          maxLength={20}
          required
        />
        
        {showJoin && (
          <input
            type="text"
            placeholder="Enter room code"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value.toUpperCase())}
            maxLength={6}
            required
          />
        )}
        
        <button type="submit">
          {showJoin ? 'Join Room' : 'Create Room'}
        </button>
        
        <button 
          type="button" 
          onClick={() => setShowJoin(!showJoin)}
          style={{ background: '#6c757d' }}
        >
          {showJoin ? 'Create Room Instead' : 'Join Existing Room'}
        </button>
      </form>
    </div>
  );
}

export default Home;
