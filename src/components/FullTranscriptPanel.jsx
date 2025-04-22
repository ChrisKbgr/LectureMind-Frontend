import React from 'react';
import styles from '../styles/MindMap.module.css';

const FullTranscriptPanel = ({ fullTranscriptLog }) => {
  // Only keep the last 100 characters worth of words
  const maxCharacters = 100;
  let currentLength = 0;
  const visibleWords = [];

  // Process words from newest to oldest
  for (let i = fullTranscriptLog.length - 1; i >= 0; i--) {
    const entry = fullTranscriptLog[i];
    currentLength += entry.text.length + 1; // +1 for space
    if (currentLength <= maxCharacters) {
      visibleWords.unshift(entry);
    } else {
      break;
    }
  }

  return (
    <div className={styles.transcriptPanel}>
      <strong>🗣️ Full Speech:</strong>
      <div className={styles.transcriptContent}>
        {visibleWords.map((entry, idx) => {
          const age = Date.now() - entry.timestamp;
          const fadeDuration = 10000; // 10 seconds
          const opacity = Math.max(0.2, 1 - age / fadeDuration);

          return (
            <span
              key={`${entry.timestamp}-${idx}`}
              className={styles.transcriptWord}
              style={{ opacity }}
            >
              {entry.text}{' '}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export default FullTranscriptPanel;