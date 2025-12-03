const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const GameManager = require('./src/GameManager');
const { authenticateUser } = require('./src/users');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: (origin, callback) => {
      // Allow localhost and any netlify.app subdomain
      if (!origin || origin.includes('localhost') || origin.endsWith('.netlify.app')) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ["GET", "POST"],
    credentials: true
  }
});

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || origin.includes('localhost') || origin.endsWith('.netlify.app')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());

// Serve static games folder (for deployed environments)
app.use('/games', express.static(path.join(__dirname, 'public/games')));

const gameManager = new GameManager(io);

// Login endpoint
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const result = authenticateUser(username, password);
  res.json(result);
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log(`New client connected: ${socket.id}`);

  socket.on('create_room', (data, callback) => {
    gameManager.createRoom(socket, data, callback);
  });

  socket.on('join_room', (data, callback) => {
    gameManager.joinRoom(socket, data, callback);
  });

  socket.on('start_game', (data) => {
    gameManager.startGame(socket, data);
  });

  socket.on('submit_answer', (data) => {
    gameManager.submitAnswer(socket, data);
  });

  socket.on('next_round', (data) => {
    gameManager.nextRound(socket, data);
  });

  socket.on('play_again', (data) => {
    gameManager.playAgain(socket, data);
  });

  socket.on('disconnect', () => {
    gameManager.handleDisconnect(socket);
    console.log(`Client disconnected: ${socket.id}`);
  });
});

// Secure media endpoint - serves game media with opaque token
app.get('/media/:token', (req, res) => {
  const { token } = req.params;
  
  // Get file path from token
  const filePath = gameManager.getMediaPath(token);
  
  if (!filePath) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
  
  // Try backend public folder first (for deployed), then frontend public (for local dev)
  const backendPath = path.join(__dirname, 'public', filePath);
  const frontendPath = path.join(__dirname, '..', 'frontend', 'public', filePath);
  
  let actualPath;
  if (fs.existsSync(backendPath)) {
    actualPath = backendPath;
  } else if (fs.existsSync(frontendPath)) {
    actualPath = frontendPath;
  } else {
    console.error(`Media file not found: ${filePath}`);
    console.error(`Checked: ${backendPath}`);
    console.error(`Checked: ${frontendPath}`);
    return res.status(404).json({ error: 'Media not found' });
  }
  
  // Set appropriate headers to prevent caching and downloading
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // Serve the file
  res.sendFile(actualPath);
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', rooms: gameManager.getRoomCount() });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
