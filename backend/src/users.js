// Simple user storage - no hashing, plain passwords
// Admin account and player accounts

const users = {
  // Admin account - can create rooms and control game flow
  admin: {
    username: '4T0M',
    password: 'admin123', // Change this to your secret password
    role: 'admin'
  },
  
  // Player accounts - can only join and play
  // Add your friends' accounts here
  players: {
    Player1: { username: 'Player1', password: 'abarro8', role: 'player' },
    Player2: { username: 'Player2', password: 'boomboom', role: 'player' },
    Player3: { username: 'Player3', password: 'caramel1', role: 'player' },
    Player4: { username: 'Player4', password: 'demandephotomeuf', role: 'player' },
    Player5: { username: 'Player5', password: 'pedophile', role: 'player' },
    Player6: { username: 'Player6', password: 'pa6', role: 'player' },
    Player7: { username: 'Player7', password: 'pong', role: 'player' },
    Player8: { username: 'Player8', password: 'pass8', role: 'player' }
  }
};

function authenticateUser(username, password) {
  // Check admin account
  if (username === users.admin.username && password === users.admin.password) {
    return {
      success: true,
      user: {
        username: users.admin.username,
        role: users.admin.role
      }
    };
  }
  
  // Check player accounts
  const player = users.players[username];
  if (player && player.password === password) {
    return {
      success: true,
      user: {
        username: player.username,
        role: player.role
      }
    };
  }
  
  return {
    success: false,
    error: 'Invalid username or password'
  };
}

module.exports = { authenticateUser };
