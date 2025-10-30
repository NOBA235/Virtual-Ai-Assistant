import React, { useState, useEffect } from 'react';
import { useUser } from './context/UserContext';
import Login from './components/Login';
import VoiceSelector from './components/VoiceSelector';
import './App.css';
import speak from "./assets/speak.gif"
import listen from "./assets/listening.gif";
import Mark from "./assets/ai.jpg";



function App() {
  const { 
    user, 
    conversation, 
    isListening, 
    isSpeaking, 
    handleUserInput, 
    logout,
    setIsListening 
  } = useUser();

  const [inputText, setInputText] = useState('');

  // Speech Recognition Setup
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.log('Speech recognition not supported in this browser');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);
    
    recognition.onend = () => {
      setIsListening(false);
    };
    
    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInputText(transcript);
      handleUserInput(transcript);
      setInputText('');
    };

    if (isListening) {
      try {
        recognition.start();
      } catch (error) {
        console.error('Error starting speech recognition:', error);
        setIsListening(false);
      }
    }

    return () => {
      try {
        recognition.stop();
      } catch (error) {
        
      }
    };
  }, [isListening, handleUserInput, setIsListening]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputText.trim()) {
      handleUserInput(inputText);
      setInputText('');
    }
  };

  const startListening = () => {
    if (!isListening) {
      setIsListening(true);
    }
  };

  const stopListening = () => {
    setIsListening(false);
  };

  if (!user) {
    return <Login />;
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>AI Assistant</h1>
          <p className="welcome-message">Hello, {user}!</p>
        </div>
        <div className="header-controls">
          <VoiceSelector />
          <button onClick={logout} className="logout-button">
            Logout
          </button>
        </div>
      </header>
 <div className="conversation-container">
  <div className="conversation">
    {conversation.map((msg, index) => (
      <div key={index} className={`message ${msg.speaker}`}>
        <div className="message-bubble">
          <div className="message-header">
            <img
              src={
                msg.speaker === 'user'?
                "You"          
                  : Mark 
              }
              alt={msg.speaker}
              className="avatar"
            />
            <span className="sender-name">
              {msg.speaker === 'user' ? 'You' : 'AI'}
            </span>
          </div>
          <p>{msg.text}</p>
        </div>
      </div>
    ))}
  </div>
</div>

   

      <div className="status-indicators">
        {isListening && (
          <div className="status listening">
             <img src={speak} style={{height:"40px",width:"40px",borderRadius:"50px"}}/>  Listening... <button onClick={stopListening} className="stop-button">Stop</button>
          </div>
        )}
        {isSpeaking && <div className="status speaking">
          <img src={listen} style={{height:"30px",width:"30px"}}/>
       Speaking.....</div>}
      </div>

      <form onSubmit={handleSubmit} className="input-form">
        <div className="input-group">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your message or use voice input..."
            className="text-input"
            disabled={isListening}
          />
          <button 
            type="button" 
            onClick={startListening}
            disabled={isListening || isSpeaking}
            className={`voice-button ${isListening ? 'listening' : ''}`}
            title="Start voice input"
          >
            {isListening ? '🔴' : '🎤'}
          </button>
          <button 
            type="submit" 
            disabled={!inputText.trim() || isListening}
            className="send-button"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}

export default App;
