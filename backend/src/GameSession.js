const questionGenerator = require('./questionGenerator');

class GameSession {
  constructor(roomId, io, gameManager) {
    this.roomId = roomId;
    this.io = io;
    this.gameManager = gameManager;
    this.players = new Map(); // username -> player object
    this.adminSocketId = null;
    this.adminName = null;
    this.gameState = 'waiting'; // waiting, playing, round_results, finished
    this.currentRound = 0;
    this.questions = []; // Will be generated dynamically when game starts
    this.roundStartTime = null;
    this.roundTimer = null;
    this.answers = new Map(); // username -> {answer, timestamp, attempts: []}
    this.roundLives = new Map(); // username -> lives remaining (for current round)
    this.usedQuestions = []; // Track used question combinations across multiple games
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
    
    // Generate 6 questions dynamically: 3 images + 3 audio (testing mode)
    // Pass the exclude list to avoid repeating questions from previous games
    this.questions = questionGenerator.generateGameSet(3, 3, this.usedQuestions);
    
    // Check if we got enough questions
    if (this.questions.length === 0) {
      console.error('ERROR: No questions generated! Cannot start game.');
      this.gameState = 'waiting';
      this.io.to(this.roomId).emit('error', { message: 'Failed to generate questions. Please try again.' });
      return;
    }
    
    // Track these questions as used
    for (const question of this.questions) {
      const combination = `${question.gameName}:${question.type}:${question.difficulty}`;
      if (!this.usedQuestions.includes(combination)) {
        this.usedQuestions.push(combination);
      }
    }
    
    console.log(`Generated ${this.questions.length} questions for room ${this.roomId}`);
    console.log(`Total used combinations: ${this.usedQuestions.length}`);
    
    // Write questions to file for debugging
    this.writeQuestionsToFile();
    
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

  writeQuestionsToFile() {
    const fs = require('fs');
    const path = require('path');
    
    const gameLog = {
      roomId: this.roomId,
      timestamp: new Date().toISOString(),
      totalRounds: this.questions.length,
      rounds: this.questions.map((q, index) => ({
        round: index + 1,
        type: q.type,
        game: q.gameName,
        difficulty: q.difficulty,
        content: q.content,
        answer: q.correctAnswer
      }))
    };
    
    const filePath = path.join(__dirname, '..', 'game-questions.json');
    
    try {
      fs.writeFileSync(filePath, JSON.stringify(gameLog, null, 2));
      console.log(`Game questions written to ${filePath}`);
    } catch (error) {
      console.error('Error writing game questions file:', error);
    }
  }

  startRound() {
    if (this.currentRound >= this.questions.length) {
      return this.endGame();
    }

    this.answers.clear();
    this.roundLives.clear();
    // Initialize 3 lives for each player
    for (const username of this.players.keys()) {
      this.roundLives.set(username, 3);
    }

    const question = this.getCurrentQuestion();
    
    // Emit countdown event
    this.io.to(this.roomId).emit('countdown_start', {
      round: this.currentRound + 1,
      totalRounds: this.questions.length
    });

    // Start countdown: 3, 2, 1
    let countdown = 3;
    const countdownInterval = setInterval(() => {
      this.io.to(this.roomId).emit('countdown_tick', { count: countdown });
      countdown--;
      
      if (countdown < 0) {
        clearInterval(countdownInterval);
        
        // Now actually start the round
        this.roundStartTime = Date.now();
        this.gameState = 'playing';
        
        // Send question to all players (without the correct answer)
        const roundDuration = this.getRoundDuration();
        
        // Generate secure token for media access
        let secureContent = question.content;
        if (question.type === 'image' || question.type === 'audio') {
          // Generate opaque token that hides the actual file path
          const token = this.gameManager.generateMediaToken(question.content);
          secureContent = `/media/${token}`;
        }
        
        this.io.to(this.roomId).emit('new_round', {
          round: this.currentRound + 1,
          totalRounds: this.questions.length,
          question: {
            type: question.type,
            questionType: question.questionType,
            content: secureContent,
            options: question.options || null,
            difficulty: question.difficulty
          },
          duration: roundDuration
        });

        // Broadcast initial player states with reset lives
        this.broadcastPlayerStates();

        // Set timer for round end
        this.roundTimer = setTimeout(() => {
          this.endRound();
        }, roundDuration);
      }
    }, 1000);
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
    const question = this.getCurrentQuestion();

    // For QCM, only allow one submission
    if (question.questionType === 'qcm') {
      if (this.answers.has(username)) {
        return;
      }
      const timestamp = Date.now();
      this.answers.set(username, { answer, timestamp, attempts: [answer] });
      this.io.to(socketId).emit('answer_submitted', { success: true, finalAnswer: true });
    } else {
      // For open-ended, allow 3 attempts
      const lives = this.roundLives.get(username) || 3;
      
      // Check if player has already given a final answer
      const existingData = this.answers.get(username);
      if (lives <= 0 || (existingData && existingData.answer !== null)) {
        return; // No more attempts or already answered correctly/exhausted lives
      }

      const timestamp = Date.now();
      const isCorrect = this.checkAnswer(answer, question);
      
      if (isCorrect) {
        // Correct answer - save and mark as complete
        const attempts = existingData ? [...existingData.attempts, answer] : [answer];
        this.answers.set(username, { answer, timestamp, attempts });
        this.io.to(socketId).emit('answer_submitted', { 
          success: true, 
          correct: true, 
          finalAnswer: true,
          livesRemaining: lives
        });
      } else {
        // Wrong answer - decrement lives and store attempt
        const newLives = lives - 1;
        this.roundLives.set(username, newLives);
        
        // Store this wrong attempt
        const attempts = existingData ? [...existingData.attempts, answer] : [answer];
        
        if (newLives <= 0) {
          // Out of lives - record final wrong answer
          this.answers.set(username, { answer, timestamp, attempts });
          this.io.to(socketId).emit('answer_submitted', { 
            success: true, 
            correct: false, 
            finalAnswer: true,
            livesRemaining: 0
          });
        } else {
          // Still have lives - save attempts so far but don't mark as final (answer: null)
          this.answers.set(username, { answer: null, timestamp, attempts });
          this.io.to(socketId).emit('answer_submitted', { 
            success: true, 
            correct: false, 
            finalAnswer: false,
            livesRemaining: newLives
          });
        }
      }
    }

    // Broadcast updated lives to all players
    this.broadcastPlayerStates();

    // Count connected players
    const connectedCount = this.getPlayerCount();

    // Count players who have given final answers (answer !== null means they're done)
    let finalAnswerCount = 0;
    for (const [username, data] of this.answers.entries()) {
      if (data.answer !== null) {
        finalAnswerCount++;
      }
    }

    // Notify admin about answer count
    this.io.to(this.adminSocketId).emit('answer_count', {
      answered: finalAnswerCount,
      total: connectedCount
    });

    // Check if all connected players have given their final answer
    if (finalAnswerCount === connectedCount) {
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
      leaderboard: this.getLeaderboard(),
      question: question
    });

    // Admin will manually advance to next round
    // No automatic progression
  }

