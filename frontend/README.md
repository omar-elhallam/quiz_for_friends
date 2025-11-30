# Quiz Game Frontend

Minimalist React frontend for the multiplayer quiz game.

## Installation

```bash
npm install
```

## Running the App

```bash
npm start
```

Runs on `http://localhost:3000`

Make sure the backend is running on `http://localhost:3001`

## Features

✅ Create/Join rooms with room codes
✅ Real-time player list in lobby
✅ Display all question types (image, audio, text, review)
✅ QCM (multiple choice) and open-ended answers
✅ Live countdown timer
✅ Round results with correct answer and all player answers
✅ Live leaderboard updates
✅ Final winner display

## Structure

```
src/
├── App.js                 # Main app logic & Socket.io integration
├── index.js              # Entry point
├── index.css             # Global styles
└── components/
    ├── Home.js           # Create/join room screen
    ├── Lobby.js          # Waiting room
    ├── Game.js           # Question display & answer submission
    └── Results.js        # Round results & leaderboard
```

## Assets

Place your game images and audio files in:
- `public/images/` - For image questions (e.g., game1.jpg, game2.jpg)
- `public/audio/` - For audio questions (e.g., game1.mp3, game2.mp3)
