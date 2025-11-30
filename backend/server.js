const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const GameManager = require('./src/GameManager');
const { authenticateUser } = require('./src/users');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

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

  socket.on('disconnect', () => {
    gameManager.handleDisconnect(socket);
    console.log(`Client disconnected: ${socket.id}`);
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', rooms: gameManager.getRoomCount() });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
