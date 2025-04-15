import React, { useRef, useEffect, useState } from 'react';
import cytoscape from 'cytoscape';
import { setupVoiceRecognition } from './utils/voiceRecognition'; // ensure this file is inside `src/utils/`

const generateUniqueNodeId = () => `node-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

const keywordDictionary = ['we', 'make', 'apple', 'great', 'again', 'america', 'freedom'];

const MindMap = () => {
  const containerRef = useRef(null);
  const cyRef = useRef(null);
  const [nodeCount, setNodeCount] = useState(1);
  const [selectedNode, setSelectedNode] = useState(null);
  const selectedNodeRef = useRef(null);
  const [labelInput, setLabelInput] = useState('');
  const [extraText, setExtraText] = useState('');
  const [nodeColor, setNodeColor] = useState('#4e91ff');
  const recognitionRef = useRef(null);
  const [isListening, setIsListening] = useState(false);

  const createNodeFromVoice = (keyword) => {
    const cy = cyRef.current;
    const id = generateUniqueNodeId();
    const label = keyword.charAt(0).toUpperCase() + keyword.slice(1);

    if (cy.getElementById(id).length > 0) return;

    cy.add({
      group: 'nodes',
      data: { id, label },
      position: {
        x: 100 + Math.random() * 500,
        y: 100 + Math.random() * 400,
      },
      style: {
        'background-color': '#28a745',
        'text-outline-color': '#28a745',
      }
    });

    if (selectedNodeRef.current) {
      cy.add({
        group: 'edges',
        data: { source: selectedNodeRef.current.id(), target: id }
      });
    }

    setNodeCount((n) => n + 1);
  };

  useEffect(() => {
    const cy = cytoscape({
      container: containerRef.current,
      elements: [],
      style: [
        {
          selector: 'node',
          style: {
            'shape': 'ellipse',
            'background-color': '#5567aa',
            'label': 'data(label)',
            'text-valign': 'center',
            'text-halign': 'center',
            'color': '#fff',
            'text-outline-width': 2,
            'text-outline-color': '#5567aa',
            'font-size': 16,
            'padding': '15px',
            'width': 'label',
            'height': 'label',
            'text-wrap': 'wrap',
            'text-max-width': 120,
            'overlay-padding': '6px',
            'z-index': 10,
            'line-height': 1.2
          }
        },
        {
          selector: 'edge',
          style: {
            'line-color': '#666',
            'width': 3,
            'target-arrow-color': '#666',
            'target-arrow-shape': 'triangle-backcurve',
            'curve-style': 'unbundled-bezier'
          }
        },
        {
          selector: 'node:selected',
          style: {
            'background-blacken': -0.1,
            'overlay-opacity': 0.2
          }
        },
        {
          selector: 'edge:selected',
          style: {
            'overlay-color': '#888',
            'overlay-opacity': 0.2
          }
        }
      ],
      layout: {
        name: 'grid',
        rows: 1,
      },
      minZoom: 0.5,
      maxZoom: 2,
    });

    cyRef.current = cy;

    cy.on('tap', 'node', (event) => {
      const clickedNode = event.target;

      if (selectedNodeRef.current && selectedNodeRef.current.id() !== clickedNode.id()) {
        const sourceId = selectedNodeRef.current.id();
        const targetId = clickedNode.id();

        const existingEdge = cy.edges().some(edge => {
          const src = edge.data('source');
          const tgt = edge.data('target');
          return (src === sourceId && tgt === targetId);
        });

        if (!existingEdge) {
          cy.add({
            group: 'edges',
            data: { source: sourceId, target: targetId }
          });
        }

        selectedNodeRef.current.unselect();
        selectedNodeRef.current = null;
        setSelectedNode(null);
      } else {
        if (selectedNodeRef.current) selectedNodeRef.current.unselect();
        selectedNodeRef.current = clickedNode;
        clickedNode.select();
        setSelectedNode(clickedNode);

        const labelParts = clickedNode.data('label').split('\n');
        setLabelInput(labelParts[0] || '');
        setExtraText(labelParts[1]?.replace(/^[-–—•>→]*( )*/, '') || '');
        setNodeColor(clickedNode.style('background-color'));
      }
    });

    cy.on('tap', 'edge', (event) => {
      cy.elements().unselect();
      event.target.select();
      setSelectedNode(null);
    });

    const handleKeyDown = (e) => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        const selected = cy.$(':selected');
        if (selected.length > 0) {
          selected.remove();
          selectedNodeRef.current = null;
          setSelectedNode(null);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    const recognition = setupVoiceRecognition((keyword, fullTranscript) => {
      console.log(`🧠 Detected Keyword: ${keyword} from "${fullTranscript}"`);
      createNodeFromVoice(keyword);
    }, keywordDictionary);

    recognitionRef.current = recognition;

    return () => {
      cy.destroy();
      document.removeEventListener('keydown', handleKeyDown);
      if (recognition) recognition.stop();
    };
  }, []);

  const addNode = () => {
    const cy = cyRef.current;
    const id = generateUniqueNodeId();
    const label = `Node ${nodeCount}`;

    if (cy.getElementById(id).length > 0) return;

    cy.add({
      group: 'nodes',
      data: { id, label },
      position: {
        x: 100 + Math.random() * 500,
        y: 100 + Math.random() * 400,
      },
    });

    setNodeCount((n) => n + 1);
  };

  const updateNode = () => {
    if (selectedNode) {
      const main = labelInput.trim();
      const extra = extraText.trim();
      const newLabel = extra ? `${main}\n—— \n${extra}` : main;

      selectedNode.data('label', newLabel);
      selectedNode.style({
        'background-color': nodeColor,
        'text-outline-color': nodeColor,
      });
    }
  };

  return (
    <div style={{ padding: '1rem', backgroundColor: '#f0f0f0', minHeight: '100vh' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '10px' }}>
        <button
          onClick={addNode}
          style={{
            padding: '10px 24px',
            backgroundColor: '#6c757d',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
            boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
            transition: '0.2s ease'
          }}
        >
          ➕ Add Node
        </button>

        <button
          onClick={() => {
            if (isListening) {
              recognitionRef.current.stop();
              setIsListening(false);
            } else {
              recognitionRef.current.start();
              setIsListening(true);
            }
          }}
          style={{
            padding: '10px 24px',
            backgroundColor: isListening ? '#dc3545' : '#198754',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
            boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
            transition: '0.2s ease'
          }}
        >
          {isListening ? '🛑 Stop Listening' : '🎙️ Start Voice'}
        </button>

        {selectedNode && (
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <input
              type="text"
              value={labelInput}
              onChange={(e) => setLabelInput(e.target.value)}
              placeholder="Node title"
              style={{ padding: '6px', borderRadius: '6px' }}
            />
            <input
              type="text"
              value={extraText}
              onChange={(e) => setExtraText(e.target.value)}
              placeholder="Extra text"
              style={{ padding: '6px', borderRadius: '6px' }}
            />
            <input
              type="color"
              value={nodeColor}
              onChange={(e) => setNodeColor(e.target.value)}
            />
            <button
              onClick={updateNode}
              style={{
                padding: '6px 16px',
                backgroundColor: '#4e91ff',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
              }}
            >
              Apply
            </button>
          </div>
        )}
      </div>

      <div
        ref={containerRef}
        style={{
          width: '100%',
          height: '650px',
          border: '1px solid #ccc',
          borderRadius: '8px',
          background: '#e6e6e6'
        }}
      />
    </div>
  );
};

export default MindMap;
