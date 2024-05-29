import React, { useState } from 'react';  
import { Link, useNavigate } from 'react-router-dom';  
import { useLogin } from './LoginCheck';

function Login() {
    const { login } = useLogin();
    const [username, setUsername] = useState('');  
    const [password, setPassword] = useState(''); 
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        const response = await fetch('http://localhost:3001/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await response.json();
        if (response.ok) {
            login(data); // Spara token och loggar in användaren
            alert('Inloggning lyckad!');
            navigate('/');
        } else {
            alert('Fel användarnamn eller lösenord');
        }
    };

    return (
        <div className="container d-flex justify-content-center vh-40">
            <div className="card p-4" style={{ width: '400px' }}>
                <h1 className="card-title text-center">Logga in</h1>
                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label htmlFor="username">Användarnamn:</label>
                        <input type="text" className="form-control" id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Lösenord:</label>
                        <input type="password" className="form-control" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <button type="submit" className="btn btn-primary btn-block mt-4">Logga in</button>
                </form>
                <p className="text-center mt-3">Inte medlem? <Link to="/register" className="link">Registrera dig här</Link></p>
            </div>
        </div>
    );
}

export default Login;