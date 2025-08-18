import React from 'react';
import { Box, Typography, Avatar, Chip } from '@mui/material';

const ArtistNode = ({ artist, aiDescription }) => {
  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        background: `linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)`,
        borderRadius: '12px',
        padding: '12px',
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}
    >
      {/* Artist Portrait (always show, fallback to placeholder) */}
      <Box sx={{ 
        position: 'absolute', 
        top: 8, 
        right: 8, 
        zIndex: 2 
      }}>
        <Avatar
          src={artist.portrait || '/artists/placeholder.jpg'}
          alt={artist.name}
          sx={{ 
            width: 50, 
            height: 50, 
            border: '2px solid white',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
          }}
        />
      </Box>

      {/* Artist Name and Period */}
      <Box sx={{ mb: 1, pr: artist.portrait ? 6 : 0 }}>
        <Typography variant="h6" sx={{ 
          fontSize: '1.1rem', 
          fontWeight: 'bold', 
          mb: 0.5,
          textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
        }}>
          {artist.name}
        </Typography>
        <Chip 
          label={artist.period} 
          size="small" 
          sx={{ 
            fontSize: '0.6rem', 
            height: 20,
            bgcolor: 'rgba(255,255,255,0.2)',
            color: 'white',
            border: '1px solid rgba(255,255,255,0.3)'
          }}
        />
      </Box>

      {/* Only show Additional Info as info */}
      <Box sx={{ mb: 1, flex: 1, pr: 6 }}>
        <Typography variant="body2" sx={{ 
          fontSize: '0.75rem', 
          lineHeight: 1.4,
          textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
          opacity: 0.95
        }}>
          {artist.additionalInfo || aiDescription || artist.bio}
        </Typography>
      </Box>

      {/* Famous Works Images */}
      {artist.worksImages && artist.worksImages.length > 0 && (
        <Box sx={{ 
          display: 'flex', 
          gap: 0.5, 
          justifyContent: 'center',
          mt: 1
        }}>
          {artist.worksImages.slice(0, 3).map((image, index) => (
            <Box
              key={index}
              sx={{
                width: 45,
                height: 35,
                borderRadius: '4px',
                overflow: 'hidden',
                border: '1px solid rgba(255,255,255,0.3)',
                backgroundImage: `url(${image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
                transition: 'transform 0.2s ease',
                '&:hover': {
                  transform: 'scale(1.05)'
                }
              }}
              title={artist.famousWorks?.[index] || `Work ${index + 1}`}
            />
          ))}
        </Box>
      )}

      {/* Years */}
      <Typography variant="caption" sx={{ 
        fontSize: '0.65rem', 
        textAlign: 'center',
        opacity: 0.9,
        textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
        mt: 0.5
      }}>
        {artist.birth} - {artist.death}
      </Typography>
    </Box>
  );
};

export default ArtistNode; 