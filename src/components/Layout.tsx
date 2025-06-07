import React from 'react';
import { AppBar, Toolbar, Typography, Container, Box, useTheme, Paper } from '@mui/material';
import { Outlet } from 'react-router-dom';
import CodeIcon from '@mui/icons-material/Code';

export default function Layout() {
  const theme = useTheme();
  
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: theme.palette.background.default }}>
      <AppBar 
        position="fixed" 
        elevation={0}
        sx={{
          bgcolor: 'transparent',
          backdropFilter: 'blur(10px)',
          borderBottom: `1px solid ${theme.palette.mode === 'dark' ? '#2a2a2a' : 'rgba(0,0,0,0.12)'}`,
          background: theme.palette.mode === 'dark' 
            ? 'linear-gradient(90deg, rgba(10,10,10,0.8) 0%, rgba(20,20,20,0.8) 100%)'
            : 'linear-gradient(90deg, rgba(255,255,255,0.8) 0%, rgba(240,240,240,0.8) 100%)',
        }}
      >
        <Toolbar>
          <CodeIcon sx={{ 
            mr: 2,
            color: theme.palette.primary.main,
            animation: 'pulse 2s infinite',
            '@keyframes pulse': {
              '0%': {
                opacity: 1,
                transform: 'scale(1)',
              },
              '50%': {
                opacity: 0.7,
                transform: 'scale(0.95)',
              },
              '100%': {
                opacity: 1,
                transform: 'scale(1)',
              },
            },
          }} />
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              flexGrow: 1, 
              fontWeight: 600,
              fontFamily: "'JetBrains Mono', monospace",
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              background: theme.palette.mode === 'dark'
                ? 'linear-gradient(45deg, #00ff9d 30%, #00cc7d 90%)'
                : 'linear-gradient(45deg, #00cc7d 30%, #009960 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Taskawy
          </Typography>
        </Toolbar>
      </AppBar>
      <Toolbar /> {/* Spacer for fixed AppBar */}
      <Container 
        maxWidth="lg" 
        sx={{ 
          py: 4,
          px: { xs: 2, sm: 3 },
          mt: 2,
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '1px',
            background: theme.palette.mode === 'dark'
              ? 'linear-gradient(90deg, transparent, #00ff9d, transparent)'
              : 'linear-gradient(90deg, transparent, #00cc7d, transparent)',
            opacity: 0.5,
          },
        }}
      >
        <Paper 
          elevation={0}
          sx={{ 
            p: { xs: 2, sm: 3 },
            borderRadius: 3,
            bgcolor: 'transparent',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: theme.palette.mode === 'dark'
                ? 'radial-gradient(circle at top right, rgba(0, 255, 157, 0.1), transparent 70%)'
                : 'radial-gradient(circle at top right, rgba(0, 204, 125, 0.1), transparent 70%)',
              pointerEvents: 'none',
            },
          }}
        >
          <Outlet />
        </Paper>
      </Container>
    </Box>
  );
} 