import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  useTheme,
  Paper,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Divider,
  useMediaQuery,
  Tooltip,
  Badge,
  PaletteMode,
} from '@mui/material';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import CodeIcon from '@mui/icons-material/Code';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import TaskIcon from '@mui/icons-material/Task';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import SettingsIcon from '@mui/icons-material/Settings';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SearchIcon from '@mui/icons-material/Search';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import TodoList from './TodoList';

const DRAWER_WIDTH = 240;

interface LayoutProps {
  toggleColorMode?: () => void;
  mode?: PaletteMode;
}

export default function Layout({ toggleColorMode, mode }: LayoutProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const drawer = (
    <Box sx={{ 
      height: '100%', 
      background: theme.palette.mode === 'dark' 
        ? 'linear-gradient(180deg, #141414 0%, #0a0a0a 100%)'
        : 'linear-gradient(180deg, #ffffff 0%, #f0f0f0 100%)',
      borderRight: `1px solid ${theme.palette.mode === 'dark' ? '#2a2a2a' : 'rgba(0,0,0,0.12)'}`,
    }}>
      <Box sx={{ 
        p: 2, 
        display: 'flex', 
        alignItems: 'center',
        gap: 1,
      }}>
        <CodeIcon sx={{ 
          color: theme.palette.primary.main,
          animation: 'pulse 2s infinite',
          '@keyframes pulse': {
            '0%': { opacity: 1, transform: 'scale(1)' },
            '50%': { opacity: 0.7, transform: 'scale(0.95)' },
            '100%': { opacity: 1, transform: 'scale(1)' },
          },
        }} />
        <Typography 
          variant="h6" 
          sx={{ 
            fontFamily: "'JetBrains Mono', monospace",
            letterSpacing: '0.1em',
            background: theme.palette.mode === 'dark'
              ? 'linear-gradient(45deg, #00ff9d 30%, #00cc7d 90%)'
              : 'linear-gradient(45deg, #00cc7d 30%, #009960 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Taskawy
        </Typography>
      </Box>
      <Divider sx={{ 
        borderColor: theme.palette.mode === 'dark' ? '#2a2a2a' : 'rgba(0,0,0,0.12)',
        my: 1 
      }} />
      <List>
        <ListItem button onClick={() => handleNavigation('/')} selected={location.pathname === '/'}>
          <ListItemIcon>
            <DashboardIcon sx={{ color: location.pathname === '/' ? theme.palette.primary.main : theme.palette.text.secondary }} />
          </ListItemIcon>
          <ListItemText 
            primary="Dashboard" 
            primaryTypographyProps={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.9rem',
            }}
          />
        </ListItem>
        <ListItem button onClick={() => handleNavigation('/tasks')} selected={location.pathname === '/tasks'}>
          <ListItemIcon>
            <TaskIcon sx={{ color: location.pathname === '/tasks' ? theme.palette.primary.main : theme.palette.text.secondary }} />
          </ListItemIcon>
          <ListItemText 
            primary="Tasks" 
            primaryTypographyProps={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.9rem',
            }}
          />
        </ListItem>
        <ListItem button onClick={() => handleNavigation('/analytics')} selected={location.pathname === '/analytics'}>
          <ListItemIcon>
            <AnalyticsIcon sx={{ color: location.pathname === '/analytics' ? theme.palette.primary.main : theme.palette.text.secondary }} />
          </ListItemIcon>
          <ListItemText 
            primary="Analytics" 
            primaryTypographyProps={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.9rem',
            }}
          />
        </ListItem>
      </List>
      <Divider sx={{ 
        borderColor: theme.palette.mode === 'dark' ? '#2a2a2a' : 'rgba(0,0,0,0.12)',
        my: 1 
      }} />
      <List>
        <ListItem button onClick={() => handleNavigation('/settings')} selected={location.pathname === '/settings'}>
          <ListItemIcon>
            <SettingsIcon sx={{ color: location.pathname === '/settings' ? theme.palette.primary.main : theme.palette.text.secondary }} />
          </ListItemIcon>
          <ListItemText 
            primary="Settings" 
            primaryTypographyProps={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.9rem',
            }}
          />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar 
        position="fixed" 
        elevation={0}
        sx={{
          width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { sm: `${DRAWER_WIDTH}px` },
          bgcolor: 'transparent',
          backdropFilter: 'blur(10px)',
          borderBottom: `1px solid ${theme.palette.mode === 'dark' ? '#2a2a2a' : 'rgba(0,0,0,0.12)'}`,
          background: theme.palette.mode === 'dark' 
            ? 'linear-gradient(90deg, rgba(10,10,10,0.8) 0%, rgba(20,20,20,0.8) 100%)'
            : 'linear-gradient(90deg, rgba(255,255,255,0.8) 0%, rgba(240,240,240,0.8) 100%)',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Paper
              sx={{
                p: '2px 4px',
                display: 'flex',
                alignItems: 'center',
                width: 400,
                bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                border: `1px solid ${theme.palette.mode === 'dark' ? '#2a2a2a' : 'rgba(0,0,0,0.12)'}`,
                borderRadius: 2,
              }}
            >
              <IconButton sx={{ p: '10px' }}>
                <SearchIcon />
              </IconButton>
              <input
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  color: theme.palette.text.primary,
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '0.9rem',
                }}
                placeholder="Search tasks..."
              />
            </Paper>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Notifications">
              <IconButton color="inherit">
                <Badge badgeContent={3} color="secondary">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>
            {toggleColorMode && (
              <Tooltip title={mode === 'dark' ? 'Light Mode' : 'Dark Mode'}>
                <IconButton onClick={toggleColorMode} color="inherit">
                  {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { sm: DRAWER_WIDTH }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: DRAWER_WIDTH,
              background: theme.palette.mode === 'dark' 
                ? 'linear-gradient(180deg, #141414 0%, #0a0a0a 100%)'
                : 'linear-gradient(180deg, #ffffff 0%, #f0f0f0 100%)',
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: DRAWER_WIDTH,
              background: 'transparent',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
          minHeight: '100vh',
          bgcolor: theme.palette.background.default,
          mt: 8,
        }}
      >
        <Container maxWidth="lg">
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
            <Routes>
              <Route path="/" element={<TodoList />} />
              <Route path="/tasks" element={<TodoList />} />
              <Route path="/analytics" element={<div>Analytics Coming Soon</div>} />
              <Route path="/settings" element={<div>Settings Coming Soon</div>} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
} 