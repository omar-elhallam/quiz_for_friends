const io = require('socket.io-client');

// Test configuration
const SERVER_URL = 'http://localhost:3001';
let roomId = null;

// Create multiple test clients
const clients = [];
const playerNames = ['Alice', 'Bob', 'Charlie', 'Diana'];

function createClient(playerName, isCreator = false) {
  const socket = io(SERVER_URL);
  const client = { socket, name: playerName };
  clients.push(client);

  socket.on('connect', () => {
    console.log(`✅ ${playerName} connected (${socket.id})`);
    
    if (isCreator) {
      // First player creates room
      socket.emit('create_room', { playerName }, (response) => {
        if (response.success) {
          roomId = response.roomId;
          console.log(`🎮 ${playerName} created room: ${roomId}`);
          console.log(`   Players in room:`, response.gameState.players.map(p => p.name));
        } else {
          console.error(`❌ ${playerName} failed to create room:`, response.error);
        }
      });
    } else {
      // Wait a bit for room to be created
      setTimeout(() => {
        if (roomId) {
          socket.emit('join_room', { roomId, playerName }, (response) => {
            if (response.success) {
              console.log(`✅ ${playerName} joined room: ${roomId}`);
            } else {
              console.error(`❌ ${playerName} failed to join:`, response.error);
            }
          });
        }
      }, 500);
    }
  });

  socket.on('player_joined', (data) => {
    console.log(`👥 ${data.player.name} joined! Total players: ${data.playerCount}`);
  });

  socket.on('game_started', (data) => {
    console.log(`\n🎬 GAME STARTED! Total rounds: ${data.totalRounds}\n`);
  });

  socket.on('new_round', (data) => {
    console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`📝 ROUND ${data.round}/${data.totalRounds}`);
    console.log(`   Type: ${data.question.type}`);
    console.log(`   Question Type: ${data.question.questionType}`);
    console.log(`   Content: ${data.question.content}`);
    if (data.question.options) {
      console.log(`   Options:`, data.question.options);
    }
    console.log(`   Duration: ${data.duration}ms`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);

    // Simulate answer submission after random delay
    const delay = Math.random() * 5000 + 1000; // 1-6 seconds
    setTimeout(() => {
      let answer;
      if (data.question.questionType === 'qcm' && data.question.options) {
        // Pick random option for QCM
        const randomIndex = Math.floor(Math.random() * data.question.options.length);
        answer = data.question.options[randomIndex];
      } else {
        // For open-ended, simulate some correct and some wrong answers
        const randomAnswers = ['Minecraft', 'Dark Souls', 'Mario', 'Zelda', 'Random Game'];
        answer = randomAnswers[Math.floor(Math.random() * randomAnswers.length)];
      }
      
      console.log(`💬 ${playerName} submits: "${answer}"`);
      socket.emit('submit_answer', { roomId, answer });
    }, delay);
  });

  socket.on('answer_submitted', (data) => {
    console.log(`✓ ${playerName}'s answer received by server`);
  });

  socket.on('round_ended', (data) => {
    console.log(`\n🎯 ROUND RESULTS:`);
    console.log(`   Correct Answer: ${data.correctAnswer}`);
    console.log(`\n   Player Results:`);
    data.results.forEach(result => {
      const emoji = result.isCorrect ? '✅' : '❌';
      const time = result.timeElapsed !== null ? `${result.timeElapsed}s` : 'no answer';
      console.log(`   ${emoji} ${result.playerName}: "${result.answer}" [+${result.points} pts] (${time})`);
    });
    console.log(`\n   📊 LEADERBOARD:`);
    data.leaderboard.forEach(player => {
      console.log(`   ${player.rank}. ${player.name} - ${player.score} points`);
    });
    console.log('');
  });

  socket.on('game_finished', (data) => {
    console.log(`\n🏆 GAME FINISHED!`);
    console.log(`\n   Final Leaderboard:`);
    data.leaderboard.forEach(player => {
      const trophy = player.rank === 1 ? '🥇' : player.rank === 2 ? '🥈' : player.rank === 3 ? '🥉' : '  ';
      console.log(`   ${trophy} ${player.rank}. ${player.name} - ${player.score} points`);
    });
    console.log(`\n   🎉 Winner: ${data.winner.name} with ${data.winner.score} points!\n`);
    
    // Disconnect all clients after game
    setTimeout(() => {
      console.log('\n👋 Disconnecting all clients...');
      clients.forEach(c => c.socket.disconnect());
      process.exit(0);
    }, 2000);
  });

  socket.on('error', (data) => {
    console.error(`❌ ${playerName} received error:`, data.message);
  });

  socket.on('disconnect', () => {
    console.log(`👋 ${playerName} disconnected`);
  });

  return client;
}

// Main test sequence
console.log('🧪 Starting Backend Test\n');
console.log('Creating test clients...\n');

// Create clients with delay
playerNames.forEach((name, index) => {
  setTimeout(() => {
    createClient(name, index === 0);
  }, index * 600);
});

// Start game after all players join
setTimeout(() => {
  if (clients.length > 0 && roomId) {
    console.log(`\n🚀 Starting game in room ${roomId}...\n`);
    clients[0].socket.emit('start_game', { roomId });
  } else {
    console.log(`⚠️ Can't start: clients=${clients.length}, roomId=${roomId}`);
  }
}, 4000);
