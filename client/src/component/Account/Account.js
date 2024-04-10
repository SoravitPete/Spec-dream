import React, { useState, useEffect } from 'react';
import './Account.css';
import LoginForm from '../LoginForm/LoginForm';
import RegisterForm from '../RegisterForm/RegisterForm';

const Account = ({ isLoggedIn, onRegister }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [user, setUser] = useState(null);
  const [redirectToLogin, setRedirectToLogin] = useState(false); // New state for redirection

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const toggleRegister = () => {
    setIsRegistering(!isRegistering);
    setRedirectToLogin(false);
  };

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('isLoggedIn', true);
    localStorage.setItem('accountName', userData.accountName);
    localStorage.setItem('firstName', userData.firstName)
    localStorage.setItem('lastName', userData.lastName)
    localStorage.setItem('email', userData.email)
    localStorage.setItem('password', userData.password)
    localStorage.setItem('mobileNo', userData.mobileNo)
    localStorage.setItem('birthday', userData.birthday)
    localStorage.setItem('picture', userData.picture)
    window.location.reload(); // Reload the website after logout
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('accountName');
    localStorage.removeItem('firstName');
    localStorage.removeItem('lastName');
    localStorage.removeItem('email');
    localStorage.removeItem('password');
    localStorage.removeItem('mobileNo');
    localStorage.removeItem('birthday');
    localStorage.removeItem('picture');
    window.location.reload(); // Reload the website after logout
  };


  const handleRegister = (userData) => {
    onRegister(userData);
    setRedirectToLogin(true); // Set redirection state after successful registration
  };

  useEffect(() => {
    if (redirectToLogin && !isRegistering) {
      setIsRegistering(false);
    }
  }, [redirectToLogin, isRegistering]);

  useEffect(() => {
    if (redirectToLogin && isRegistering) {
      setIsRegistering(false); // Reset registration state
    }
  }, [redirectToLogin, isRegistering]);

  return (
    <div className="account">
      {isLoggedIn || localStorage.getItem('isLoggedIn') ? (
        <div>
          <h2>Welcome to your account, {user ? user.firstName + ' ' + user.lastName : ''}!</h2>
          <p>Email: {user ? user.email : ''}</p>
          <p>Mobile Number: {user ? user.mobileNo : ''}</p>
          <p>Birthday: {user ? user.birthday : ''}</p>
          <p>Profile Picture: {user ? <img src={user.picture} alt="Profile" /> : ''}</p>
          <button onClick={handleLogout}>Sign out</button>
        </div>
      ) : (
        <div>
          {isRegistering ? (
            <RegisterForm onRegister={handleRegister} />
          ) : (
            <LoginForm onLogin={handleLogin} />
          )}
          <div style={{ marginTop: '20px' }}>
            <button onClick={toggleRegister}>
              {isRegistering ? 'Back to Login' : 'Sign Up'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Account;
