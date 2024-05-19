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
import Add from './Add';
import Exempel from './Exempel';
import { useLogin, AuthProvider } from './LoginCheck';
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  return (
    <AuthProvider>
      <Router>
        <div>
          <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container-fluid">
              <NavigationLinks />
            </div>
          </nav>
          <div className="container mt-3">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/exempel" element={<ProtectedRoute><Exempel /></ProtectedRoute>} />
              <Route path="/ca" element={<ProtectedRoute><CA /></ProtectedRoute>} />
              <Route path="/ma" element={<ProtectedRoute><MA /></ProtectedRoute>} />
              <Route path="/add" element={<ProtectedRoute><Add /></ProtectedRoute>} />  
              <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

function NavigationLinks() {
  const { user, logout } = useLogin();
  return (
    <div className="container-fluid">
      <ul className="navbar-nav mx-auto">
        {!user ? (
          <>
            <li className="nav-item"><Link className="nav-link" to="/login">Login</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/register">Register</Link></li>
          </>
        ) : (
          <>
            <li className="nav-item"><a className="nav-link" href="#" onClick={logout}>Logout</a></li>
            <li className="nav-item"><Link className="nav-link" to="/">Startsida</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/ma">MA</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/ca">CA</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/exempel">Exempel</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/add">Lägg till Inlägg</Link></li> 
          </>
        )}
      </ul>
    </div>
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
