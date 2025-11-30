const questions = require('./questions');

class GameSession {
  constructor(roomId, io) {
    this.roomId = roomId;
    this.io = io;
    this.players = new Map(); // username -> player object
    this.adminSocketId = null;
    this.adminName = null;
    this.gameState = 'waiting'; // waiting, playing, round_results, finished
    this.currentRound = 0;
    this.questions = questions; // Use questions in original order
    this.roundStartTime = null;
    this.roundTimer = null;
    this.roundDuration = 20000; // 20 seconds per round
    this.answers = new Map(); // username -> {answer, timestamp}
  }

  setAdmin(socketId, username) {
    this.adminSocketId = socketId;
    this.adminName = username;
  }

  addPlayer(socketId, username, nickname) {
    // Check if player already exists (reconnection)
    if (this.players.has(username)) {
      const player = this.players.get(username);
      player.socketId = socketId;
      player.connected = true;
      // Update nickname if provided
      if (nickname) {
        player.name = nickname;
      }
      return { player, isReconnection: true };
    }
    
    // New player
    const player = {
      socketId,
      username: username,
      name: nickname || username, // Display name (nickname or username)
      score: 0,
      connected: true
    };
    this.players.set(username, player);
    return { player, isReconnection: false };
  }

  removePlayer(socketId) {
    // Find player by socketId
    for (const [username, player] of this.players.entries()) {
      if (player.socketId === socketId) {
        player.connected = false;
        return player.name;
      }
    }
    return null;
  }

  hasPlayer(socketId) {
    for (const player of this.players.values()) {
      if (player.socketId === socketId) {
        return true;
      }
    }
    return false;
  }

  hasPlayerByUsername(username) {
    return this.players.has(username);
  }

  getPlayerBySocketId(socketId) {
    for (const player of this.players.values()) {
      if (player.socketId === socketId) {
        return player;
      }
    }
    return null;
  }

  getPlayerByUsername(username) {
    return this.players.get(username);
  }

  getPlayers() {
    return Array.from(this.players.values());
  }

  getPlayerCount() {
    let count = 0;
    for (const player of this.players.values()) {
      if (player.connected) count++;
    }
    return count;
  }

  isFull() {
    return this.players.size >= 8;
  }

  isEmpty() {
    return this.players.size === 0;
  }

  hasStarted() {
    return this.gameState !== 'waiting';
  }

  getState() {
    return {
      roomId: this.roomId,
      gameState: this.gameState,
      players: this.getPlayers(),
      adminName: this.adminName,
      currentRound: this.currentRound,
      totalRounds: this.questions.length
    };
  }

  startGame() {
    this.gameState = 'playing';
    this.currentRound = 0;
    
    // Reset all player scores
    for (const player of this.players.values()) {
      player.score = 0;
    }

    this.io.to(this.roomId).emit('game_started', {
      totalRounds: this.questions.length
    });

    // Start first round after a short delay
    setTimeout(() => this.startRound(), 2000);
  }

  startRound() {
    if (this.currentRound >= this.questions.length) {
      return this.endGame();
    }

    this.answers.clear();
    this.roundStartTime = Date.now();
    this.gameState = 'playing';

    const question = this.getCurrentQuestion();
    
    // Send question to all players (without the correct answer)
    this.io.to(this.roomId).emit('new_round', {
      round: this.currentRound + 1,
      totalRounds: this.questions.length,
      question: {
        type: question.type,
        questionType: question.questionType,
        content: question.content,
        options: question.options || null
      },
      duration: this.roundDuration
    });

    // Set timer for round end
    this.roundTimer = setTimeout(() => {
      this.endRound();
    }, this.roundDuration);
  }

