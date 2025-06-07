import { useState, useMemo, useCallback } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter } from 'react-router-dom';
import Layout from './components/Layout';
import { PaletteMode } from '@mui/material';

export default function App() {
  const [mode, setMode] = useState<PaletteMode>('dark');

  const toggleColorMode = useCallback(() => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  }, []);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: '#00ff9d',
            dark: '#00cc7d',
            light: '#66ffc1',
            contrastText: '#000000',
          },
          secondary: {
            main: '#ff0099',
            dark: '#cc007a',
            light: '#ff33ad',
            contrastText: '#ffffff',
          },
          background: {
            default: mode === 'dark' ? '#0a0a0a' : '#f0f0f0',
            paper: mode === 'dark' ? '#141414' : '#ffffff',
          },
          text: {
            primary: mode === 'dark' ? '#ffffff' : '#000000',
            secondary: mode === 'dark' ? '#b3b3b3' : '#666666',
          },
          error: {
            main: '#ff3366',
            dark: '#cc295f',
            light: '#ff5c85',
          },
          success: {
            main: '#00ff9d',
            dark: '#00cc7d',
            light: '#66ffc1',
          },
        },
        typography: {
          fontFamily: "'JetBrains Mono', monospace",
          button: {
            textTransform: 'none',
          },
        },
        shape: {
          borderRadius: 12,
        },
        components: {
          MuiCssBaseline: {
            styleOverrides: {
              body: {
                scrollbarColor: mode === 'dark' ? '#2a2a2a transparent' : '#cccccc transparent',
                '&::-webkit-scrollbar, & *::-webkit-scrollbar': {
                  width: '8px',
                  height: '8px',
                },
                '&::-webkit-scrollbar-track, & *::-webkit-scrollbar-track': {
                  background: 'transparent',
                },
                '&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb': {
                  borderRadius: 8,
                  border: 'none',
                  background: mode === 'dark' ? '#2a2a2a' : '#cccccc',
                  '&:hover': {
                    background: mode === 'dark' ? '#3a3a3a' : '#bbbbbb',
                  },
                },
              },
            },
          },
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: 12,
                textTransform: 'none',
                fontWeight: 600,
              },
            },
          },
          MuiIconButton: {
            styleOverrides: {
              root: {
                borderRadius: 12,
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                backgroundImage: 'none',
              },
            },
          },
          MuiDialog: {
            styleOverrides: {
              paper: {
                borderRadius: 16,
              },
            },
          },
          MuiDivider: {
            styleOverrides: {
              root: {
                borderColor: mode === 'dark' ? '#2a2a2a' : 'rgba(0,0,0,0.12)',
              },
            },
          },
          MuiTextField: {
            defaultProps: {
              variant: 'outlined',
            },
            styleOverrides: {
              root: {
                '& .MuiOutlinedInput-root': {
                  borderRadius: 12,
                  '& fieldset': {
                    borderColor: mode === 'dark' ? '#2a2a2a' : 'rgba(0,0,0,0.12)',
                  },
                  '&:hover fieldset': {
                    borderColor: mode === 'dark' ? '#3a3a3a' : 'rgba(0,0,0,0.24)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#00ff9d',
                  },
                },
              },
            },
          },
        },
      }),
    [mode],
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Layout toggleColorMode={toggleColorMode} mode={mode} />
      </BrowserRouter>
    </ThemeProvider>
  );
} 