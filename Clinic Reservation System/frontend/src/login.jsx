import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('patient');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let apiEndpoint = '';
      if (userType === 'patient') {
        apiEndpoint = 'http://localhost:8080/logInPatient';
      } else if (userType === 'doctor') {
        apiEndpoint = 'http://localhost:8080/logInDoctor';
      }

      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        
        const result = await response.json();
        console.log('Login successful:', result);
        if(userType === 'doctor')
        {
        navigate('/table', { state: { email } });
        }
        else if (userType === 'patient')
        {
          navigate('/patient', { state: { email } });
        }

      } else {
        console.error('Login failed:', response.statusText);
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };


  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <label style={styles.label}>
        Email:
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />
      </label>
      <br />
      <label style={styles.label}>
        Password:
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />
      </label>
      <br />
      <label style={styles.label}>
        User Type:
        <input
          type="radio"
          value="patient"
          checked={userType === 'patient'}
          onChange={() => setUserType('patient')}
        /> Patient
        <input
          type="radio"
          value="doctor"
          checked={userType === 'doctor'}
          onChange={() => setUserType('doctor')}
        /> Doctor
      </label>
      <br />
      <button type="submit" style={styles.button}>
        Log In
      </button>
    </form>
  );
}

const styles = {
  form: {
    maxWidth: '300px',
    margin: 'auto',
  },
  label: {
    display: 'block',
    marginBottom: '10px',
  },
  input: {
    width: '100%',
    padding: '8px',
    marginBottom: '10px',
  },
  button: {
    background: '#4CAF50',
    color: 'white',
    padding: '10px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default Login;
