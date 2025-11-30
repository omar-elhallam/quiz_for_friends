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
    Reda: { username: 'Reda', password: 'pass1', role: 'player' },
    Abdel: { username: 'Abdel', password: 'pass2', role: 'player' },
    Hamza: { username: 'Hamza', password: 'pass3', role: 'player' },
    Bichr: { username: 'Bichr', password: 'pass4', role: 'player' },
    Imrane: { username: 'Imrane', password: 'pass5', role: 'player' },
    Rayan: { username: 'Rayan', password: 'pass6', role: 'player' },
    player7: { username: 'player7', password: 'pass7', role: 'player' },
    player8: { username: 'player8', password: 'pass8', role: 'player' }
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
