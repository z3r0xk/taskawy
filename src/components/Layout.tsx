import React from 'react';
import { AppBar, Toolbar, Typography, Container, Box, useTheme, Paper } from '@mui/material';
import { Outlet } from 'react-router-dom';
import AssignmentIcon from '@mui/icons-material/Assignment';

export default function Layout() {
  const theme = useTheme();
  
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: theme.palette.background.default }}>
      <AppBar 
        position="fixed" 
        elevation={0}
        sx={{
          bgcolor: theme.palette.mode === 'dark' ? '#1e1e1e' : theme.palette.primary.main,
          borderBottom: `1px solid ${theme.palette.divider}`
        }}
      >
        <Toolbar>
          <AssignmentIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
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
        }}
      >
        <Paper 
          elevation={0}
          sx={{ 
            p: { xs: 2, sm: 3 },
            borderRadius: 2,
            bgcolor: 'transparent'
          }}
        >
          <Outlet />
        </Paper>
      </Container>
    </Box>
  );
} 