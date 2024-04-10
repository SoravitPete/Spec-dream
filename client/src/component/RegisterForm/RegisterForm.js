import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './RegisterForm.css';

const RegisterForm = () => {
  const [userData, setUserData] = useState({
    accountName: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    mobileNo: '',
    birthday: new Date(), // Set initial date value
    picture: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleDateChange = (date) => {
    setUserData({ ...userData, birthday: date });
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
        <DatePicker
          selected={userData.birthday}
          onChange={handleDateChange}
          dateFormat="yyyy-MM-dd"
          placeholderText="Select Birthday"
          className="date-picker"
        />
        <input type="text" name="picture" placeholder="Profile Picture URL" value={userData.picture} onChange={handleChange} />
        <div style={{ marginTop: '20px' }}>
          <button type="submit">Register</button>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