  calculateScores(question) {
    const results = [];
    const timeLimit = this.getRoundDuration();

    for (const [username, answerData] of this.answers.entries()) {
      const player = this.players.get(username);
      if (!player) continue;

      const timeElapsed = answerData.timestamp - this.roundStartTime;
      const isCorrect = this.checkAnswer(answerData.answer, question);
      
      let points = 0;
      if (isCorrect) {
        // Point ranges based on difficulty
        let minPoints, maxPoints;
        if (question.difficulty === 1) {
          // Easy: 300-1000 points
          minPoints = 300;
          maxPoints = 1000;
        } else if (question.difficulty === 3) {
          // Hard: 700-1500 points
          minPoints = 700;
          maxPoints = 1500;
        } else {
          // Medium (2) or default: 500-1200 points
          minPoints = 500;
          maxPoints = 1200;
        }
        
        // Award points based on time taken (faster = more points)
        const timeRatio = timeElapsed / timeLimit;
        const pointRange = maxPoints - minPoints;
        points = Math.floor(maxPoints - (timeRatio * pointRange));
        points = Math.max(minPoints, points); // Ensure minimum points
        
        // For open-ended questions, deduct 100 points per wrong attempt
        if (question.questionType !== 'qcm') {
          const wrongAttempts = (answerData.attempts || []).length - 1; // -1 because last attempt is correct
          const attemptPenalty = wrongAttempts * 100;
          points = Math.max(100, points - attemptPenalty); // Minimum 100 points
        }
        
        player.score += points;
      }

      const attemptsCount = question.questionType === 'qcm' ? 1 : (3 - (this.roundLives.get(username) || 0) + (isCorrect ? 1 : 0));
      const attemptsList = answerData.attempts || [answerData.answer];
      
      results.push({
        playerName: player.name,
        answer: answerData.answer,
        isCorrect,
        points,
        timeElapsed: Math.round(timeElapsed / 1000),
        connected: player.connected,
        attempts: attemptsCount,
        attemptsList: attemptsList,
        questionType: question.questionType
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
          connected: player.connected,
          attempts: 0,
          questionType: question.questionType
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
      // For open-ended, require exact match with correct answer or alternatives
      if (givenAnswer === correctAnswer) return true;
      
      // Check alternatives (exact match only)
      if (question.alternatives) {
        for (const alt of question.alternatives) {
          const altLower = alt.toLowerCase().trim();
          if (givenAnswer === altLower) {
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

  getRoundDuration() {
    const question = this.getCurrentQuestion();
    
    // Fixed duration based on question type only
    if (question.type === 'audio') {
      return 60000; // 60 seconds for audio questions
    } else if (question.type === 'image') {
      return 30000; // 30 seconds for image questions
    } else {
      return 20000; // 20 seconds for text and review questions
    }
  }

  broadcastPlayerStates() {
    const question = this.getCurrentQuestion();
    const playerStates = Array.from(this.players.values()).map(player => {
      const answerData = this.answers.get(player.username);
      const hasAnswered = !!answerData;
      const isCorrect = hasAnswered && answerData.answer ? this.checkAnswer(answerData.answer, question) : false;
      
      return {
        username: player.username,
        name: player.name,
        score: player.score,
        connected: player.connected,
        lives: this.roundLives.get(player.username) || 3,
        hasAnswered: hasAnswered,
        answeredCorrectly: isCorrect
      };
    });
    
    this.io.to(this.roomId).emit('player_states', { players: playerStates });
  }

  endGame() {
    this.gameState = 'finished';
    
    const finalLeaderboard = this.getLeaderboard();
    
    this.io.to(this.roomId).emit('game_finished', {
      leaderboard: finalLeaderboard,
      winner: finalLeaderboard[0]
    });
  }

  // Reset game for a new round, keeping players and used questions tracking
  resetForNewGame() {
    this.gameState = 'waiting';
    this.currentRound = 0;
    this.questions = [];
    this.roundStartTime = null;
    this.answers.clear();
    this.roundLives.clear();
    
    // Clear any active timers
    if (this.roundTimer) {
      clearTimeout(this.roundTimer);
      this.roundTimer = null;
    }
    
    // Reset player scores but keep players in the room
    for (const player of this.players.values()) {
      player.score = 0;
    }
    
    console.log(`Game reset for room ${this.roomId}. Used questions: ${this.usedQuestions.length}`);
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
