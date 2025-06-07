import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import TodoList from './components/TodoList';
import Layout from './components/Layout';
import { StyledEngineProvider } from '@mui/material/styles';
import { IconButton } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

function App() {
  const [darkMode, setDarkMode] = useState(true);

  const theme = createTheme({
    typography: {
      fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
      h6: {
        letterSpacing: '0.1em',
      },
    },
    shape: {
      borderRadius: 12,
    },
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#00ff9d',
        dark: '#00cc7d',
        light: '#33ffb1',
        contrastText: '#000000',
      },
      secondary: {
        main: '#ff0099',
        dark: '#cc007a',
        light: '#ff33ad',
        contrastText: '#ffffff',
      },
      background: {
        default: darkMode ? '#0a0a0a' : '#f0f0f0',
        paper: darkMode ? '#141414' : '#ffffff',
      },
      text: {
        primary: darkMode ? '#e0e0e0' : '#121212',
        secondary: darkMode ? '#a0a0a0' : '#666666',
      },
      error: {
        main: '#ff3366',
      },
      success: {
        main: '#00ff9d',
      },
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundImage: darkMode ? 'linear-gradient(45deg, #141414 25%, #1a1a1a 25%, #1a1a1a 50%, #141414 50%, #141414 75%, #1a1a1a 75%, #1a1a1a 100%)' : 'none',
            backgroundSize: '10px 10px',
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: darkMode ? '#2a2a2a' : 'rgba(0,0,0,0.12)',
            boxShadow: darkMode ? '0 4px 20px rgba(0, 255, 157, 0.1)' : 'none',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: '8px',
            fontWeight: 600,
            letterSpacing: '0.05em',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: darkMode ? '0 4px 20px rgba(0, 255, 157, 0.2)' : 'none',
            },
          },
          contained: {
            backgroundImage: darkMode ? 'linear-gradient(45deg, #00ff9d 30%, #00cc7d 90%)' : 'none',
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: darkMode ? '#2a2a2a' : 'rgba(0,0,0,0.12)',
              },
              '&:hover fieldset': {
                borderColor: darkMode ? '#00ff9d' : '#00cc7d',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#00ff9d',
              },
            },
          },
        },
      },
      MuiListItem: {
        styleOverrides: {
          root: {
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              transform: 'translateX(8px)',
              backgroundColor: darkMode ? 'rgba(0, 255, 157, 0.1)' : 'rgba(0, 204, 125, 0.1)',
            },
          },
        },
      },
    },
  });

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <IconButton
          onClick={toggleDarkMode}
          sx={{
            position: 'fixed',
            top: '1rem',
            right: '1rem',
            zIndex: 1100,
            color: theme.palette.text.primary,
            backgroundColor: darkMode ? 'rgba(20, 20, 20, 0.8)' : 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(8px)',
            '&:hover': {
              backgroundColor: darkMode ? 'rgba(30, 30, 30, 0.8)' : 'rgba(245, 245, 245, 0.8)',
            },
          }}
        >
          {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<TodoList />} />
              <Route path="todos" element={<TodoList />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

export default App; 