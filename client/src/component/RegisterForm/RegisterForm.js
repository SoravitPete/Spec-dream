import React, { useState } from 'react';
import './RegisterForm.css'

const RegisterForm = () => {
  const [userData, setUserData] = useState({
    accountName: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    mobileNo: '',
    birthday: '',
    picture: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3000/user/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      console.log(userData)

      if (response.ok) {
        console.log('Registration successful');
      } else {
        console.error('Registration failed');
      }
    } catch (error) {
      console.error('Error during registration:', error);
    }
  };

  return (
    <div className="register">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="accountName" placeholder="Account Name" value={userData.accountName} onChange={handleChange} />
        <input type="text" name="firstName" placeholder="First Name" value={userData.firstName} onChange={handleChange} />
        <input type="text" name="lastName" placeholder="Last Name" value={userData.lastName} onChange={handleChange} />
        <input type="email" name="email" placeholder="Email" value={userData.email} onChange={handleChange} />
        <input type="password" name="password" placeholder="Password" value={userData.password} onChange={handleChange} />
        <input type="text" name="mobileNo" placeholder="Mobile Number" value={userData.mobileNo} onChange={handleChange} />
        <input type="text" name="birthday" placeholder="Birthday" value={userData.birthday} onChange={handleChange} />
        <input type="text" name="picture" placeholder="Profile Picture URL" value={userData.picture} onChange={handleChange} />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default RegisterForm;