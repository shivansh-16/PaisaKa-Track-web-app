'use client';

import { useState } from 'react';

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  placeholder?: string;
  className?: string;
}

export default function VoiceInput({ onTranscript, placeholder = "Speak now...", className = "" }: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Voice input is not supported in this browser. Please use Chrome or Edge.');
      return;
    }

    setIsSupported(true);
    setIsListening(true);

    const SpeechRecognition = (window as { SpeechRecognition?: any; webkitSpeechRecognition?: any }).SpeechRecognition || (window as { SpeechRecognition?: any; webkitSpeechRecognition?: any }).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-IN'; // Indian English

    recognition.onresult = (event: unknown) => {
      const e = event as { results: { [0]: { [0]: { transcript: string } } } };
      const transcript = e.results[0][0].transcript;
      onTranscript(transcript);
      setIsListening(false);
    };

    recognition.onerror = (event: unknown) => {
      const e = event as { error: string };
      console.error('Speech recognition error:', e.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const stopListening = () => {
    setIsListening(false);
  };

  return (
    <button
      onClick={isListening ? stopListening : startListening}
      className={`p-2 rounded-full transition-all duration-200 ${
        isListening 
          ? 'animate-pulse bg-red-500 text-white' 
          : 'bg-emerald-500 text-white hover:bg-emerald-600'
      } ${className}`}
      style={{ 
        background: isListening ? 'var(--pk-red)' : 'var(--pk-green)',
        animation: isListening ? 'pulse 1s infinite' : 'none'
      }}
      title={isListening ? 'Stop listening' : 'Start voice input'}
    >
      {isListening ? '🔴' : '🎤'}
    </button>
  );
}
