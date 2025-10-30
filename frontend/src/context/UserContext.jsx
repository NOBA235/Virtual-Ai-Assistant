import React, { createContext, useState, useContext, useEffect } from 'react';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [conversation, setConversation] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [availableVoices, setAvailableVoices] = useState([]);

  // Initialize voices
  useEffect(() => {
    const loadVoices = () => {
      const voices = speechSynthesis.getVoices();
      setAvailableVoices(voices);
      if (voices.length > 0 && !selectedVoice) {
        setSelectedVoice(voices[0]);
      }
    };

    loadVoices();
    speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      speechSynthesis.onvoiceschanged = null;
    };
  }, []);


  useEffect(() => {
    const savedUser = localStorage.getItem('username');
    if (savedUser) {
      setUser(savedUser);
      setConversation([{
        speaker: 'ai',
        text: `Welcome back ${savedUser}! How can I help you today?`,
        timestamp: new Date()
      }]);
    }
  }, []);

 
  const aiResponse = async (prompt) => {
    try {
      const backendUrl = import.meta.env.VITE_API_URL; 
      console.log("Backend connected to:", backendUrl);

      const res = await fetch(`${backendUrl}/api/ai/respond`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) {
        throw new Error(`Backend error: ${res.status}`);
      }

      const data = await res.json();
      return data.reply;
    } catch (err) {
      console.error('AI request failed:', err);
      return "Sorry, I'm unable to answer right now. Please try again later.";
    }
  };

  // Speech function
  const speak = (text) => {
    if (!text || isSpeaking) return;

    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    speechSynthesis.speak(utterance);
  };

  const addMessage = (speaker, text) => {
    const newMessage = {
      speaker,
      text,
      timestamp: new Date()
    };
    setConversation(prev => [...prev, newMessage]);
  };

  const handleUserInput = async (inputText) => {
    if (!inputText.trim()) return;

    addMessage('user', inputText);
    setIsListening(false);

    try {
      const response = await aiResponse(inputText);
      addMessage('ai', response);
      speak(response);
    } catch (error) {
      console.error('Error in handleUserInput:', error);
      const errorMessage = "Sorry, I encountered an error. Please try again.";
      addMessage('ai', errorMessage);
      speak(errorMessage);
    }
  };

  const login = (userName) => {
    const trimmedName = userName.trim();
    setUser(trimmedName);
    localStorage.setItem('username', trimmedName);
    addMessage('ai', `Hello ${trimmedName}! I'm your AI assistant. How can I help you today?`);
  };

  const logout = () => {
    setUser(null);
    setConversation([]);
    localStorage.removeItem('username');
    speechSynthesis.cancel();
    setIsListening(false);
  };

  const value = {
    user,
    conversation,
    isListening,
    isSpeaking,
    selectedVoice,
    availableVoices,
    setSelectedVoice,
    speak,
    login,
    logout,
    handleUserInput,
    setIsListening
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
