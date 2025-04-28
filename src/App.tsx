import React from 'react';
import { Container, CssBaseline, ThemeProvider, createTheme, Box, Typography, Divider } from '@mui/material';
import { CreateFridge } from './components/CreateFridge';
import { FridgeList } from './components/FridgeList';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container>
        <Box py={4}>
          <Typography variant="h3" component="h1" gutterBottom align="center">
            Fridge Management App
          </Typography>
          <Divider sx={{ my: 3 }} />
          <CreateFridge />
          <Box mt={4}>
            <FridgeList />
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;
