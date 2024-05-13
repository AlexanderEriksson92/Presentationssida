import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  Navigate
} from 'react-router-dom';
import Login from './Login';
import Register from './Register'; 
import Home from './Home';
import MA from './Ma';
import CA from './Ca';
import Exempel from './Exempel';
import { useLogin, AuthProvider } from './LoginCheck';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div>
          <nav>
            <NavigationLinks />
          </nav>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} /> 
            <Route path="/exempel" element={<ProtectedRoute><Exempel /></ProtectedRoute>} />
            <Route path="/ca" element={<ProtectedRoute><CA /></ProtectedRoute>} />
            <Route path="/ma" element={<ProtectedRoute><MA /></ProtectedRoute>} />
            <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

function NavigationLinks() {
  const { user, logout } = useLogin();
  console.log("User status in NavigationLinks:", user);

  return (
    <ul>
      {!user ? (
        <>
          <li><Link to="/login">Login</Link></li>
          <li><Link to="/register">Register</Link></li> 
        </>
      ) : (
        <>
          <li><a href="#" onClick={logout}>Logout</a></li>
          <li><Link to="/">Startsida</Link></li>
          <li><Link to="/ma">MA</Link></li>
          <li><Link to="/ca">CA</Link></li>
          <li><Link to="/exempel">Exempel</Link></li>
        </>
      )}
    </ul>
  );
}

function ProtectedRoute({ children }) {
  const { user } = useLogin();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default App;
