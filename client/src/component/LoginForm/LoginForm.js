import React, { useState } from 'react';
import './LoginForm.css'

const LoginForm = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({
    accountName: '',
    password: ''
  });

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3000/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await response.json();

      onLogin(data.user);
      console.log(credentials)

    } catch (error) {
      console.log(error)
      console.log(credentials)
      console.error('Login failed:', error.message);
    }
  };


  return (
    <div className="login">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="accountName" placeholder="AccountName" value={credentials.accountName} onChange={handleChange} />
        <input type="password" name="password" placeholder="Password" value={credentials.password} onChange={handleChange} />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginForm;
