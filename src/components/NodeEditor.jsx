import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Avatar, 
  Chip, 
  Divider, 
  TextField, 
  Button, 
  IconButton,
  Paper
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

// Enhanced artist database with more detailed information
const artistDatabase = {
  leonardo: {
    name: 'Leonardo da Vinci',
    period: 'Renaissance',
    birth: 1452,
    death: 1519,
    nationality: 'Italian',
    bio: 'A true Renaissance man, Leonardo was a painter, sculptor, architect, scientist, musician, mathematician, engineer, inventor, anatomist, geologist, astronomer, cartographer, botanist, and writer. His most famous works include the Mona Lisa and The Last Supper.',
    famousWorks: ['Mona Lisa', 'The Last Supper', 'Vitruvian Man', 'Lady with an Ermine'],
    worksImages: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg/687px-Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/%C3%9Altima_Cena_-_Da_Vinci_5.jpg/1280px-%C3%9Altima_Cena_-_Da_Vinci_5.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Da_Vinci_Vitruve_Luc_Viatour.jpg/800px-Da_Vinci_Vitruve_Luc_Viatour.jpg'
    ],
    portrait: 'https://upload.wikimedia.org/wikipedia/commons/c/c3/Leonardo_da_Vinci_-_Portrait_of_Leonardo_da_Vinci.jpg',
    style: 'High Renaissance',
    influence: 'Revolutionary techniques in sfumato and chiaroscuro'
  },
  michelangelo: {
    name: 'Michelangelo',
    period: 'Renaissance',
    birth: 1475,
    death: 1564,
    nationality: 'Italian',
    bio: 'Michelangelo was a sculptor, painter, architect, and poet who exerted an unparalleled influence on the development of Western art. His works include the Sistine Chapel ceiling and the David statue.',
    famousWorks: ['David', 'Sistine Chapel Ceiling', 'Pietà', 'The Creation of Adam'],
    worksImages: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Michelangelo%27s_David_-_right_view_2.jpg/800px-Michelangelo%27s_David_-_right_view_2.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Michelangelo_-_Creation_of_Adam_%28cropped%29.jpg/1280px-Michelangelo_-_Creation_of_Adam_%28cropped%29.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Michelangelo_-_Piet%C3%A0_Rondanini_-_Castello_Sforzesco_-_Milan_2016.jpg/800px-Michelangelo_-_Piet%C3%A0_Rondanini_-_Castello_Sforzesco_-_Milan_2016.jpg'
    ],
    portrait: 'https://upload.wikimedia.org/wikipedia/commons/5/5b/Michelangelo_-_Portrait_of_Michelangelo.jpg',
    style: 'High Renaissance',
    influence: 'Master of human anatomy and dramatic composition'
  },
  raphael: {
    name: 'Raphael',
    period: 'Renaissance',
    birth: 1483,
    death: 1520,
    nationality: 'Italian',
    bio: 'Raphael was an Italian painter and architect of the High Renaissance. His work is admired for its clarity of form, ease of composition, and visual achievement of the Neoplatonic ideal of human grandeur.',
    famousWorks: ['The School of Athens', 'Sistine Madonna', 'The Transfiguration', 'Portrait of Pope Julius II'],
    worksImages: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Raffaello_Sanzio_da_Urbino_-_The_School_of_Athens_-_Google_Art_Project.jpg/1280px-Raffaello_Sanzio_da_Urbino_-_The_School_of_Athens_-_Google_Art_Project.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Raphael_-_Sistine_Madonna_-_Google_Art_Project.jpg/800px-Raphael_-_Sistine_Madonna_-_Google_Art_Project.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Raphael_-_Portrait_of_Pope_Julius_II_-_National_Gallery%2C_London.jpg/800px-Raphael_-_Portrait_of_Pope_Julius_II_-_National_Gallery%2C_London.jpg'
    ],
    portrait: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Raffaello_Sanzio_selfportrait.jpg',
    style: 'High Renaissance',
    influence: 'Perfect harmony and grace in composition'
  },
  rembrandt: {
    name: 'Rembrandt',
    period: 'Baroque',
    birth: 1606,
    death: 1669,
    nationality: 'Dutch',
    bio: 'Rembrandt was a Dutch draughtsman, painter, and printmaker. An innovative and prolific master in three media, he is generally considered one of the greatest visual artists in the history of art.',
    famousWorks: ['The Night Watch', 'Self-Portrait with Two Circles', 'The Jewish Bride', 'The Anatomy Lesson of Dr. Nicolaes Tulp'],
    worksImages: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Rembrandt_van_Rijn_-_The_Night_Watch_-_Google_Art_Project.jpg/1280px-Rembrandt_van_Rijn_-_The_Night_Watch_-_Google_Art_Project.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Rembrandt_van_Rijn_-_Self-Portrait_-_Google_Art_Project.jpg/800px-Rembrandt_van_Rijn_-_Self-Portrait_-_Google_Art_Project.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Rembrandt_van_Rijn_-_The_Jewish_Bride_-_Google_Art_Project.jpg/800px-Rembrandt_van_Rijn_-_The_Jewish_Bride_-_Google_Art_Project.jpg'
    ],
    portrait: 'https://upload.wikimedia.org/wikipedia/commons/8/8d/Rembrandt_van_Rijn_-_Self-Portrait_-_Google_Art_Project.jpg',
    style: 'Baroque',
    influence: 'Master of light and shadow (chiaroscuro)'
  },
  monet: {
    name: 'Claude Monet',
    period: 'Impressionism',
    birth: 1840,
    death: 1926,
    nationality: 'French',
    bio: 'Monet was a founder of French Impressionist painting and the most consistent and prolific practitioner of the movement\'s philosophy of expressing one\'s perceptions before nature.',
    famousWorks: ['Water Lilies', 'Impression, Sunrise', 'Haystacks', 'Rouen Cathedral Series'],
    worksImages: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Claude_Monet_-_Water_Lilies_-_Google_Art_Project.jpg/1280px-Claude_Monet_-_Water_Lilies_-_Google_Art_Project.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Monet_-_Impression%2C_Sunrise.jpg/1280px-Monet_-_Impression%2C_Sunrise.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Claude_Monet_-_Wheatstacks_%28End_of_Summer%29_-_Google_Art_Project.jpg/1280px-Claude_Monet_-_Wheatstacks_%28End_of_Summer%29_-_Google_Art_Project.jpg'
    ],
    portrait: 'https://upload.wikimedia.org/wikipedia/commons/a/a4/Claude_Monet_1899_Nadar_crop.jpg',
    style: 'Impressionism',
    influence: 'Pioneer of plein air painting and light effects'
  },
  picasso: {
    name: 'Pablo Picasso',
    period: 'Modern',
    birth: 1881,
    death: 1973,
    nationality: 'Spanish',
    bio: 'Picasso was a Spanish painter, sculptor, printmaker, ceramicist, and theatre designer who spent most of his adult life in France. He co-founded the Cubist movement and invented constructed sculpture.',
    famousWorks: ['Guernica', 'Les Demoiselles d\'Avignon', 'The Old Guitarist', 'Weeping Woman'],
    worksImages: [
      'https://upload.wikimedia.org/wikipedia/en/7/74/PicassoGuernica.jpg',
      'https://upload.wikimedia.org/wikipedia/en/4/4c/Les_Demoiselles_d%27Avignon.jpg',
      'https://upload.wikimedia.org/wikipedia/en/4/4c/Picasso_Old_Guitarist_chicago.jpg'
    ],
    portrait: 'https://upload.wikimedia.org/wikipedia/commons/9/98/Pablo_picasso_1.jpg',
    style: 'Cubism, Surrealism',
    influence: 'Revolutionary approach to form and perspective'
  },
  vangogh: {
    name: 'Vincent van Gogh',
    period: 'Post-Impressionism',
    birth: 1853,
    death: 1890,
    nationality: 'Dutch',
    bio: 'Van Gogh was a Dutch post-impressionist painter who posthumously became one of the most famous and influential figures in Western art history. In a decade, he created about 2,100 artworks.',
    famousWorks: ['The Starry Night', 'Sunflowers', 'Irises', 'Self-Portrait with Bandaged Ear'],
    worksImages: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/1280px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Vincent_Willem_van_Gogh_127.jpg/1280px-Vincent_Willem_van_Gogh_127.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Vincent_van_Gogh_-_Self-Portrait_-_Google_Art_Project_%28454045%29.jpg/800px-Vincent_van_Gogh_-_Self-Portrait_-_Google_Art_Project_%28454045%29.jpg'
    ],
    portrait: 'https://upload.wikimedia.org/wikipedia/commons/b/b2/Vincent_van_Gogh_-_Self-Portrait_-_Google_Art_Project_%28454045%29.jpg',
    style: 'Post-Impressionism',
    influence: 'Expressive use of color and brushwork'
  },
  dali: {
    name: 'Salvador Dalí',
    period: 'Surrealism',
    birth: 1904,
    death: 1989,
    nationality: 'Spanish',
    bio: 'Dalí was a Spanish surrealist artist renowned for his technical skill, precise draftsmanship, and the striking and bizarre images in his work. He was influenced by Renaissance masters.',
    famousWorks: ['The Persistence of Memory', 'The Elephants', 'Swans Reflecting Elephants', 'The Temptation of St. Anthony'],
    worksImages: [
      'https://upload.wikimedia.org/wikipedia/en/d/dd/The_Persistence_of_Memory.jpg',
      'https://upload.wikimedia.org/wikipedia/en/7/7f/The_Elephants.jpg',
      'https://upload.wikimedia.org/wikipedia/en/8/8b/Swans_Reflecting_Elephants.jpg'
    ],
    portrait: 'https://upload.wikimedia.org/wikipedia/en/thumb/3/31/Salvador_Dal%C3%AD_photographed_by_Carl_Van_Vechten_1939.jpg/220px-Salvador_Dal%C3%AD_photographed_by_Carl_Van_Vechten_1939.jpg',
    style: 'Surrealism',
    influence: 'Master of dreamlike imagery and symbolism'
  },
  warhol: {
    name: 'Andy Warhol',
    period: 'Pop Art',
    birth: 1928,
    death: 1987,
    nationality: 'American',
    bio: 'Warhol was an American artist, film director, and producer who was a leading figure in the visual art movement known as pop art. His works explore the relationship between artistic expression, advertising, and celebrity culture.',
    famousWorks: ['Campbell\'s Soup Cans', 'Marilyn Diptych', 'Elvis Presley', 'Brillo Boxes'],
    worksImages: [
      'https://upload.wikimedia.org/wikipedia/en/thumb/7/7d/Andy_Warhol_Campbell%27s_Soup_Cans.jpg/1280px-Andy_Warhol_Campbell%27s_Soup_Cans.jpg',
      'https://upload.wikimedia.org/wikipedia/en/thumb/7/7d/Andy_Warhol_Marilyn_Diptych.jpg/1280px-Andy_Warhol_Marilyn_Diptych.jpg',
      'https://upload.wikimedia.org/wikipedia/en/thumb/8/8d/Andy_Warhol_Elvis.jpg/1280px-Andy_Warhol_Elvis.jpg'
    ],
    portrait: 'https://upload.wikimedia.org/wikipedia/en/thumb/8/82/Andy_Warhol_by_Jack_Mitchell.jpg/220px-Andy_Warhol_by_Jack_Mitchell.jpg',
    style: 'Pop Art',
    influence: 'Pioneer of mass production in art'
  }
};

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

        {/* Artist Information (if available) */}
        {artistInfo && (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
              <Avatar
                src={artistInfo.portrait}
                alt={artistInfo.name}
                sx={{ width: 45, height: 45, mr: 1.5, border: '2px solid #e0e0e0' }}
              />
              <Box>
                <Typography variant="body1" sx={{ fontWeight: 600, fontSize: '0.9rem' }}>
                  {artistInfo.name}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                  {artistInfo.birth} - {artistInfo.death} • {artistInfo.period}
                </Typography>
              </Box>
            </Box>
            
            <Typography variant="body2" sx={{ mb: 1.5, lineHeight: 1.4, fontSize: '0.75rem' }}>
              {artistInfo.bio}
            </Typography>
            
            <Divider sx={{ my: 1.5 }} />
          </>
        )}

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