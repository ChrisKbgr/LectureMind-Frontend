import React from 'react';
import styles from '../styles/MindMap.module.css';

const NodeEditor = ({ 
  labelInput, 
  setLabelInput, 
  extraText, 
  setExtraText, 
  nodeColor, 
  setNodeColor, 
  updateNode,
  generateAIDescription,
  isGeneratingAI // Add this prop
}) => {
  return (
    <div className={styles.nodeEditor}>
      <h3 className={styles.nodeEditorTitle}>Edit Node</h3>
      <div className={styles.nodeEditorFields}>
        <div className={styles.inputGroup}>
          <label>Node Title:</label>
          <input
            type="text"
            value={labelInput}
            onChange={(e) => setLabelInput(e.target.value)}
            placeholder="Enter node title..."
            className={styles.nodeEditorInput}
          />
        </div>
        <div className={styles.inputGroup}>
          <label>Additional Info:</label>
          <textarea
            value={extraText}
            onChange={(e) => setExtraText(e.target.value)}
            placeholder="Enter additional information..."
            className={styles.nodeEditorTextarea}
            rows={3}
          />
        </div>
        <div className={styles.inputGroup}>
          <label>Node Color:</label>
          <div className={styles.colorPicker}>
            <input
              type="color"
              value={nodeColor}
              onChange={(e) => setNodeColor(e.target.value)}
              className={styles.nodeEditorColor}
            />
            <span className={styles.colorValue}>{nodeColor}</span>
          </div>
        </div>
        <button 
          onClick={() => generateAIDescription(labelInput)}
          className={styles.aiButton}
          disabled={isGeneratingAI}
        >
          {isGeneratingAI ? '🔄 Generating...' : '🤖 Generate AI Description'}
        </button>
      </div>
      <button onClick={updateNode} className={`${styles.btn} ${styles.btnUpdate}`}>
        💾 Update Node
      </button>
    </div>
  );
};

export default NodeEditor;