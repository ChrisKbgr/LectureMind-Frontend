import React from 'react';
import styles from '../styles/MindMap.module.css';

const DetectedPanel = ({ detectedWords }) => (
  <div className={styles.detectedPanel}>
    <strong>🎤 Detected Keywords:</strong>
    <ul className={styles.panelList}>
      {detectedWords.map((word, idx) => (
        <li 
          key={word}
          className={styles.panelItem}
        >
          {word}
        </li>
      ))}
    </ul>
  </div>
);

export default DetectedPanel;