import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const TimelineContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  padding: theme.spacing(1),
  '&::before': {
    content: '""',
    position: 'absolute',
    left: 0,
    right: 0,
    top: '50%',
    height: 2,
    background: theme.palette.primary.main,
    transform: 'translateY(-50%)',
    zIndex: 1
  }
}));

const TimelineItem = styled(Box)(({ theme }) => ({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  margin: `0 ${theme.spacing(0.5)}`,
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 8,
    height: 8,
    background: theme.palette.primary.main,
    borderRadius: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 2
  }
}));

const Timeline = ({ artists, selectedPeriod }) => {
  if (!artists || artists.length === 0) {
    return (
      <Paper elevation={1} sx={{ p: 1, textAlign: 'center', bgcolor: 'background.default' }}>
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
          Select an art period to view the timeline
        </Typography>
      </Paper>
    );
  }

  // Sort artists by birth year
  const sortedArtists = [...artists].sort((a, b) => a.birth - b.birth);

  return (
    <Paper elevation={1} sx={{ p: 0.5, height: '100%', bgcolor: 'background.default' }}>
      <TimelineContainer>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          minHeight: 60,
          position: 'relative',
          zIndex: 3,
          px: 1
        }}>
          {sortedArtists.map((artist, index) => {
            const isEven = index % 2 === 0;
            
            return (
              <TimelineItem key={artist.keyword}>
                <Box sx={{ 
                  textAlign: 'center',
                  transform: isEven ? 'translateY(-25px)' : 'translateY(25px)',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    transform: isEven ? 'translateY(-30px)' : 'translateY(30px)'
                  }
                }}>
                  <Typography variant="body2" sx={{ 
                    fontSize: '0.7rem', 
                    fontWeight: 'bold', 
                    lineHeight: 1.1,
                    mb: 0.2,
                    color: 'text.primary'
                  }}>
                    {artist.name}
                  </Typography>
                  
                  <Typography variant="caption" sx={{ 
                    fontSize: '0.6rem', 
                    color: 'text.secondary',
                    display: 'block'
                  }}>
                    {artist.birth}-{artist.death}
                  </Typography>
                </Box>
              </TimelineItem>
            );
          })}
        </Box>
      </TimelineContainer>
    </Paper>
  );
};

export default Timeline; 