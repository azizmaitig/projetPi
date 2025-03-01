import React, { useState } from 'react';
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Badge,
  Avatar,
  Divider,
  useTheme,
  useMediaQuery,
  Tooltip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  LocalParking,
  DirectionsCar,
  Assessment,
  Settings,
  Notifications,
  ChevronLeft,
  ChevronRight,
} from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';

const drawerWidth = 240;

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopOpen, setDesktopOpen] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const location = useLocation();

  const handleDrawerToggle = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setDesktopOpen(!desktopOpen);
    }
  };

  const handleMenuItemClick = () => {
    setMobileOpen(false);
  };

  const menuItems = [
    { text: 'Tableau de bord', icon: <Dashboard />, path: '/' },
    { text: 'Parking', icon: <LocalParking />, path: '/parking' },
    { text: 'Plan du Parking', icon: <DirectionsCar />, path: '/parking-map' },
    { text: 'Rapports', icon: <Assessment />, path: '/reports' },
    { text: 'Paramètres', icon: <Settings />, path: '/settings' },
  ];

  const drawer = (
    <Box sx={{ height: '100%', bgcolor: 'background.paper', position: 'relative' }}>
      <Box sx={{ 
        p: 2, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between' 
      }}>
        <Typography variant="h6" component="div" sx={{ color: theme.palette.primary.main, fontWeight: 'bold' }}>
          dibsido
        </Typography>
        {!isMobile && (
          <IconButton onClick={handleDrawerToggle}>
            {desktopOpen ? <ChevronLeft /> : <ChevronRight />}
          </IconButton>
        )}
      </Box>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              component={Link}
              to={item.path}
              selected={location.pathname === item.path}
              onClick={handleMenuItemClick}
              sx={{
                '&.Mui-selected': {
                  bgcolor: 'rgba(25, 118, 210, 0.08)',
                  borderLeft: `4px solid ${theme.palette.primary.main}`,
                  '& .MuiListItemIcon-root': {
                    color: theme.palette.primary.main,
                  },
                },
                '&:hover': {
                  bgcolor: 'rgba(25, 118, 210, 0.04)',
                },
              }}
            >
              <ListItemIcon sx={{ color: 'text.secondary' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Box sx={{ mt: 'auto', p: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Version d'essai
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Restant: 12 jours
        </Typography>
      </Box>
    </Box>
  );

  // Collapsed mini-drawer content
  const miniDrawer = (
    <Box sx={{ height: '100%', bgcolor: 'background.paper', width: '60px' }}>
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
        <IconButton onClick={handleDrawerToggle}>
          <ChevronRight />
        </IconButton>
      </Box>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ display: 'block' }}>
            <Tooltip title={item.text} placement="right">
              <ListItemButton
                component={Link}
                to={item.path}
                selected={location.pathname === item.path}
                onClick={handleMenuItemClick}
                sx={{
                  minHeight: 48,
                  justifyContent: 'center',
                  px: 2.5,
                  '&.Mui-selected': {
                    bgcolor: 'rgba(25, 118, 210, 0.08)',
                    borderLeft: `4px solid ${theme.palette.primary.main}`,
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: 'auto',
                    justifyContent: 'center',
                    color: location.pathname === item.path ? theme.palette.primary.main : 'text.secondary',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
              </ListItemButton>
            </Tooltip>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          width: { 
            xs: '100%',
            sm: desktopOpen ? `calc(100% - ${drawerWidth}px)` : 'calc(100% - 60px)'
          },
          ml: { 
            xs: 0,
            sm: desktopOpen ? drawerWidth : 60
          },
          bgcolor: 'background.paper',
          boxShadow: 'none',
          borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
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
          <Box sx={{ flexGrow: 1 }} />
          {menuItems.map((item) => (
            <Tooltip title={item.text} key={item.path}>
              <IconButton 
                component={Link} 
                to={item.path}
                onClick={handleMenuItemClick}
                sx={{ '&:hover': { color: 'primary.main' } }}
              >
                {item.icon}
              </IconButton>
            </Tooltip>
          ))}
          <IconButton size="large" color="default">
            <Badge badgeContent={1} color="error">
              <Notifications />
            </Badge>
          </IconButton>
          <IconButton sx={{ ml: 1 }}>
            <Avatar sx={{ width: 32, height: 32 }}>A</Avatar>
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ 
          width: { 
            sm: desktopOpen ? drawerWidth : 60
          }, 
          flexShrink: { sm: 0 },
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
      >
        {/* Mobile drawer - temporary variant */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              borderRight: '1px solid rgba(0, 0, 0, 0.12)',
            },
          }}
        >
          {drawer}
        </Drawer>
        
        {/* Desktop drawer - permanent variant */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: desktopOpen ? drawerWidth : 60,
              borderRight: '1px solid rgba(0, 0, 0, 0.12)',
              transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
              overflowX: 'hidden',
            },
          }}
          open
        >
          {desktopOpen ? drawer : miniDrawer}
        </Drawer>
      </Box>
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          p: 3,
          width: { 
            sm: `calc(100% - ${desktopOpen ? drawerWidth : 60}px)` 
          },
          ml: { 
            sm: `${desktopOpen ? drawerWidth : 60}px` 
          },
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
      >
        <Toolbar />
      </Box>
    </>
  );
};

export default Navbar; 