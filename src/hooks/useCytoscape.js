import { useRef, useEffect, useCallback } from 'react';
import cytoscape from 'cytoscape';

const useCytoscape = ({ onNodeSelect, onNodeUnselect }) => {
  const containerRef = useRef(null);
  const cyRef = useRef(null);
  const selectedNodeRef = useRef(null);

  const handleNodeSelection = useCallback((node) => {
    if (selectedNodeRef.current) selectedNodeRef.current.unselect();
    selectedNodeRef.current = node;
    node.select();
    onNodeSelect(node);
  }, [onNodeSelect]);

  const handleNodeConnection = useCallback((targetNode) => {
    const cy = cyRef.current;
    const sourceId = selectedNodeRef.current.id();
    const targetId = targetNode.id();

    const existingEdge = cy.edges().some(edge => {
      const src = edge.data('source');
      const tgt = edge.data('target');
      return (src === sourceId && tgt === targetId) || (src === targetId && tgt === sourceId);
    });

    if (!existingEdge) {
      cy.add({ group: 'edges', data: { source: sourceId, target: targetId } });
    }

    selectedNodeRef.current.unselect();
    selectedNodeRef.current = null;
    onNodeUnselect();
  }, [onNodeUnselect]);

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
            'line-height': 1.2,
          },
        },
        {
          selector: 'edge',
          style: {
            'line-color': '#666',
            'width': 3,
            'target-arrow-color': '#666',
            'target-arrow-shape': 'triangle-backcurve',
            'curve-style': 'unbundled-bezier',
          },
        },
        {
          selector: 'node:selected',
          style: { 'background-blacken': -0.1, 'overlay-opacity': 0.2 },
        },
        {
          selector: 'edge:selected',
          style: { 'overlay-color': '#888', 'overlay-opacity': 0.2 },
        },
      ],
      layout: { name: 'grid', rows: 1 },
      minZoom: 0.5,
      maxZoom: 2,
    });

    cyRef.current = cy;

    cy.on('tap', 'node', (event) => {
      const clickedNode = event.target;
      if (selectedNodeRef.current && selectedNodeRef.current.id() !== clickedNode.id()) {
        handleNodeConnection(clickedNode);
      } else {
        handleNodeSelection(clickedNode);
      }
    });

    cy.on('tap', 'edge', (event) => {
      cy.elements().unselect();
      event.target.select();
      onNodeUnselect();
    });

    const handleKeyDown = (e) => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        const selected = cy.$(':selected');
        if (selected.length > 0) {
          selected.remove();
          selectedNodeRef.current = null;
          onNodeUnselect();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      cy.destroy();
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleNodeConnection, handleNodeSelection, onNodeUnselect]);

  const addNode = useCallback((id, label, position) => {
    const cy = cyRef.current;
    if (!cy || cy.getElementById(id).nonempty()) return;

    cy.add({
      group: 'nodes',
      data: { id, label },
      position: position || {
        x: Math.random() * 500,
        y: Math.random() * 400
      },
      style: {
        'background-color': '#5567aa',
        'text-outline-color': '#5567aa'
      }
    });
  }, []);

  const updateNode = useCallback((nodeId, label, color) => {
    const cy = cyRef.current;
    const node = cy.getElementById(nodeId);
    if (!node.length) return;

    node.data('label', label);
    node.style({
      'background-color': color,
      'text-outline-color': color,
    });
  }, []);

  return {
    containerRef,
    cyRef,
    selectedNodeRef,
    addNode,
    updateNode
  };
};

export default useCytoscape;