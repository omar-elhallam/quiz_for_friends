import React, { useState } from 'react';
import '../styles/Login.css';

function Login({ onLogin, error }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim() && password.trim()) {
      onLogin(username.trim(), password.trim());
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>🎮 4T0M Quiz</h1>
        <h2>Login</h2>
        
        {error && <div className="login-error">{error}</div>}
        
        <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
          required
        />
        
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
        />
        
        <button type="submit">
          Login
        </button>
      </form>
      
      <div className="login-info">
        <strong>Admin:</strong> Create and control the game
        <br />
        <strong>Players:</strong> Join and play
      </div>
      </div>
    </div>
  );
}

export default Login;
