// src/utils/voiceRecognition.js
export const setupVoiceRecognition = (onKeywordDetected, dictionary = []) => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
  
    if (!SpeechRecognition) {
      console.warn('Speech Recognition not supported in this browser.');
      return null;
    }
  
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = true;
    recognition.interimResults = false;
  
    recognition.onresult = (event) => {
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          const transcript = event.results[i][0].transcript.toLowerCase().trim();
          console.log('🎤 Voice Input:', transcript);
  
          dictionary.forEach((keyword) => {
            if (transcript.includes(keyword)) {
              onKeywordDetected(keyword, transcript);
            }
          });
        }
      }
    };
  
    recognition.onerror = (e) => {
      console.error('Speech Recognition Error:', e.error);
    };
  
    return recognition;
  };
  