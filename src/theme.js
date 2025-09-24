import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#233C67', // Deep blue for professionalism
    },
    secondary: {
      main: '#fbc02d', // Gold/yellow for artistic accent
    },
    background: {
      default: '#FDBABA', // Light background for clarity
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Segoe UI", "Roboto", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
    },
    h3: {
      fontWeight: 500,
      fontSize: '1.5rem',
    },
    body1: {
      fontSize: '1rem',
    },
  },
  shape: {
    borderRadius: 12, // Softer corners for a friendly look
  },
});

export default theme; 