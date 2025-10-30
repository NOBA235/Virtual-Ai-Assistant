import React from 'react';
import { useUser } from '../context/UserContext';

function VoiceSelector() {
  const { availableVoices, selectedVoice, setSelectedVoice, isSpeaking } = useUser();

  const handleVoiceChange = (e) => {
    const voiceName = e.target.value;
    const voice = availableVoices.find(v => v.name === voiceName);
    if (voice) {
      setSelectedVoice(voice);
    }
  };

  if (availableVoices.length === 0) {
    return (
      <div className="voice-selector">
        <span>Loading voices...</span>
      </div>
    );
  }

  return (
    <div className="voice-selector">
      <label htmlFor="voice-select" className="voice-label">
        Voice: 
      </label>
      <select 
        id="voice-select"
        value={selectedVoice?.name || ''} 
        onChange={handleVoiceChange}
        disabled={isSpeaking}
        className="voice-select"
      >
        {availableVoices.map((voice) => (
          <option key={voice.name} value={voice.name}>
            {voice.name} ({voice.lang})
          </option>
        ))}
      </select>
    </div>
  );
}

export default VoiceSelector;