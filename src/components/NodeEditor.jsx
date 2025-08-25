import React from 'react';
import { Box, Typography, TextField, Button, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

// NodeEditor only edits the selected node fields. Detailed artist database removed
// to avoid unused-data ESLint warnings; artist info is handled in MindMap.jsx

const NodeEditor = ({ 
  selectedNode, 
  onClose,
  labelInput,
  setLabelInput,
  extraText,
  setExtraText,
  nodeColor,
  setNodeColor,
  updateNode,
  generateAIDescription,
  isGeneratingAI
}) => {
  if (!selectedNode) return null;

  const nodeData = selectedNode.data();
  const nodeId = nodeData.id;
  
  // Check if this is an artist node
  const artistInfo = artistDatabase[nodeId.toLowerCase()];

  // Convert RGB to Hex for color picker
  const rgbToHex = (rgb) => {
    if (!rgb) return '#4e91ff';
    if (rgb.startsWith('#')) return rgb;
    
    const rgbMatch = rgb.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (rgbMatch) {
      const r = parseInt(rgbMatch[1]);
      const g = parseInt(rgbMatch[2]);
      const b = parseInt(rgbMatch[3]);
      return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
    }
    return '#4e91ff';
  };

  return (
    <Box sx={{ height: '100%', overflow: 'auto' }}>
      <Box sx={{ p: 1.5 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
          <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 'bold', color: 'primary.main' }}>
            Edit Node
          </Typography>
          <IconButton 
            size="small" 
            onClick={onClose}
            sx={{ color: 'text.secondary', width: 24, height: 24 }}
          >
            <CloseIcon sx={{ fontSize: '1rem' }} />
          </IconButton>
        </Box>

  {/* Artist info removed; only use Additional Info field per requirement */}

        {/* Node Editor Fields */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <TextField
            label="Node Title"
            value={labelInput}
            onChange={(e) => setLabelInput(e.target.value)}
            placeholder="Enter node title..."
            size="small"
            fullWidth
            sx={{ 
              '& .MuiInputLabel-root': { fontSize: '0.75rem' },
              '& .MuiInputBase-input': { fontSize: '0.8rem', py: 1 }
            }}
          />
          
          <TextField
            label="Additional Info"
            value={extraText}
            onChange={(e) => setExtraText(e.target.value)}
            placeholder="Enter additional information..."
            multiline
            rows={3}
            size="small"
            fullWidth
            sx={{ 
              '& .MuiInputLabel-root': { fontSize: '0.75rem' },
              '& .MuiInputBase-input': { fontSize: '0.8rem' }
            }}
          />
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>Node Color:</Typography>
            <input
              type="color"
              value={rgbToHex(nodeColor)}
              onChange={(e) => setNodeColor(e.target.value)}
              style={{ 
                width: 32, 
                height: 32, 
                border: 'none', 
                borderRadius: 4,
                cursor: 'pointer'
              }}
            />
            <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.7rem' }}>
              {rgbToHex(nodeColor)}
            </Typography>
          </Box>
          
          <Button
            variant="contained"
            onClick={() => generateAIDescription(labelInput)}
            disabled={isGeneratingAI}
            fullWidth
            sx={{ mt: 1, py: 0.5, fontSize: '0.75rem' }}
          >
            {isGeneratingAI ? '🔄 Generating...' : '🤖 Generate AI Description'}
          </Button>
          
          <Button
            variant="contained"
            color="primary"
            onClick={updateNode}
            fullWidth
            sx={{ mt: 1, py: 0.5, fontSize: '0.75rem' }}
          >
            💾 Update Node
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default NodeEditor;