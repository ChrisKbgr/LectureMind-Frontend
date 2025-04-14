// src/MindMap.js
import React, { useRef, useEffect } from 'react';
import cytoscape from 'cytoscape';

const MindMap = ({ data }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!data.nodes.length || !data.edges.length) return;

    const cy = cytoscape({
      container: containerRef.current,
      elements: [
        ...data.nodes.map(node => ({ data: { id: node.id, label: node.label } })),
        ...data.edges.map(edge => ({ data: { source: edge.source, target: edge.target } }))
      ],
      style: [
        {
          selector: 'node',
          style: {
            'background-color': '#007bff',
            'label': 'data(label)',
            'color': '#fff',
            'text-valign': 'center',
            'text-halign': 'center',
            'font-size': '12px'
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
        name: 'cose'
      }
    });

    return () => cy.destroy();
  }, [data]);

  return <div ref={containerRef} style={{ width: '100%', height: '600px' }} />;
};

export default MindMap;
