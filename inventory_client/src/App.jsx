import React, { useState } from 'react';
import InventoryManagement from './components/InventoryManagement';
import Login from './components/Login';
import Signup from './components/Signup';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [showLogin, setShowLogin] = useState(true);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  const switchForm = () => {
    setShowLogin(!showLogin);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {!isAuthenticated ? (
        showLogin ? (
          <Login 
            onLoginSuccess={handleLoginSuccess} 
            switchToSignup={() => setShowLogin(false)} 
          />
        ) : (
          <Signup 
            onSignupSuccess={() => setShowLogin(true)} 
            switchToLogin={() => setShowLogin(true)} 
          />
        )
      ) : (
        <div>
          <button
            onClick={handleLogout}
            className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
          <InventoryManagement />
        </div>
      )}
    </div>
  );
}

export default App;