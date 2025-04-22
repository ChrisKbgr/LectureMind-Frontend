import React, { useRef, useEffect, useState, useCallback } from 'react';
import cytoscape from 'cytoscape';
import { setupVoiceRecognition } from './utils/voiceRecognition';
import KeywordInput from './components/KeywordInput';
import NodeEditor from './components/NodeEditor';
import DetectedPanel from './components/DetectedPanel';
import FullTranscriptPanel from './components/FullTranscriptPanel';
import styles from './styles/MindMap.module.css';
import { GoogleGenerativeAI } from "@google/generative-ai";

const MindMap = () => {
  const containerRef = useRef(null);
  const cyRef = useRef(null);
  const recognitionRef = useRef(null);
  const selectedNodeRef = useRef(null);

  const [nodeCount, setNodeCount] = useState(0);
  const [selectedNode, setSelectedNode] = useState(null);
  const [labelInput, setLabelInput] = useState('');
  const [extraText, setExtraText] = useState('');
  const [nodeColor, setNodeColor] = useState('#4e91ff');
  const [isListening, setIsListening] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  const [keywords, setKeywords] = useState([]);
  const [newKeyword, setNewKeyword] = useState('');

  const [detectedWords, setDetectedWords] = useState([]);
  const [fullTranscriptLog, setFullTranscriptLog] = useState([]);

  const addUniqueTranscript = (newText) => {
    setFullTranscriptLog((prev) => {
      const now = Date.now();
      const words = newText.split(/\s+/).filter(Boolean);
      const newEntries = words.map((word) => ({
        text: word,
        timestamp: now
      }));
      
      // Keep only recent entries
      const filtered = prev.filter(entry => now - entry.timestamp < 10000);
      return [...filtered, ...newEntries];
    });
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
            'width': '120px', // Fixed width instead of 'label'
            'height': '120px', // Fixed height instead of 'label'
            'text-wrap': 'wrap',
            'text-max-width': 100,
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
      layout: { name: 'grid', rows: 1 },
      minZoom: 0.5,
      maxZoom: 2,
    });

    cyRef.current = cy;

    cy.on('tap', (event) => {
      // If clicked outside nodes, deselect current node
      if (event.target === cy) {
        if (selectedNodeRef.current) {
          selectedNodeRef.current.unselect();
          selectedNodeRef.current = null;
          setSelectedNode(null);
        }
      }
    });

    cy.on('tap', 'node', (event) => {
      const clickedNode = event.target;

      if (selectedNodeRef.current && selectedNodeRef.current.id() !== clickedNode.id()) {
        const sourceId = selectedNodeRef.current.id();
        const targetId = clickedNode.id();

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
        setSelectedNode(null);
      } else {
        if (selectedNodeRef.current) selectedNodeRef.current.unselect();
        selectedNodeRef.current = clickedNode;
        clickedNode.select();
        setSelectedNode(clickedNode);

        const labelParts = clickedNode.data('label').split('\n');
        setLabelInput(labelParts[0] || '');
        setExtraText(labelParts[2] || '');
        setNodeColor(clickedNode.style('background-color'));
      }
    });

    cy.on('tap', 'edge', (event) => {
      cy.elements().unselect();
      event.target.select();
      setSelectedNode(null);
    });

    const handleKeyDown = (e) => {
      if (e.key === 'Delete') {
        const selected = cy.$(':selected');
        if (selected.length > 0) {
          selected.remove();
          selectedNodeRef.current = null;
          setSelectedNode(null);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      cy.destroy();
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const addNode = useCallback(() => {
    const cy = cyRef.current;
    const id = `node-${nodeCount}`;
    const label = `Node ${nodeCount}`;

    cy.add({
      group: 'nodes',
      data: { id, label },
      position: {
        x: 120 + (nodeCount * 50) % 600,
        y: 120 + (nodeCount * 40) % 400,
      },
    });

    setNodeCount((n) => n + 1);
  }, [nodeCount]);

  const updateNode = () => {
    if (selectedNode) {
      const main = labelInput.trim();
      const extra = extraText.trim();
      const newLabel = extra ? `${main}\n—— \n${extra}` : main;

      // Convert rgb to hex if needed
      const hexColor = nodeColor.startsWith('rgb') 
        ? rgbToHex(nodeColor)
        : nodeColor;

      selectedNode.data('label', newLabel);
      selectedNode.style({
        'background-color': hexColor,
        'text-outline-color': hexColor,
      });
    }
  };

  // Add this helper function
  const rgbToHex = (rgb) => {
    // Extract numbers from rgb string
    const [r, g, b] = rgb.match(/\d+/g).map(Number);
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  };

  const generateAIDescription = async (word) => {
    if (!word || isGeneratingAI) return;
    
    if (!process.env.REACT_APP_GEMINI_API_KEY) {
      console.error('Gemini API key not found');
      alert('Gemini API key not configured');
      return;
    }
    
    setIsGeneratingAI(true);
    console.log('Generating description for:', word);
    
    try {
      const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      const prompt = `Generate two short, informative sentences about: ${word}. Keep it concise and factual.`;
      
      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }]
      });

      const response = await result.response;
      const text = response.text();
      
      console.log('Gemini Response:', text);
      setExtraText(text);
      updateNode();
    } catch (error) {
      console.error('Error generating description:', error);
      alert('Failed to generate description: ' + error.message);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  useEffect(() => {
    const recognition = setupVoiceRecognition(
      (keyword, transcript) => {
        if (keyword && keywords.length > 0) { 
          const existingNodes = cyRef.current.$('node');
          const keywordExists = existingNodes.some(node => 
            node.data('label').toLowerCase() === keyword.toLowerCase()
          );

          if (!keywordExists) {
            const timestamp = Date.now();
            const random = Math.floor(Math.random() * 1000);
            const id = `node-${keyword.toLowerCase().replace(/\s+/g, '-')}-${timestamp}-${random}`;
            const label = keyword.charAt(0).toUpperCase() + keyword.slice(1);

            cyRef.current.add({
              group: 'nodes',
              data: { id, label },
              position: {
                x: 100 + Math.random() * 300,
                y: 100 + Math.random() * 300,
              },
              style: {
                'background-color': '#28a745',
                'text-outline-color': '#28a745'
              }
            });

            if (selectedNodeRef.current) {
              cyRef.current.add({
                group: 'edges',
                data: { source: selectedNodeRef.current.id(), target: id }
              });
            }

            setNodeCount(n => n + 1);
            setDetectedWords(prev => {
              if (!prev.includes(keyword)) {
                return [...prev.slice(-9), keyword];
              }
              return prev;
            });
          }
        }
      },
      (transcript) => {
        addUniqueTranscript(transcript);
      },
      keywords
    );

    recognitionRef.current = recognition;

    return () => recognition && recognition.stop();
  }, [keywords]);

  const nodeEditorProps = {
    labelInput,
    setLabelInput,
    extraText,
    setExtraText,
    nodeColor,
    setNodeColor,
    updateNode,
    generateAIDescription,
    isGeneratingAI  // Add this
  };

  return (
    <div className={styles.mindmapContainer}>
      <div className={styles.topSection}>
        <div className={styles.keywordsContainer}>
          <KeywordInput
            keywords={keywords}
            newKeyword={newKeyword}
            setNewKeyword={setNewKeyword}
            setKeywords={setKeywords}
          />
        </div>

        {/* Action buttons container */}
        <div className={styles.actionsContainer}>
          <button onClick={addNode} className={`${styles.btn} ${styles.btnAdd}`}>
            ➕ Add Node
          </button>
          <button
            onClick={() => {
              if (isListening) {
                recognitionRef.current?.stop();
                setIsListening(false);
              } else {
                recognitionRef.current?.start();
                setIsListening(true);
              }
            }}
            className={`${styles.btn} ${isListening ? styles.btnDanger : styles.btnSuccess}`}
          >
            {isListening ? '🛑 Stop Listening' : '🎙️ Start Voice'}
          </button>
        </div>

        {/* Panels container */}
        <div className={styles.panelsContainer}>
          <DetectedPanel detectedWords={detectedWords} />
          <FullTranscriptPanel fullTranscriptLog={fullTranscriptLog} />
        </div>
      </div>

      {/* Canvas */}
      <div className={styles.mindmapCanvas} ref={containerRef} />
      
      {/* Node editor */}
      {selectedNode && <NodeEditor {...nodeEditorProps} />}
    </div>
  );
};

export default MindMap;