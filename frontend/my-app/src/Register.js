// Register.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogin } from './LoginCheck';  
import { Link } from 'react-router-dom';
function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useLogin();
  const navigate = useNavigate();
  const [confirmPassword, setConfirmPassword] = useState('');
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      if (password !== confirmPassword) {
        alert('Lösenorden matchar inte.');
        return;
      }
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
        <div className="container d-flex justify-content-center vh-40">
            <div className="card p-4" style={{ width: '400px' }}>
                <h1 className="card-title text-center">Registrera</h1>
                <div className="form-group">
                    <label htmlFor="username">Användarnamn:</label>
                    <input type="text" className="form-control" id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Lösenord:</label>
                    <input type="password" className="form-control" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <div className="form-group">
                    <label htmlFor="confirmPassword">Bekräfta lösenord:</label>
                    <input type="password" className="form-control" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                </div>
                <button type="submit" className="btn btn-primary btn-block mt-4">Registrera</button>
                <p className="text-center mt-3">Redan medlem? <Link to="/login" className="link">Logga in här</Link></p>
            </div>
        </div>
    </form>
  );
}


export default Register;
