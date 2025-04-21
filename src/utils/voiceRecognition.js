export const setupVoiceRecognition = (onSpeechDetected, onTranscript, keywords = []) => {
  if (!('webkitSpeechRecognition' in window)) {
    alert('Your browser does not support speech recognition.');
    return null;
  }

  const recognition = new window.webkitSpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = 'en-US';

  let currentUtterance = '';

  recognition.onresult = (event) => {
    const result = event.results[event.resultIndex];
    const transcript = result[0].transcript.trim();

    if (!result.isFinal) {
      // For interim results, only send the difference
      const newPart = transcript.slice(currentUtterance.length);
      if (newPart) {
        onTranscript(newPart);
        currentUtterance = transcript;
      }
    } else {
      // For final results
      const newPart = transcript.slice(currentUtterance.length);
      if (newPart) {
        onTranscript(newPart);
      }
      currentUtterance = ''; // Reset for next utterance

      // Check keywords
      const lowerTranscript = transcript.toLowerCase();
      keywords.forEach((keyword) => {
        if (lowerTranscript.includes(keyword.toLowerCase())) {
          onSpeechDetected(keyword, transcript);
        }
      });
    }
  };

  recognition.onstart = () => {
    console.log('Speech recognition started...');
  };

  recognition.onend = () => {
    console.log('Speech recognition ended...');
  };

  recognition.onerror = (event) => {
    console.error('Speech recognition error:', event);
  };

  const startRecognition = () => {
    recognition.start();
  };

  const stopRecognition = () => {
    recognition.stop();
  };

  return {
    start: startRecognition,
    stop: stopRecognition,
  };
};