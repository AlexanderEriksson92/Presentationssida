// Register.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogin } from './LoginCheck';  

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useLogin();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
      });
      if (response.ok) {
        const data = await response.json();
        alert(data.message);
        login(data.apikey);
        navigate('/');
      } else {
        const errorData = await response.json();
        alert(errorData.message);
      }
    } catch (error) {
      alert('Fel vid registrering.');
    }
  };
  return (
    <form onSubmit={handleRegister}>
      <label>Användarnamn:
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
      </label>
      <label>Lösenord:
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </label>
      <button type="submit">Registrera</button>
    </form>
  );
}

export default Register;