  submitAnswer(socketId, answer) {
    if (this.gameState !== 'playing') {
      return;
    }

    // Admin shouldn't answer
    if (socketId === this.adminSocketId) {
      return;
    }

    // Find player by socketId
    const player = this.getPlayerBySocketId(socketId);
    if (!player || !player.connected) {
      return;
    }

    // Use username (not nickname) as key
    const username = player.username;

    // Check if player already answered
    if (this.answers.has(username)) {
      return;
    }

    const timestamp = Date.now();
    this.answers.set(username, { answer, timestamp });

    // Acknowledge answer received
    this.io.to(socketId).emit('answer_submitted', { success: true });

    // Count connected players
    const connectedCount = this.getPlayerCount();

    // Notify admin about answer count
    this.io.to(this.adminSocketId).emit('answer_count', {
      answered: this.answers.size,
      total: connectedCount
    });

    // Check if all connected players have answered
    if (this.answers.size === connectedCount) {
      clearTimeout(this.roundTimer);
      this.endRound();
    }
  }

  endRound() {
    this.gameState = 'round_results';
    
    const question = this.getCurrentQuestion();
    const results = this.calculateScores(question);

    // Send results to all players
    this.io.to(this.roomId).emit('round_ended', {
      correctAnswer: question.correctAnswer,
      results: results,
      leaderboard: this.getLeaderboard()
    });

    // Admin will manually advance to next round
    // No automatic progression
  }

  calculateScores(question) {
    const results = [];
    const timeLimit = this.roundDuration;

    for (const [username, answerData] of this.answers.entries()) {
      const player = this.players.get(username);
      if (!player) continue;

      const timeElapsed = answerData.timestamp - this.roundStartTime;
      const isCorrect = this.checkAnswer(answerData.answer, question);
      
      let points = 0;
      if (isCorrect) {
        // Award points: 1000 base points, minus points for time taken
        // Faster answers get more points
        const timePenalty = Math.floor((timeElapsed / timeLimit) * 500);
        points = Math.max(500, 1000 - timePenalty);
        player.score += points;
      }

      results.push({
        playerName: player.name,
        answer: answerData.answer,
        isCorrect,
        points,
        timeElapsed: Math.round(timeElapsed / 1000),
        connected: player.connected
      });
    }

    // Add players who didn't answer (only if connected)
    for (const [username, player] of this.players.entries()) {
      if (!this.answers.has(username)) {
        results.push({
          playerName: player.name,
          answer: null,
          isCorrect: false,
          points: 0,
          timeElapsed: null,
          connected: player.connected
        });
      }
    }

    return results;
  }

  checkAnswer(playerAnswer, question) {
    if (!playerAnswer) return false;

    const correctAnswer = question.correctAnswer.toLowerCase().trim();
    const givenAnswer = playerAnswer.toLowerCase().trim();

    if (question.questionType === 'qcm') {
      // Exact match for multiple choice
      return givenAnswer === correctAnswer;
    } else {
      // For open-ended, check if answer contains the correct answer or vice versa
      // Also check against alternative answers if provided
      if (givenAnswer === correctAnswer) return true;
      if (correctAnswer.includes(givenAnswer) || givenAnswer.includes(correctAnswer)) return true;
      
      // Check alternatives
      if (question.alternatives) {
        for (const alt of question.alternatives) {
          const altLower = alt.toLowerCase().trim();
          if (givenAnswer === altLower || 
              altLower.includes(givenAnswer) || 
              givenAnswer.includes(altLower)) {
            return true;
          }
        }
      }
      
      return false;
    }
  }

  getLeaderboard() {
    return Array.from(this.players.values())
      .sort((a, b) => b.score - a.score)
      .map((player, index) => ({
        rank: index + 1,
        name: player.name,
        score: player.score,
        connected: player.connected
      }));
  }

  adminNextRound() {
    if (this.gameState !== 'round_results') {
      return;
    }

    this.currentRound++;
    
    if (this.currentRound >= this.questions.length) {
      this.endGame();
    } else {
      this.startRound();
    }
  }

  getCurrentQuestion() {
    return this.questions[this.currentRound];
  }

  endGame() {
    this.gameState = 'finished';
    
    const finalLeaderboard = this.getLeaderboard();
    
    this.io.to(this.roomId).emit('game_finished', {
      leaderboard: finalLeaderboard,
      winner: finalLeaderboard[0]
    });
  }

  shuffleQuestions(questions) {
    const shuffled = [...questions];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
}

module.exports = GameSession;
