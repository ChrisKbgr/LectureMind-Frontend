// src/App.js
import React, { useEffect, useState } from 'react';
import MindMap from './MindMap';
import keywords from './keywords';

function App() {
  const [graphData, setGraphData] = useState({ nodes: [], edges: [] });

  useEffect(() => {
    const nodes = keywords.map(k => ({
      id: k.id,
      label: k.name
    }));

    const edges = keywords.slice(1).map((k, i) => ({
      source: keywords[i].id,
      target: k.id
    }));

    setGraphData({ nodes, edges });
  }, []);

  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>Mind Map of Keywords</h1>
      <MindMap data={graphData} />
    </div>
  );
}

export default App;
