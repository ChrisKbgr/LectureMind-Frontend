import React, { useRef, useEffect, useState, useCallback } from 'react';
import cytoscape from 'cytoscape';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import KeywordInput from './components/KeywordInput';
import NodeEditor from './components/NodeEditor';
import DetectedPanel from './components/DetectedPanel';
import FullTranscriptPanel from './components/FullTranscriptPanel';
import ArtistNode from './components/ArtistNode';
import styles from './styles/MindMap.module.css';
import { GoogleGenerativeAI } from "@google/generative-ai";
import Timeline from './components/Timeline';
// Material UI imports
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import BrushIcon from '@mui/icons-material/Brush';
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

const MindMap = () => {
  const containerRef = useRef(null);
  const cyRef = useRef(null);
  // Removed recognitionRef, handled by react-speech-recognition
  const selectedNodeRef = useRef(null);
  const pendingNodesRef = useRef(new Set());

  const [nodeCount, setNodeCount] = useState(0);
  const [selectedNode, setSelectedNode] = useState(null);
  const [labelInput, setLabelInput] = useState('');
  const [extraText, setExtraText] = useState('');
  const [nodeColor, setNodeColor] = useState('#4e91ff');
  // Remove isListening, use listening from useSpeechRecognition
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  const [keywords, setKeywords] = useState([]);
  const [newKeyword, setNewKeyword] = useState('');

  const [detectedWords, setDetectedWords] = useState([]);
  const [fullTranscriptLog, setFullTranscriptLog] = useState([]);
  const [artists, setArtists] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState('');

  // Art history periods with their artists - moved to top
  const artPeriods = {
    renaissance: {
      name: 'Renaissance',
      artists: [
        { name: 'Leonardo da Vinci', birth: 1452, death: 1519, period: 'Renaissance', keyword: 'leonardo' },
        { name: 'Michelangelo', birth: 1475, death: 1564, period: 'Renaissance', keyword: 'michelangelo' },
        { name: 'Raphael', birth: 1483, death: 1520, period: 'Renaissance', keyword: 'raphael' },
        { name: 'Donatello', birth: 1386, death: 1466, period: 'Early Renaissance', keyword: 'donatello' },
        { name: 'Botticelli', birth: 1445, death: 1510, period: 'Renaissance', keyword: 'botticelli' },
        { name: 'Titian', birth: 1488, death: 1576, period: 'Renaissance', keyword: 'titian' },
        { name: 'Caravaggio', birth: 1571, death: 1610, period: 'Baroque', keyword: 'caravaggio' }
      ]
    },
    baroque: {
      name: 'Baroque',
      artists: [
        { name: 'Rembrandt', birth: 1606, death: 1669, period: 'Baroque', keyword: 'rembrandt' },
        { name: 'Vermeer', birth: 1632, death: 1675, period: 'Baroque', keyword: 'vermeer' },
        { name: 'Rubens', birth: 1577, death: 1640, period: 'Baroque', keyword: 'rubens' },
        { name: 'Velázquez', birth: 1599, death: 1660, period: 'Baroque', keyword: 'velazquez' },
        { name: 'Bernini', birth: 1598, death: 1680, period: 'Baroque', keyword: 'bernini' }
      ]
    },
    impressionism: {
      name: 'Impressionism',
      artists: [
        { name: 'Monet', birth: 1840, death: 1926, period: 'Impressionism', keyword: 'monet' },
        { name: 'Renoir', birth: 1841, death: 1919, period: 'Impressionism', keyword: 'renoir' },
        { name: 'Degas', birth: 1834, death: 1917, period: 'Impressionism', keyword: 'degas' },
        { name: 'Manet', birth: 1832, death: 1883, period: 'Impressionism', keyword: 'manet' },
        { name: 'Pissarro', birth: 1830, death: 1903, period: 'Impressionism', keyword: 'pissarro' }
      ]
    },
    modern: {
      name: 'Modern Art',
      artists: [
        { name: 'Picasso', birth: 1881, death: 1973, period: 'Modern', keyword: 'picasso' },
        { name: 'Van Gogh', birth: 1853, death: 1890, period: 'Post-Impressionism', keyword: 'vangogh' },
        { name: 'Matisse', birth: 1869, death: 1954, period: 'Modern', keyword: 'matisse' },
        { name: 'Dali', birth: 1904, death: 1989, period: 'Surrealism', keyword: 'dali' },
        { name: 'Warhol', birth: 1928, death: 1987, period: 'Pop Art', keyword: 'warhol' }
      ]
    }
  };

  const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);

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
            'shape': 'round-rectangle',
            'background-color': '#ff6b35',
            'label': 'data(label)',
            'color': '#fff',
            'text-outline-width': 2,
            'text-outline-color': '#ff6b35',
            'font-size': 16,
            'width': '200px',
            'height': '80px',
            'padding': '20px',
            'text-valign': 'center',
            'text-halign': 'center',
            'text-wrap': 'wrap',
            'text-max-width': 160,
            'overlay-padding': '6px',
            'text-margin-y': 0,
            'line-height': 1.4
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
      layout: { name: 'preset' },
      minZoom: 0.5,
      maxZoom: 2,
    });

    cyRef.current = cy;

    // Debug: Log the containerRef after mount
    console.log('Cytoscape containerRef.current:', containerRef.current);
    console.log('Container dimensions:', {
      offsetWidth: containerRef.current?.offsetWidth,
      offsetHeight: containerRef.current?.offsetHeight,
      clientWidth: containerRef.current?.clientWidth,
      clientHeight: containerRef.current?.clientHeight,
      getBoundingClientRect: containerRef.current?.getBoundingClientRect()
    });

    // Set initial viewport
    cy.fit();
    cy.center();
    console.log('Set initial viewport');

  // Removed style bypass handler to avoid conflicting style parse issues;
  // artist nodes get styles set when created via createArtistNode

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

        // Handle artist nodes differently
        const artistData = clickedNode.data('artistData');
        if (artistData) {
          // For artist nodes, show the artist data in the editor
          setLabelInput(artistData.name);
          setExtraText(clickedNode.data('additionalInfo') || '');
          setNodeColor('#4CAF50'); // Artist node color
        } else {
          // For regular nodes, use the existing logic
          const labelParts = clickedNode.data('label').split('\n');
          setLabelInput(labelParts[0] || '');
          setExtraText(labelParts[2] || '');
          setNodeColor(clickedNode.style('background-color'));
        }
      }
    });

    cy.on('tap', 'edge', (event) => {
      cy.elements().unselect();
      event.target.select();
      setSelectedNode(null);
    });

    // Handle node deletion to update detected words
    cy.on('remove', 'node', (event) => {
      const removedNode = event.target;
      const nodeLabel = removedNode.data('label');
      const nodeId = removedNode.id();
      const artistData = removedNode.data('artistData');
      
      // Remove the keyword from detected words
      setDetectedWords(prev => {
        let keywordToRemove = null;
        
        // For artist nodes, find the keyword from the artist database
        if (artistData) {
          const artistKeyword = Object.keys(artistDatabase).find(key => 
            artistDatabase[key].name === artistData.name
          );
          if (artistKeyword) {
            keywordToRemove = prev.find(word => word === artistKeyword);
          }
        } else {
          // For regular nodes, try to match by label or ID
          keywordToRemove = prev.find(word => 
            nodeLabel.toLowerCase().includes(word.toLowerCase()) ||
            nodeId.toLowerCase().includes(word.toLowerCase())
          );
        }
        
        if (keywordToRemove) {
          return prev.filter(word => word !== keywordToRemove);
        }
        return prev;
      });
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

  // Enhanced node creation with artist information
  const createArtistNode = async (artist, position) => {
    const nodeId = artist.keyword;
    // Prevent creating the same artist node twice (handle races)
    if (cyRef.current.$id(nodeId).length > 0) {
      return cyRef.current.$id(nodeId)[0];
    }
    if (pendingNodesRef.current.has(nodeId)) {
      // another creation is in progress; wait for it to finish (timeout after 2s)
      const start = Date.now();
      while (Date.now() - start < 2000) {
        const existing = cyRef.current.$id(nodeId);
        if (existing.length > 0) return existing[0];
        // small sleep
        await new Promise(r => setTimeout(r, 50));
      }
      // timed out — continue and attempt to create, but this is unlikely
    }
    pendingNodesRef.current.add(nodeId);
    
    // Get artist data from database
    const artistData = artistDatabase[artist.keyword] || {
      name: artist.name,
      birth: artist.birth,
      death: artist.death,
      period: artist.period,
      portrait: '',
      bio: '',
      famousWorks: [],
      worksImages: []
    };
    
    // Generate AI description for the artist
    let aiDescription = '';
    try {
      const prompt = `Write a brief, engaging description (2-3 sentences) about ${artistData.name}, a ${artistData.period} artist. Focus on their artistic style, most famous works like ${artistData.famousWorks.slice(0, 2).join(' and ')}, and their impact on art history. Make it educational and inspiring for art students. Keep it concise and factual.`;
      const result = await genAI.getGenerativeModel({ model: "gemini-pro" }).generateContent(prompt);
      aiDescription = result.response.text();
    } catch (error) {
      console.error('Error generating AI description:', error);
      aiDescription = artistData.bio;
    }

    // Create a descriptive label for the node
    const nodeLabel = `${artistData.name}\n${artistData.period}\n${artistData.birth}-${artistData.death}`;

    // Create the node with simplified styling (custom renderer will handle the visual)
    let nodeStyle = {
      'background-color': '#4CAF50',
      'border-color': '#2E7D32',
      'border-width': '3px',
      'color': 'white',
      'font-size': '14px',
      'font-weight': 'bold',
      'text-valign': 'bottom',
      'text-halign': 'center',
      'width': '320px',
      'height': '240px',
      'shape': 'round-rectangle',
      'text-wrap': 'wrap',
      'text-max-width': '290px'
    };

  // Do not set background-image here to avoid blocking Cytoscape parsing.
  // We'll lazy-load the portrait after the node is created.

    // sanitize style: remove null/undefined and non-primitive values
    const sanitizedNodeStyle = {};
    Object.keys(nodeStyle).forEach((k) => {
      const v = nodeStyle[k];
      if (v !== null && v !== undefined && (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean')) {
        sanitizedNodeStyle[k] = v;
      }
    });
    nodeStyle = sanitizedNodeStyle;

    let node = null;
    try {
      node = cyRef.current.add({
        group: 'nodes',
        data: {
          id: nodeId,
          label: nodeLabel,
          artistData: artistData,
          additionalInfo: artistData.additionalInfo || '',
          portrait: artistData.portrait || '',
          worksImages: artistData.worksImages || [],
          aiDescription: aiDescription
        },
        position: position,
        style: nodeStyle
      });
      // Lazy-load portrait image to improve initial render performance
      if (artistData.portrait) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = artistData.portrait;
        img.onload = () => {
          try {
            node.style({ 'background-image': `url(${artistData.portrait})`, 'background-fit': 'cover' });
          } catch (e) {
            console.warn('Failed to apply portrait style for', nodeId, e);
          }
        };
        img.onerror = () => console.warn('Portrait failed to load for', nodeId, artistData.portrait);
      }
    } catch (err) {
      console.error('Failed to create artist node. artistData:', artistData, 'nodeStyle:', nodeStyle, err);
      // If duplicate ID error occurred, return existing node
      if (err && err.message && err.message.includes('Can not create second element')) {
        const existing = cyRef.current.$id(nodeId);
        if (existing.length > 0) {
          pendingNodesRef.current.delete(nodeId);
          return existing[0];
        }
      }
      // Fallback: try adding the node without style to avoid Cytoscape parse errors
      try {
        node = cyRef.current.add({ group: 'nodes', data: { id: nodeId, label: nodeLabel, artistData }, position });
      } catch (err2) {
        console.error('Fallback add also failed for', nodeId, err2);
        pendingNodesRef.current.delete(nodeId);
        throw err2;
      }
    } finally {
      // ensure pending flag removed if node created or failed
      pendingNodesRef.current.delete(nodeId);
    }

    // Add small thumbnail nodes for the artist's famous works (up to 3)
    if (artistData.worksImages && artistData.worksImages.length > 0) {
      const thumbGap = 60;
      const startX = position.x - thumbGap;
      const startY = position.y + 120; // below the main node

    artistData.worksImages.slice(0, 3).forEach((imgUrl, i) => {
        try {
          const thumbId = `${nodeId}-thumb-${i}`;
      // skip thumbnail if already exists
      if (cyRef.current.$id(thumbId).length > 0) return;
          const thumbStyleRaw = {
            'width': '60px',
            'height': '44px',
            'shape': 'round-rectangle',
            'background-fit': 'cover',
            'border-width': '1px',
            'border-color': '#ffffff33',
            'font-size': '10px',
            'text-valign': 'bottom',
            'text-halign': 'center',
            'text-wrap': 'wrap',
            'text-max-width': '60px'
          };
          const thumbStyle = {};
          Object.keys(thumbStyleRaw).forEach((k) => {
            const v = thumbStyleRaw[k];
            if (v !== null && v !== undefined && (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean')) {
              thumbStyle[k] = v;
            }
          });

          const thumbLabel = (artistData.famousWorks && artistData.famousWorks[i]) ? artistData.famousWorks[i] : '';
          const thumb = cyRef.current.add({
            group: 'nodes',
            data: { id: thumbId, label: thumbLabel, parent: null },
            position: { x: startX + i * thumbGap, y: startY },
            selectable: false,
            style: thumbStyle
          });

          // Lazy-load thumbnail image
          if (imgUrl) {
            const timg = new Image();
            timg.crossOrigin = 'anonymous';
            timg.src = imgUrl;
            timg.onload = () => {
              try {
                thumb.style({ 'background-image': `url(${imgUrl})` });
              } catch (e) {
                console.warn('Failed to apply thumbnail image for', thumbId, e);
              }
            };
            timg.onerror = () => console.warn('Thumbnail failed to load for', thumbId, imgUrl);
          }

          // connect thumbnail to the main node (avoid duplicate edges)
          const edgeId = `${nodeId}-edge-${i}`;
          if (cyRef.current.$id(edgeId).length === 0) {
            cyRef.current.add({ group: 'edges', data: { id: edgeId, source: node.id(), target: thumb.id() } });
          }
        } catch (err) {
          console.warn('Failed to add thumbnail for', nodeId, err);
        }
      });
    }

    return node;
  };

  // Update the addNode function to handle artist nodes
  const addNode = async () => {
    const nodeId = `node-${nodeCount + 1}`;
    const position = {
      x: Math.random() * 400 + 200,
      y: Math.random() * 400 + 200
    };

    // Check if this is an artist keyword
    const artistInfo = Object.values(artPeriods).flatMap(period => period.artists)
      .find(artist => artist.keyword === nodeId || artist.name.toLowerCase().includes(nodeId.toLowerCase()));

    if (artistInfo) {
      // Create enhanced artist node
      await createArtistNode(artistInfo, position);
      
      // Add to detected words
      setDetectedWords(prev => {
        const keyword = artistInfo.keyword;
        if (!prev.includes(keyword)) {
          return [...prev.slice(-9), keyword];
        }
        return prev;
      });
    } else {
      // Create regular node
      cyRef.current.add({
        group: 'nodes',
        data: {
          id: nodeId,
          label: `Node ${nodeCount + 1}`
        },
        position: position,
        style: {
          'background-color': '#ff6b35',
          'border-color': '#e55a2b',
          'border-width': 2,
          'color': 'white',
          'font-size': 16,
          'width': '200px',
          'height': '80px',
          'padding': '20px',
          'text-valign': 'center',
          'text-halign': 'center',
          'text-wrap': 'wrap',
          'text-max-width': 160,
          'shape': 'round-rectangle'
        }
      });
    }

    setNodeCount(nodeCount + 1);
  };

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
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      const prompt = `Generate two short, informative sentences about: ${word}. Keep it concise and factual. Only two sentences and nothing more.`;
      
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

  // Artist data for enhanced nodes
  const artistDatabase = {
    'leonardo': {
      name: 'Leonardo da Vinci',
      birth: 1452,
      death: 1519,
      period: 'Renaissance',
      portrait: 'https://upload.wikimedia.org/wikipedia/commons/3/38/Leonardo_da_Vinci_-_presumed_self-portrait_-_WGA12798.jpg',
      bio: 'Italian polymath of the Renaissance. Known for the Mona Lisa and The Last Supper.',
      famousWorks: ['Mona Lisa', 'The Last Supper', 'Vitruvian Man'],
      worksImages: [
        'https://upload.wikimedia.org/wikipedia/commons/e/ec/Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/0/08/Leonardo_da_Vinci_%281452-1519%29_-_The_Last_Supper_%281495-1498%29.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/2/22/Da_Vinci_Vitruve_Luc_Viatour.jpg'
      ]
    },
    'michelangelo': {
      name: 'Michelangelo',
      birth: 1475,
      death: 1564,
      period: 'Renaissance',
      portrait: 'https://upload.wikimedia.org/wikipedia/commons/5/5b/Michelangelo_-_Daniele_da_Volterra_-_Daniele_da_Volterra_001.jpg',
      bio: 'Italian sculptor, painter, architect, and poet. Created the Sistine Chapel ceiling.',
      famousWorks: ['David', 'Sistine Chapel', 'Pieta'],
      worksImages: [
        'https://upload.wikimedia.org/wikipedia/commons/1/1f/Michelangelo_-_David_-_Galleria_dell%27Accademia%2C_Florence.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/5/59/Michelangelo_-_Creation_of_Adam_%28cropped%29.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/8/8c/Michelangelo%27s_Pieta_5450_cut_out_black.jpg'
      ]
    },
    'raphael': {
      name: 'Raphael',
      birth: 1483,
      death: 1520,
      period: 'Renaissance',
      portrait: 'https://upload.wikimedia.org/wikipedia/commons/0/0f/1665_Giovanni_Battista_Gaulli_%28Baciccio%29_-_Portrait_of_a_Man_%28Self-portrait%29.jpg',
      bio: 'Italian painter and architect. Known for his clarity of form and ease of composition.',
      famousWorks: ['The School of Athens', 'Sistine Madonna', 'Transfiguration'],
      worksImages: [
        'https://upload.wikimedia.org/wikipedia/commons/7/72/Raffaello_Sanzio_da_Urbino_-_The_School_of_Athens_-_Google_Art_Project.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/7/7a/Raphael_-_Sistine_Madonna_-_Google_Art_Project.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/4/4f/Raffaello_Sanzio_da_Urbino_-_The_Transfiguration_-_Google_Art_Project.jpg'
      ]
    },
    'donatello': {
      name: 'Donatello',
      birth: 1386,
      death: 1466,
      period: 'Early Renaissance',
      portrait: 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Donatello_-_David_-_Google_Art_Project.jpg',
      bio: 'Italian sculptor of the Renaissance. Pioneer of perspective in sculpture.',
      famousWorks: ['David', 'Gattamelata', 'St. George'],
      worksImages: [
        'https://upload.wikimedia.org/wikipedia/commons/8/8a/Donatello_-_David_-_Google_Art_Project.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/7/7c/Donatello_-_Equestrian_Statue_of_Gattamelata_-_Padua.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/8/8c/Donatello_-_St_George_-_Orsanmichele_-_Florence.jpg'
      ]
    },
    'botticelli': {
      name: 'Sandro Botticelli',
      birth: 1445,
      death: 1510,
      period: 'Renaissance',
      portrait: 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Sandro_Botticelli_-_Portrait_of_a_Man_with_a_Medal_of_Cosimo_the_Elder_-_WGA02876.jpg',
      bio: 'Italian painter of the Early Renaissance. Known for mythological and religious subjects.',
      famousWorks: ['The Birth of Venus', 'Primavera', 'Adoration of the Magi'],
      worksImages: [
        'https://upload.wikimedia.org/wikipedia/commons/0/0b/Sandro_Botticelli_-_La_nascita_di_Venere_-_Google_Art_Project.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/0/0b/Sandro_Botticelli_-_Primavera_-_Google_Art_Project.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/8/8a/Sandro_Botticelli_-_Adoration_of_the_Magi_-_Google_Art_Project.jpg'
      ]
    },
    'titian': {
      name: 'Titian',
      birth: 1488,
      death: 1576,
      period: 'Renaissance',
      portrait: 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Titian_-_Self-portrait_-_WGA22891.jpg',
      bio: 'Italian painter of the Venetian school. Master of color and composition.',
      famousWorks: ['Venus of Urbino', 'Assumption of the Virgin', 'Bacchus and Ariadne'],
      worksImages: [
        'https://upload.wikimedia.org/wikipedia/commons/8/8a/Titian_-_Venus_of_Urbino_-_Google_Art_Project.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/8/8a/Titian_-_Assumption_of_the_Virgin_-_Google_Art_Project.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/8/8a/Titian_-_Bacchus_and_Ariadne_-_Google_Art_Project.jpg'
      ]
    },
    'caravaggio': {
      name: 'Caravaggio',
      birth: 1571,
      death: 1610,
      period: 'Baroque',
      portrait: 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Caravaggio_-_Self-portrait_as_Bacchus_-_Google_Art_Project.jpg',
      bio: 'Italian painter known for dramatic use of light and shadow (chiaroscuro).',
      famousWorks: ['The Calling of St Matthew', 'Judith Beheading Holofernes', 'The Supper at Emmaus'],
      worksImages: [
        'https://upload.wikimedia.org/wikipedia/commons/8/8a/Caravaggio_-_The_Calling_of_Saint_Matthew_-_Google_Art_Project.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/8/8a/Caravaggio_-_Judith_Beheading_Holofernes_-_Google_Art_Project.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/8/8a/Caravaggio_-_Supper_at_Emmaus_-_Google_Art_Project.jpg'
      ]
    },
    'rembrandt': {
      name: 'Rembrandt',
      birth: 1606,
      death: 1669,
      period: 'Baroque',
      portrait: 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Rembrandt_van_Rijn_-_Self-Portrait_-_Google_Art_Project.jpg',
      bio: 'Dutch painter and etcher. Master of light and shadow in portraiture.',
      famousWorks: ['The Night Watch', 'Self-Portrait', 'The Jewish Bride'],
      worksImages: [
        'https://upload.wikimedia.org/wikipedia/commons/8/8a/Rembrandt_van_Rijn_-_The_Night_Watch_-_Google_Art_Project.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/8/8a/Rembrandt_van_Rijn_-_Self-Portrait_-_Google_Art_Project.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/8/8a/Rembrandt_van_Rijn_-_The_Jewish_Bride_-_Google_Art_Project.jpg'
      ]
    },
    'vermeer': {
      name: 'Johannes Vermeer',
      birth: 1632,
      death: 1675,
      period: 'Baroque',
      portrait: 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Johannes_Vermeer_-_The_Art_of_Painting_-_Google_Art_Project.jpg',
      bio: 'Dutch painter known for domestic interior scenes and masterful use of light.',
      famousWorks: ['Girl with a Pearl Earring', 'The Milkmaid', 'View of Delft'],
      worksImages: [
        'https://upload.wikimedia.org/wikipedia/commons/8/8a/Johannes_Vermeer_-_Girl_with_a_Pearl_Earring_-_Google_Art_Project.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/8/8a/Johannes_Vermeer_-_The_Milkmaid_-_Google_Art_Project.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/8/8a/Johannes_Vermeer_-_View_of_Delft_-_Google_Art_Project.jpg'
      ]
    },
    'monet': {
      name: 'Claude Monet',
      birth: 1840,
      death: 1926,
      period: 'Impressionism',
      portrait: 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Claude_Monet_-_Self-Portrait_-_Google_Art_Project.jpg',
      bio: 'French painter and founder of Impressionism. Master of capturing light and atmosphere.',
      famousWorks: ['Water Lilies', 'Impression, Sunrise', 'Haystacks'],
      worksImages: [
        'https://upload.wikimedia.org/wikipedia/commons/8/8a/Claude_Monet_-_Water_Lilies_-_Google_Art_Project.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/8/8a/Claude_Monet_-_Impression%2C_Sunrise_-_Google_Art_Project.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/8/8a/Claude_Monet_-_Haystacks_-_Google_Art_Project.jpg'
      ]
    },
    'vangogh': {
      name: 'Vincent van Gogh',
      birth: 1853,
      death: 1890,
      period: 'Post-Impressionism',
      portrait: 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Vincent_van_Gogh_-_Self-Portrait_-_Google_Art_Project.jpg',
      bio: 'Dutch post-impressionist painter. Known for bold colors and expressive brushwork.',
      famousWorks: ['Starry Night', 'Sunflowers', 'The Bedroom'],
      worksImages: [
        'https://upload.wikimedia.org/wikipedia/commons/8/8a/Vincent_van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/8/8a/Vincent_van_Gogh_-_Sunflowers_-_Google_Art_Project.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/8/8a/Vincent_van_Gogh_-_The_Bedroom_-_Google_Art_Project.jpg'
      ]
    },
    'picasso': {
      name: 'Pablo Picasso',
      birth: 1881,
      death: 1973,
      period: 'Modern',
      portrait: 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Pablo_Picasso_-_Self-Portrait_-_Google_Art_Project.jpg',
      bio: 'Spanish painter, sculptor, and co-founder of Cubism. Revolutionary modern artist.',
      famousWorks: ['Guernica', 'Les Demoiselles d\'Avignon', 'The Old Guitarist'],
      worksImages: [
        'https://upload.wikimedia.org/wikipedia/commons/8/8a/Pablo_Picasso_-_Guernica_-_Google_Art_Project.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/8/8a/Pablo_Picasso_-_Les_Demoiselles_d%27Avignon_-_Google_Art_Project.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/8/8a/Pablo_Picasso_-_The_Old_Guitarist_-_Google_Art_Project.jpg'
      ]
    }
  };

  // --- New voice recognition using react-speech-recognition ---
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      alert('Your browser does not support speech recognition.');
      return;
    }
    if (listening && transcript) {
      // When transcript updates, check for keywords
      const lowerTranscript = transcript.toLowerCase();
      keywords.forEach(async (keyword) => {
        if (lowerTranscript.includes(keyword.toLowerCase())) {
          // Simulate keyword detection logic
          const artistInfo = Object.values(artPeriods).flatMap(period => period.artists)
            .find(artist => artist.keyword === keyword.toLowerCase() || 
                           artist.name.toLowerCase().includes(keyword.toLowerCase()));
          if (artistInfo) {
            const cy = cyRef.current;
            if (!cy) return;
            const existingNodes = cy.$('node');
            const keywordExists = existingNodes.some(node => {
              const nodeLabel = node.data('label').toLowerCase();
              const nodeId = node.id().toLowerCase();
              return nodeLabel.includes(keyword.toLowerCase()) || 
                     nodeId.includes(keyword.toLowerCase()) ||
                     (artistInfo && nodeId === artistInfo.keyword);
            });
            if (!keywordExists) {
              const position = {
                x: 100 + Math.random() * 300,
                y: 100 + Math.random() * 300,
              };
              let createdNodeId = null;
              // Create enhanced artist node
              const node = await createArtistNode(artistInfo, position);
              createdNodeId = node.id();
              if (selectedNodeRef.current && createdNodeId) {
                cy.add({
                  group: 'edges',
                  data: { source: selectedNodeRef.current.id(), target: createdNodeId }
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
        }
      });
  addUniqueTranscript(transcript);
    }
  }, [transcript, listening, keywords]);

  const nodeEditorProps = {
    labelInput,
    setLabelInput,
    extraText,
    setExtraText,
    nodeColor,
    setNodeColor,
    updateNode,
    generateAIDescription,
    isGeneratingAI,
    selectedNode,
    onClose: () => {
      if (selectedNodeRef.current) {
        selectedNodeRef.current.unselect();
        selectedNodeRef.current = null;
      }
      setSelectedNode(null);
    }
  };

  const addKeyword = () => {
    if (newKeyword.trim() && !keywords.includes(newKeyword.trim())) {
      setKeywords([...keywords, newKeyword.trim()]);
      setNewKeyword('');
    }
  };

  const removeKeyword = (index) => {
    setKeywords(keywords.filter((_, i) => i !== index));
  };

  // Helper: simulate detection when a keyword chip is clicked
  const handleKeywordClick = async (keyword) => {
    if (!keyword) return;
    const lower = keyword.toLowerCase();
    const artistInfo = Object.values(artPeriods).flatMap(period => period.artists)
      .find(artist => artist.keyword === lower || artist.name.toLowerCase().includes(lower));

    const cy = cyRef.current;
    if (!cy) return;

    const existingNodes = cy.$('node');
    const keywordExists = existingNodes.some(node => {
      const nodeLabel = (node.data('label') || '').toLowerCase();
      const nodeId = (node.id() || '').toLowerCase();
      return nodeLabel.includes(lower) || nodeId.includes(lower) || (artistInfo && nodeId === artistInfo.keyword);
    });

    if (!keywordExists) {
      const position = { x: 100 + Math.random() * 300, y: 100 + Math.random() * 300 };
      try {
        if (artistInfo) {
          const node = await createArtistNode(artistInfo, position);
          if (selectedNodeRef.current && node && node.id) {
            cy.add({ group: 'edges', data: { source: selectedNodeRef.current.id(), target: node.id() } });
          }
        } else {
          const nodeId = `node-sim-${Date.now()}`;
          cy.add({ group: 'nodes', data: { id: nodeId, label: keyword }, position });
        }

        setNodeCount(n => n + 1);
        setDetectedWords(prev => {
          if (!prev.includes(keyword)) return [...prev.slice(-9), keyword];
          return prev;
        });
      } catch (err) {
        console.error('handleKeywordClick failed for', keyword, err);
      }
    } else {
      // If node already exists, still add to detected list to make it visible
      setDetectedWords(prev => {
        if (!prev.includes(keyword)) return [...prev.slice(-9), keyword];
        return prev;
      });
    }
  };

  // Handle period selection
  const handlePeriodChange = (event, newPeriod) => {
    setSelectedPeriod(newPeriod);
    
    if (newPeriod !== null) {
      // Get artists for the selected period
      const periodArtists = artPeriods[newPeriod]?.artists || [];
      
      // Update timeline
      setArtists(periodArtists);
      
      // Update keywords - add period keywords to existing ones
      const periodKeywords = periodArtists.map(artist => artist.keyword);
      setKeywords(prevKeywords => {
        // Remove any existing period keywords first
        const filtered = prevKeywords.filter(keyword => 
          !Object.values(artPeriods).some(period => 
            period.artists.some(artist => artist.keyword === keyword)
          )
        );
        return [...filtered, ...periodKeywords];
      });
      
      console.log(`Selected period: ${artPeriods[newPeriod]?.name} with ${periodArtists.length} artists`);
    } else {
      // Period unselected - remove period artists from timeline and keywords
      setArtists([]);
      setKeywords(prevKeywords => 
        prevKeywords.filter(keyword => 
          !Object.values(artPeriods).some(period => 
            period.artists.some(artist => artist.keyword === keyword)
          )
        )
      );
      console.log('Period unselected');
    }
  };

  const toggleListening = () => {
    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      SpeechRecognition.startListening({ continuous: true, language: 'en-US' });
    }
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Bar */}
      <AppBar position="static" elevation={1}>
        <Toolbar sx={{ minHeight: 48 }}>
          <BrushIcon sx={{ mr: 1, fontSize: 20 }} />
          <Typography variant="h6" sx={{ fontSize: '1.1rem' }}>
            LectureMind
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          {listening && (
            <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
              <MicIcon color="error" sx={{ mr: 0.5, fontSize: 18 }} />
              <Typography variant="body2" sx={{ color: 'error.main', fontWeight: 'bold', fontSize: '0.9rem' }}>
                Listening...
              </Typography>
            </Box>
          )}
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddCircleOutlineIcon />}
            onClick={addNode}
            size="small"
            sx={{ fontSize: '0.7rem', py: 0.5 }}
          >
            Add Node
          </Button>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box sx={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Left Panel */}
        <Box sx={{ 
          width: 280, 
          height: '100%', 
          bgcolor: 'background.paper',
          borderRight: '1px solid',
          borderColor: 'divider',
          overflow: 'auto',
          p: 1.5
        }}>
          <Stack spacing={1.5}>
            {/* Voice Recognition Controls */}
            <Paper elevation={2} sx={{ p: 1.5 }}>
              <Typography variant="subtitle2" sx={{ mb: 1, color: 'primary.main', fontSize: '0.85rem' }}>
                🎤 Voice Recognition
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                <Button
                  variant={listening ? "contained" : "outlined"}
                  color={listening ? "error" : "primary"}
                  size="small"
                  startIcon={listening ? <StopIcon /> : <MicIcon />}
                  onClick={toggleListening}
                  sx={{ fontSize: '0.7rem', py: 0.5 }}
                  fullWidth
                >
                  {listening ? 'Stop' : 'Start Listening'}
                </Button>
              </Box>
              <Typography variant="caption" sx={{ fontSize: '0.65rem', color: 'text.secondary' }}>
                {listening ? 'Listening for keywords...' : 'Click to start voice recognition'}
              </Typography>
            </Paper>

            {/* Keyword Input */}
            <Paper elevation={2} sx={{ p: 1.5 }}>
              <Typography variant="subtitle2" sx={{ mb: 1, color: 'primary.main', fontSize: '0.85rem' }}>
                🔍 Keywords
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                <TextField
                  size="small"
                  value={newKeyword}
                  onChange={(e) => setNewKeyword(e.target.value)}
                  placeholder="Add keyword..."
                  onKeyPress={(e) => e.key === 'Enter' && addKeyword()}
                  sx={{ 
                    flex: 1,
                    '& .MuiInputBase-input': { fontSize: '0.75rem', py: 0.5 }
                  }}
                />
                <Button
                  variant="contained"
                  size="small"
                  onClick={addKeyword}
                  sx={{ fontSize: '0.7rem', py: 0.5, px: 1 }}
                >
                  Add
                </Button>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {keywords.map((keyword, index) => (
                  <Chip
                    key={index}
                    label={keyword}
                    size="small"
                    onDelete={() => removeKeyword(index)}
                    onClick={() => handleKeywordClick(keyword)}
                    sx={{ fontSize: '0.65rem', height: 24, cursor: 'pointer' }}
                  />
                ))}
              </Box>
            </Paper>

            {/* Detected Keywords */}
            <Paper elevation={2} sx={{ p: 1.5 }}>
              <Typography variant="subtitle2" sx={{ mb: 1, color: 'primary.main', fontSize: '0.85rem' }}>
                🎯 Detected
              </Typography>
              <Box sx={{ 
                maxHeight: 80, 
                overflow: 'auto',
                wordWrap: 'break-word'
              }}>
                {detectedWords.length === 0 ? (
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                    No keywords detected yet
                  </Typography>
                ) : (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {detectedWords.map((word, idx) => (
                      <Chip
                        key={`${word}-${idx}`}
                        label={word}
                        size="small"
                        variant="outlined"
                        sx={{ 
                          fontSize: '0.65rem', 
                          height: 24,
                          bgcolor: 'primary.light',
                          color: 'primary.contrastText',
                          borderColor: 'primary.main'
                        }}
                      />
                    ))}
                  </Box>
                )}
              </Box>
            </Paper>

            {/* Full Speech */}
            <Paper elevation={2} sx={{ p: 1.5 }}>
              <Typography variant="subtitle2" sx={{ mb: 1, color: 'primary.main', fontSize: '0.85rem' }}>
                📝 Full Speech
              </Typography>
              <Box sx={{ 
                maxHeight: 80, 
                overflow: 'hidden',
                wordWrap: 'break-word',
                lineHeight: 1.3
              }}>
                {fullTranscriptLog.length === 0 ? (
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                    No speech detected yet
                  </Typography>
                ) : (
                  <Typography variant="body2" sx={{ fontSize: '0.7rem' }}>
                    {fullTranscriptLog.slice(-8).map((entry, idx) => {
                      const age = Date.now() - entry.timestamp;
                      const fadeDuration = 10000; // 10 seconds
                      const opacity = Math.max(0.3, 1 - age / fadeDuration);
                       
                      return (
                        <span
                          key={`${entry.timestamp}-${idx}`}
                          style={{ opacity, marginRight: '4px' }}
                        >
                          {entry.text}
                        </span>
                      );
                    })}
                  </Typography>
                )}
              </Box>
            </Paper>

            {/* Period Selector */}
            <Paper elevation={2} sx={{ p: 1.5 }}>
              <Typography variant="subtitle2" sx={{ mb: 1, color: 'primary.main', fontSize: '0.85rem' }}>
                🎨 Art Periods
              </Typography>
              <Typography variant="body2" sx={{ mb: 1, fontSize: '0.65rem', color: 'text.secondary' }}>
                Select a period to load artists and timeline
              </Typography>
              <ToggleButtonGroup
                value={selectedPeriod}
                exclusive
                onChange={handlePeriodChange}
                size="small"
                sx={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: 0.3,
                  '& .MuiToggleButton-root': {
                    fontSize: '0.65rem',
                    px: 1,
                    py: 0.3,
                    border: '1px solid',
                    borderColor: 'divider',
                    '&.Mui-selected': {
                      bgcolor: 'primary.main',
                      color: 'white',
                      '&:hover': {
                        bgcolor: 'primary.dark'
                      }
                    }
                  }
                }}
              >
                {Object.entries(artPeriods).map(([key, period]) => (
                  <ToggleButton key={key} value={key}>
                    {period.name}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            </Paper>
          </Stack>
        </Box>

        {/* Main Canvas Area */}
        <Box sx={{ 
          flex: 1, 
          height: '100%',
          position: 'relative',
          display: 'flex'
        }}>
          {/* Cytoscape Canvas */}
          <Box
            ref={containerRef}
            sx={{
              flex: 1,
              height: '100%',
              bgcolor: '#fafafa',
              border: '1px solid #e0e0e0'
            }}
          />

          {/* Right Panel - Node Editor */}
          <Box sx={{ 
            width: 300, 
            height: '100%', 
            bgcolor: 'background.paper',
            borderLeft: '1px solid',
            borderColor: 'divider',
            overflow: 'auto',
            p: 1.5
          }}>
            {selectedNode ? (
              <NodeEditor 
                selectedNode={selectedNode} 
                onClose={() => {
                  if (selectedNodeRef.current) {
                    selectedNodeRef.current.unselect();
                    selectedNodeRef.current = null;
                  }
                  setSelectedNode(null);
                }}
                labelInput={labelInput}
                setLabelInput={setLabelInput}
                extraText={extraText}
                setExtraText={setExtraText}
                nodeColor={nodeColor}
                setNodeColor={setNodeColor}
                updateNode={updateNode}
                generateAIDescription={generateAIDescription}
                isGeneratingAI={isGeneratingAI}
              />
            ) : (
              <Paper elevation={1} sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                  Select a node to edit
                </Typography>
              </Paper>
            )}
          </Box>
        </Box>
      </Box>

      {/* Timeline at Bottom */}
      <Box sx={{ height: 80, borderTop: '1px solid', borderColor: 'divider' }}>
        <Timeline artists={artists} selectedPeriod={selectedPeriod ? artPeriods[selectedPeriod]?.name : null} />
      </Box>
    </Box>
  );
};

export default MindMap;