import React, { useState, useEffect } from 'react';
import cytoscape from 'cytoscape';

function App() {
  const [cy, setCy] = useState(null);

  useEffect(() => {
    const cyInstance = cytoscape({
      container: document.getElementById('cy'),
      elements: [
        { data: { id: 'a', label: 'Keyword A' } },
        { data: { id: 'b', label: 'Keyword B' } },
        { data: { source: 'a', target: 'b' } }
      ],
      style: [
        {
          selector: 'node',
          style: {
            'background-color': '#007bff',
            'label': 'data(label)',
            'color': '#fff',
            'text-valign': 'center',
            'text-halign': 'center'
          }
        },
        {
          selector: 'edge',
          style: {
            'width': 2,
            'line-color': '#ccc'
          }
        }
      ],
      layout: {
        name: 'grid',
        rows: 1
      }
    });

    setCy(cyInstance);

    return () => {
      cyInstance.destroy();
    };
  }, []);

  return (
    <div>
      <h1>Mind Map of Keywords</h1>
      <div id="cy" style={{ width: '100%', height: '600px' }}></div>
    </div>
  );
}

export default App;
