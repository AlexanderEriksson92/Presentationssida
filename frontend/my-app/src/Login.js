import React, { useState } from 'react';  
import { Link } from 'react-router-dom';  
import { useLogin } from './LoginCheck';  
import { useNavigate } from 'react-router-dom';

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
            login(data);
            alert('Inloggning lyckad!');
            navigate('/');
        } else {
            alert('Fel användarnamn eller lösenord');
        }
    };

    return (
        <div>
            <h1>Logga in</h1>
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
            <p>Inte medlem? <Link to="/register">Registrera dig här</Link></p>
        </div>
    );
}

export default Login;