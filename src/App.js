import React from 'react';
import MindMap from './MindMap';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <MindMap />
    </ThemeProvider>
  );
}

export default App;
