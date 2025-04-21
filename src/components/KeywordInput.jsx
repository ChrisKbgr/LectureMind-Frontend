import React from 'react';

const KeywordInput = ({ keywords, newKeyword, setNewKeyword, setKeywords }) => {
  const addKeyword = () => {
    const word = newKeyword.trim().toLowerCase();
    if (word && !keywords.includes(word)) {
      setKeywords([...keywords, word]);
      setNewKeyword('');
    }
  };

  return (
    <div style={{ marginBottom: '10px' }}>
      <input
        type="text"
        value={newKeyword}
        onChange={(e) => setNewKeyword(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && addKeyword()}
        placeholder="Add keyword..."
        style={{ padding: '6px', borderRadius: '6px', marginRight: '8px' }}
      />
      <button
        onClick={addKeyword}
        style={{ padding: '6px 12px', background: '#4caf50', color: '#fff', border: 'none', borderRadius: '6px' }}
      >
        ➕ Add Keyword
      </button>
      <div style={{ marginTop: '10px' }}>
        <strong>Listening for:</strong>
        <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
          {keywords.map((kw, idx) => (
            <li key={idx} style={{ display: 'inline-block', marginRight: '8px' }}>
              <span style={{ background: '#eee', padding: '4px 8px', borderRadius: '6px' }}>{kw}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default KeywordInput;