# Quiz Game Backend

Real-time multiplayer quiz game server built with Node.js, Express, and Socket.io.

## Installation

```bash
npm install
```

## Running the Server

```bash
# Production
npm start

# Development (with auto-restart)
npm run dev
```

Server runs on `http://localhost:3001`

## API Endpoints

### HTTP
- `GET /health` - Health check endpoint

### WebSocket Events (Socket.io)

#### Client → Server
- `create_room` - Create a new game room
  ```js
  { playerName: string }
  ```
- `join_room` - Join an existing room
  ```js
  { roomId: string, playerName: string }
  ```
- `start_game` - Start the game (room creator only)
  ```js
  { roomId: string }
  ```
- `submit_answer` - Submit an answer for the current question
  ```js
  { roomId: string, answer: string }
  ```

#### Server → Client
- `player_joined` - New player joined the room
- `player_left` - Player left the room
- `game_started` - Game has started
- `new_round` - New question/round started
- `answer_submitted` - Answer was received
- `round_ended` - Round finished, showing results
- `game_finished` - All rounds completed
- `error` - Error message

## Project Structure

```
backend/
├── server.js              # Main entry point
├── src/
│   ├── GameManager.js     # Manages all game rooms
│   ├── GameSession.js     # Individual game session logic
│   └── questions.js       # Question database
├── assets/               # Static assets (images, audio)
└── package.json
```

## Game Flow

1. **Waiting Room** - Players join, waiting for host to start
2. **Round Start** - Question displayed to all players
3. **Answer Phase** - Players submit answers (20 seconds)
4. **Results** - Show correct answer, all player answers, and scores
5. **Next Round** - Repeat until all questions answered
6. **Game End** - Final leaderboard displayed

## Scoring System

- Base points: 1000
- Time penalty: Faster answers get more points (500-1000 range)
- Wrong answers: 0 points
- No answer: 0 points

## Features

✅ Real-time multiplayer (max 6 players per room)
✅ Multiple question types (image, audio, text, review)
✅ QCM and open-ended questions
✅ Speed-based scoring
✅ Live leaderboard
✅ Room management with unique codes
✅ Disconnect handling
