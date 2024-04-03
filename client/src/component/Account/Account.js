import React, { useState, useEffect } from 'react';
import './Account.css';
import LoginForm from '../LoginForm/LoginForm';
import RegisterForm from '../RegisterForm/RegisterForm';

const Account = ({ isLoggedIn, onRegister }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = getCookie('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const toggleRegister = () => {
    setIsRegistering(!isRegistering);
  };

  const handleLogin = (userData) => {
    setUser(userData);
    setCookie('user', JSON.stringify(userData), 1);
  };

  const handleLogout = () => {
    setUser(null);
    deleteCookie('user');
  };

  const getCookie = (name) => {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      const [cookieName, cookieValue] = cookie.split('=');
      if (cookieName.trim() === name) {
        return decodeURIComponent(cookieValue);
      }
    }
    return null;
  };

  const setCookie = (name, value, days) => {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + encodeURIComponent(value) + ";" + expires + ";path=/";
  };

  const deleteCookie = (name) => {
    document.cookie = name + '=; Max-Age=-99999999;';
  };

  return (
    <div className="account">
      {isLoggedIn || user ? (
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
            <RegisterForm onRegister={onRegister} />
          ) : (
            <LoginForm onLogin={handleLogin} />
          )}
          <div style={{ marginTop: '20px' }}>
            <button onClick={toggleRegister}>
              {isRegistering ? 'Back to Login' : 'Register'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Account;
