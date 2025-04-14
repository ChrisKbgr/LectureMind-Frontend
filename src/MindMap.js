import React, { useRef, useEffect, useState } from 'react';
import cytoscape from 'cytoscape';

const MindMap = () => {
  const containerRef = useRef(null);
  const cyRef = useRef(null);
  const [nodeCount, setNodeCount] = useState(1);
  const selectedNodeRef = useRef(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [currentNodeColor, setCurrentNodeColor] = useState('#5567aa');

  const highlightColor = '#5ab1f5';

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
            'z-index': 10
          },
        },
        {
          selector: 'edge',
          style: {
            'width': 2,
            'line-color': '#aaa',
            'target-arrow-color': '#aaa',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier'
          },
        },
        {
          selector: 'node:selected',
          style: {
            'border-color': highlightColor,
            'border-width': 4,
            'border-opacity': 0.8,
            'shadow-blur': 12,
            'shadow-color': highlightColor,
            'shadow-opacity': 0.8,
            'shadow-offset-x': 0,
            'shadow-offset-y': 0
          }
        },
        {
          selector: 'edge:selected',
          style: {
            'line-color': highlightColor,
            'width': 4,
            'target-arrow-color': highlightColor,
            'z-index': 5,
            'shadow-blur': 5,
            'shadow-color': highlightColor,
            'shadow-opacity': 0.5,
          }
        }
      ],
      layout: {
        name: 'grid',
        rows: 1,
      },
      minZoom: 0.5,
      maxZoom: 2,
      zoomingEnabled: true,
    });

    cyRef.current = cy;

    cy.on('tap', 'node', (event) => {
      const clickedNode = event.target;

      if (selectedNodeRef.current && selectedNodeRef.current.id() !== clickedNode.id()) {
        cy.add({
          group: 'edges',
          data: {
            source: selectedNodeRef.current.id(),
            target: clickedNode.id()
          }
        });
        selectedNodeRef.current.unselect();
        setShowColorPicker(false);
        selectedNodeRef.current = null;
      } else {
        if (selectedNodeRef.current) selectedNodeRef.current.unselect();
        selectedNodeRef.current = clickedNode;
        clickedNode.select();

        setCurrentNodeColor(clickedNode.style('background-color'));
        setShowColorPicker(true);
      }
    });

    cy.on('tap', 'node', (evt) => {
      const now = Date.now();
      const node = evt.target;

      if (node.lastTap && now - node.lastTap < 300) {
        const label = prompt('New label:', node.data('label') || '');
        const text = prompt('Add extra text (optional):', '');
        if (label) node.data('label', label + (text ? '\n' + text : ''));
      }

      node.lastTap = now;
    });

    cy.on('tap', 'edge', (event) => {
      cy.elements().unselect();
      event.target.select();
      setShowColorPicker(false);
    });

    cy.on('tap', (event) => {
      if (event.target === cy) {
        setShowColorPicker(false);
        if (selectedNodeRef.current) {
          selectedNodeRef.current.unselect();
          selectedNodeRef.current = null;
        }
      }
    });

    const handleKeyDown = (e) => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        const selected = cy.$(':selected');
        if (selected.length > 0) {
          selected.remove();
          selectedNodeRef.current = null;
          setShowColorPicker(false);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      cy.destroy();
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const addNode = () => {
    const cy = cyRef.current;
    const id = `node-${nodeCount}`;
    const label = `Node ${nodeCount}`;
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

  const handleColorChange = (e) => {
    const newColor = e.target.value;
    setCurrentNodeColor(newColor);
    if (selectedNodeRef.current) {
      selectedNodeRef.current.style('background-color', newColor);
      selectedNodeRef.current.style('text-outline-color', newColor);
    }
  };

  return (
    <div style={{ padding: '1rem', position: 'relative' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
        <button
          onClick={addNode}
          style={{
            padding: '10px 20px',
            backgroundColor: '#8899cc',
            color: '#fff',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            fontSize: '15px',
            boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = '#6b7bbd')}
          onMouseLeave={(e) => (e.target.style.backgroundColor = '#8899cc')}
        >
          ➕ Add Node
        </button>

        {showColorPicker && (
          <input
            type="color"
            value={currentNodeColor}
            onChange={handleColorChange}
            style={{
              width: '36px',
              height: '36px',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
            }}
          />
        )}
      </div>

      <div
        ref={containerRef}
        style={{
          width: '100%',
          height: '650px',
          border: '1px solid #ccc',
          borderRadius: '8px',
          background: '#e6ebf2',
        }}
      />
    </div>
  );
};

export default MindMap;
