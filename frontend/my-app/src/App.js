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
import EditPosts from './EditPosts';
import Presentationssida from './Presentationssida';
import { useLogin, AuthProvider } from './LoginCheck';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

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
          <div className="container container-custom mt-3">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/exempel" element={<ProtectedRoute><Exempel /></ProtectedRoute>} />
              <Route path="/ca" element={<ProtectedRoute><CA /></ProtectedRoute>} />
              <Route path="/ma" element={<ProtectedRoute><MA /></ProtectedRoute>} />
              <Route path="/edit-posts" element={<ProtectedRoute><EditPosts /></ProtectedRoute>} />
              <Route path="/presentationssida" element={<ProtectedRoute><Presentationssida /></ProtectedRoute>} />
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
            <li className="nav-item"><Link className="nav-link" to="/exempel">Elementor</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/ma">MA</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/ca">CA</Link></li>
        
            <li className="nav-item"><Link className="nav-link" to="/edit-posts">Edit Posts</Link></li> 
            <li className="nav-item"><Link className="nav-link" to="/presentationssida">Presentationssida</Link></li>
          </>
        )}
      </ul>
    </div>
  );
}

function ProtectedRoute({ children }) {
  const { user, loading } = useLogin();

  if (loading) {
    // Visa en laddningsindikator eller inget medan autentiseringskontrollen pågår
    return null;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default App;
