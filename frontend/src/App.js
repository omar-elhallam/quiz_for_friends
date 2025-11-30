import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import Login from './components/Login';
import NicknameScreen from './components/NicknameScreen';
import Lobby from './components/Lobby';
import Game from './components/Game';
import Results from './components/Results';

const SERVER_URL = 'http://localhost:3001';

function App() {
  const [socket, setSocket] = useState(null);
  const [gameState, setGameState] = useState('login'); // login, nickname, lobby, playing, round_results, finished
  const [user, setUser] = useState(null); // { username, role }
  const [nickname, setNickname] = useState('');
  const [roomId, setRoomId] = useState('');
  const [players, setPlayers] = useState([]);
  const [error, setError] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [roundInfo, setRoundInfo] = useState({ round: 0, total: 0 });
  const [timeLeft, setTimeLeft] = useState(0);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [roundResults, setRoundResults] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [winner, setWinner] = useState(null);
  const [answerCount, setAnswerCount] = useState({ answered: 0, total: 0 });

  useEffect(() => {
    const newSocket = io(SERVER_URL);
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Connected to server');
    });

    newSocket.on('player_joined', (data) => {
      setPlayers(data.players);
    });

    newSocket.on('player_reconnected', (data) => {
      setPlayers(data.players);
    });

    newSocket.on('player_left', (data) => {
      setPlayers(data.players);
    });

    newSocket.on('game_started', (data) => {
      setGameState('playing');
    });

    newSocket.on('new_round', (data) => {
      setGameState('playing');
      setCurrentQuestion(data.question);
      setRoundInfo({ round: data.round, total: data.totalRounds });
      setTimeLeft(Math.floor(data.duration / 1000));
      setHasAnswered(false);
      setRoundResults(null);
    });

    newSocket.on('answer_submitted', () => {
      setHasAnswered(true);
    });

    newSocket.on('round_ended', (data) => {
      setGameState('round_results');
      setRoundResults(data);
      setLeaderboard(data.leaderboard);
    });

    newSocket.on('game_finished', (data) => {
      setGameState('finished');
      setLeaderboard(data.leaderboard);
      setWinner(data.winner);
    });

    newSocket.on('answer_count', (data) => {
      setAnswerCount(data);
    });

    newSocket.on('admin_left', (data) => {
      alert(data.message);
      window.location.reload();
    });

    newSocket.on('error', (data) => {
      setError(data.message);
    });

    return () => newSocket.close();
  }, []);

  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, gameState]);

  const handleLogin = async (username, password) => {
    try {
      const response = await fetch(`${SERVER_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setUser(data.user);
        setError('');
        
        if (data.user.role === 'admin') {
          // Admin creates room immediately
          socket.emit('create_room', { username: data.user.username, role: 'admin' }, (response) => {
            if (response.success) {
              setRoomId(response.roomId);
              setPlayers(response.gameState.players);
              setGameState('lobby');
            } else {
              setError(response.error);
            }
          });
        } else {
          // Players go to nickname screen first
          setGameState('nickname');
        }
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Connection error');
    }
  };

  const handleNicknameSubmit = (displayName) => {
    setNickname(displayName);
    
    // Join room with nickname
    socket.emit('join_room', { 
      username: user.username, 
      role: 'player',
      nickname: displayName 
    }, (response) => {
      if (response.success) {
        setRoomId(response.roomId);
        setPlayers(response.gameState.players);
        
        // Check if reconnecting to ongoing game
        if (response.isReconnection && response.gameState.gameState !== 'waiting') {
          setGameState(response.gameState.gameState);
        } else {
          setGameState('lobby');
        }
      } else {
        setError(response.error);
      }
    });
  };

  const startGame = () => {
    socket.emit('start_game', {});
  };

  const nextRound = () => {
    socket.emit('next_round', {});
  };

  const submitAnswer = (answer) => {
    if (!hasAnswered) {
      socket.emit('submit_answer', { answer });
    }
  };

  return (
    <div className="container">
      {gameState === 'login' && (
        <Login onLogin={handleLogin} error={error} />
      )}
      
      {gameState === 'nickname' && (
        <NicknameScreen 
          username={user?.username}
          onSubmit={handleNicknameSubmit} 
          error={error} 
        />
      )}
      
      {gameState === 'lobby' && (
        <Lobby 
          roomId={roomId}
          players={players}
          isAdmin={user?.role === 'admin'}
          onStartGame={startGame}
        />
      )}
      
      {gameState === 'playing' && (
        <Game 
          question={currentQuestion}
          roundInfo={roundInfo}
          timeLeft={timeLeft}
          hasAnswered={hasAnswered}
          onSubmitAnswer={submitAnswer}
          isAdmin={user?.role === 'admin'}
          answerCount={answerCount}
          players={players}
        />
      )}
      
      {gameState === 'round_results' && (
        <Results 
          roundResults={roundResults}
          leaderboard={leaderboard}
          isGameFinished={false}
          isAdmin={user?.role === 'admin'}
          onNextRound={nextRound}
          question={currentQuestion}
        />
      )}
      
      {gameState === 'finished' && (
        <Results 
          roundResults={roundResults}
          leaderboard={leaderboard}
          winner={winner}
          isGameFinished={true}
          isAdmin={user?.role === 'admin'}
        />
      )}
    </div>
  );
}

export default App;
