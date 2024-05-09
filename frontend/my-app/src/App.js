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

function ProtectedRoute({ children }) {
  const apiKey = localStorage.getItem('apikey');
  if (!apiKey) {
    // Om användaren inte har en giltig api-nyckel skickas användaren till inloggningssidan
    return <Navigate to="/login" replace />;
  }
  return children;
}
function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li><Link to="/">Startsida</Link></li>
            <li><Link to="/ma">MA</Link></li>
            <li><Link to="/ca">CA</Link></li>
            <li><Link to="/exempel">Exempel</Link></li>
          </ul>
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
  );
}

export default App;