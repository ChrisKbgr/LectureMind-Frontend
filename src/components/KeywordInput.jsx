import React from 'react';
import styles from '../styles/MindMap.module.css';

const KeywordInput = ({ keywords, newKeyword, setNewKeyword, setKeywords }) => {
  const addKeyword = () => {
    const word = newKeyword.trim().toLowerCase();
    if (word && !keywords.includes(word)) {
      setKeywords([...keywords, word]);
      setNewKeyword('');
    }
  };

  return (
    <div>
      <div className={styles.keywordInput}>
        <input
          type="text"
          value={newKeyword}
          onChange={(e) => setNewKeyword(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addKeyword()}
          placeholder="Add keyword..."
        />
        <button onClick={addKeyword}>
          Add Keyword
        </button>
      </div>
      <div className={styles.keywordList}>
        <strong>Listening for:</strong>
        {keywords.map((kw, idx) => (
          <span key={idx} className={styles.keyword}>
            {kw}
          </span>
        ))}
      </div>
    </div>
  );
};

export default KeywordInput;