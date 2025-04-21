import React from 'react';

const NodeEditor = ({ labelInput, setLabelInput, extraText, setExtraText, nodeColor, setNodeColor, updateNode }) => {
  return (
    <div className="node-editor">
      <input
        type="text"
        value={labelInput}
        onChange={(e) => setLabelInput(e.target.value)}
        placeholder="Node title"
        className="node-editor-input"
      />
      <input
        type="text"
        value={extraText}
        onChange={(e) => setExtraText(e.target.value)}
        placeholder="Extra text"
        className="node-editor-input"
      />
      <input
        type="color"
        value={nodeColor}
        onChange={(e) => setNodeColor(e.target.value)}
      />
      <button onClick={updateNode} className="btn">
        Apply
      </button>
      <div className="node-editor-preview">
        Preview: {labelInput}{extraText && ` — ${extraText}`}
      </div>
    </div>
  );
};

export default NodeEditor;