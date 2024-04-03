import React, { useState } from 'react';
import LoginForm from '../LoginForm/LoginForm';
import RegisterForm from '../RegisterForm/RegisterForm';

const Account = ({ isLoggedIn, onRegister }) => {
  const [isRegistering, setIsRegistering] = useState(false);

  const toggleRegister = () => {
    setIsRegistering(!isRegistering);
  };

  const handleLogin = (userData) => {
    // Handle login logic here, e.g., calling a function passed as prop
    // or updating state to reflect that the user is logged in
    console.log('Logged in successfully:', userData);
  };

  return (
    <div className="account">
      {isLoggedIn ? (
        <div>
          {/* Your account content goes here */}
          <h2>Welcome to your account!</h2>
          <p>Account details...</p>
        </div>
      ) : (
        <div>
          {isRegistering ? (
            <RegisterForm onRegister={onRegister} />
          ) : (
            <LoginForm onLogin={handleLogin} />
          )}
          <button onClick={toggleRegister}>
            {isRegistering ? 'Back to Login' : 'Register'}
          </button>
        </div>
      )}
    </div>
  );
};

export default Account;
