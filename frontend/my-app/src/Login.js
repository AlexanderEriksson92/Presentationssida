import React, { useState } from 'react';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        if (data.apikey) {
          localStorage.setItem('apikey', data.apikey);
          alert('Inloggning lyckad!');
        } else {
          alert('Fel användarnamn eller lösenord');
        }
      })
      .catch(error => {
        console.error('Login failed:', error);
      });
    }
    catch (error) {
      console.error('An error occurred:', error);
    }
  }

  return (
    <form onSubmit={handleLogin}>
      <label>
        Användarnamn:
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
      </label>
      <label>
        Lösenord:
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </label>
      <button type="submit">Logga in</button>
    </form>
  );
}

export default Login;
