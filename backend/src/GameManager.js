const GameSession = require('./GameSession');

class GameManager {
  constructor(io) {
    this.io = io;
    this.rooms = new Map(); // roomId -> GameSession
    this.mainRoom = null; // Single main room
    this.mainRoomId = 'MAIN';
    this.mediaTokens = new Map(); // token -> { path, expires }
  }

  createRoom(socket, data, callback) {
    const { username, role } = data;
    
    // Only admin can create room
    if (role !== 'admin') {
      return callback({ success: false, error: 'Only admin can create rooms' });
    }

    // Check if room already exists
    if (this.mainRoom) {
      return callback({ success: false, error: 'Room already exists' });
    }
    
    // Create main game session
    const gameSession = new GameSession(this.mainRoomId, this.io, this);
    this.rooms.set(this.mainRoomId, gameSession);
    this.mainRoom = gameSession;

    // Add admin as observer (not a player)
    gameSession.setAdmin(socket.id, username);
    socket.join(this.mainRoomId);

    callback({ 
      success: true, 
      roomId: this.mainRoomId,
      gameState: gameSession.getState()
    });

    console.log(`Room ${this.mainRoomId} created by admin ${username}`);
  }

  joinRoom(socket, data, callback) {
    const { username, role, nickname } = data;

    if (!username || username.trim() === '') {
      return callback({ success: false, error: 'Username is required' });
    }

    // Players can only join, not create
    if (role !== 'player') {
      return callback({ success: false, error: 'Invalid role' });
    }

    const gameSession = this.mainRoom;

    if (!gameSession) {
      return callback({ success: false, error: 'No active room. Admin needs to create a room first.' });
    }

    // Check if this is a reconnection
    const isReconnection = gameSession.hasPlayerByUsername(username);
    
    if (!isReconnection) {
      // New player - check room capacity and game state
      if (gameSession.isFull()) {
        return callback({ success: false, error: 'Room is full (max 8 players)' });
      }

      if (gameSession.hasStarted()) {
        return callback({ success: false, error: 'Game has already started' });
      }
    }

    const result = gameSession.addPlayer(socket.id, username, nickname);
    socket.join(this.mainRoomId);

    if (result.isReconnection) {
      // Player reconnected
      this.io.to(this.mainRoomId).emit('player_reconnected', {
        player: result.player,
        players: gameSession.getPlayers(),
        playerCount: gameSession.getPlayerCount()
      });
      
      console.log(`${username} reconnected to room ${this.mainRoomId}`);
    } else {
      // New player joined
      this.io.to(this.mainRoomId).emit('player_joined', {
        player: result.player,
        players: gameSession.getPlayers(),
        playerCount: gameSession.getPlayerCount()
      });
      
      console.log(`${username} joined room ${this.mainRoomId}`);
    }

    callback({ 
      success: true, 
      roomId: this.mainRoomId,
      player: result.player,
      isReconnection: result.isReconnection,
      gameState: gameSession.getState()
    });
  }

  startGame(socket, data) {
    const gameSession = this.mainRoom;

    if (!gameSession) {
      return socket.emit('error', { message: 'Room not found' });
    }

    // Check if user is admin
    if (gameSession.adminSocketId !== socket.id) {
      return socket.emit('error', { message: 'Only admin can start the game' });
    }

    if (gameSession.getPlayerCount() < 1) {
      return socket.emit('error', { message: 'Need at least 1 player to start' });
    }

    gameSession.startGame();
    console.log(`Game started in room ${this.mainRoomId}`);
  }

  submitAnswer(socket, data) {
    const { answer } = data;
    const gameSession = this.mainRoom;

    if (!gameSession) {
      return socket.emit('error', { message: 'Room not found' });
    }

    gameSession.submitAnswer(socket.id, answer);
  }

  nextRound(socket, data) {
    const gameSession = this.mainRoom;

    if (!gameSession) {
      return socket.emit('error', { message: 'Room not found' });
    }

    // Check if user is admin
    if (gameSession.adminSocketId !== socket.id) {
      return socket.emit('error', { message: 'Only admin can advance rounds' });
    }

    gameSession.adminNextRound();
  }

  playAgain(socket, data) {
    const gameSession = this.mainRoom;

    if (!gameSession) {
      return socket.emit('error', { message: 'Room not found' });
    }

    // Check if user is admin
    if (gameSession.adminSocketId !== socket.id) {
      return socket.emit('error', { message: 'Only admin can start a new game' });
    }

    // Check if game is actually finished
    if (gameSession.gameState !== 'finished') {
      return socket.emit('error', { message: 'Current game is not finished yet' });
    }

    console.log(`Admin starting new game in room ${this.mainRoomId}`);
    
    // Reset the game session for a new game
    gameSession.resetForNewGame();
    
    // Notify all players to return to lobby
    this.io.to(this.mainRoomId).emit('new_game_starting', {
      players: gameSession.getPlayers(),
      playerCount: gameSession.getPlayerCount()
    });
    
    // Start the new game after a short delay
    setTimeout(() => {
      gameSession.startGame();
    }, 2000);
  }

  handleDisconnect(socket) {
    const gameSession = this.mainRoom;
    
    if (!gameSession) return;

    // Check if admin disconnected
    if (gameSession.adminSocketId === socket.id) {
      // End game if admin leaves
      this.io.to(this.mainRoomId).emit('admin_left', {
        message: 'Admin left, game ended'
      });
      this.rooms.delete(this.mainRoomId);
      this.mainRoom = null;
      console.log('Admin disconnected, room closed');
      return;
    }

    // Handle player disconnect
    if (gameSession.hasPlayer(socket.id)) {
      const playerName = gameSession.removePlayer(socket.id);
      
      this.io.to(this.mainRoomId).emit('player_left', {
        socketId: socket.id,
        playerName,
        players: gameSession.getPlayers(),
        playerCount: gameSession.getPlayerCount()
      });
      
      console.log(`${playerName} disconnected`);
    }
  }

  generateRoomId() {
    // Generate 6-character room code
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let roomId;
    do {
      roomId = '';
      for (let i = 0; i < 6; i++) {
        roomId += chars.charAt(Math.floor(Math.random() * chars.length));
      }
    } while (this.rooms.has(roomId));
    
    return roomId;
  }

  getRoomCount() {
    return this.rooms.size;
  }

  // Generate a secure token for media access
  generateMediaToken(mediaPath) {
    const crypto = require('crypto');
    const token = crypto.randomBytes(32).toString('hex');
    const expires = Date.now() + 5 * 60 * 1000; // Token valid for 5 minutes
    
    this.mediaTokens.set(token, { path: mediaPath, expires });
    
    // Clean up expired tokens periodically
    setTimeout(() => {
      this.mediaTokens.delete(token);
    }, 5 * 60 * 1000);
    
    return token;
  }

  // Get media path from token (validates and returns path)
  getMediaPath(token) {
    const tokenData = this.mediaTokens.get(token);
    
    if (!tokenData) {
      return null;
    }
    
    // Check if token expired
    if (Date.now() > tokenData.expires) {
      this.mediaTokens.delete(token);
      return null;
    }
    
    return tokenData.path;
  }
}

module.exports = GameManager;
