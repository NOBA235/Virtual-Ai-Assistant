import React, { useState } from 'react';
import { useUser } from '../context/UserContext'; 
import logo from "../assets/logo.png"

function Login() {
  const [name, setName] = useState('');
  const { login } = useUser();

  function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) return;
    login(name);
  }

  return (
    <div className="login-container">
      
      <div className="login-card">
        <h2>Welcome to Your AI Assistant</h2>
        <p className="login-subtitle">Your intelligent conversation partner</p>
        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="text"
            placeholder="Enter your name to begin"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="login-input"
            autoFocus
          />
          <button type="submit" className="login-button">
            Start Conversation
             <img src={logo} id='ailogo' style={{height:"30px",width:"30px"}}></img>
          </button>
        </form>
      </div>
   
    </div>

      );
    
}

export default Login;