"use client";
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import AddBox from '@mui/icons-material/AddBox';
import { Category, Search, ViewList, PersonAdd, Login, Logout } from '@mui/icons-material';
import { Avatar, Button } from '@mui/material';
import { useAuth } from '../hooks/useAuth'; // Import your custom hook here
import MenuIcon from '@mui/icons-material/Menu'; // Add this import
import GoogleSignIn from './Googlesign';
import { Google } from '@mui/icons-material';
import FlareIcon from '@mui/icons-material/Flare';
import DeviceHubIcon from '@mui/icons-material/DeviceHub';
import Logo from '../public/logo.png';
import Image from 'next/image';

interface Props {
  window?: () => Window;
}

const menuItems = [
  { text: 'All Items', icon: <ViewList />, href: '/allitems' },
  { text: 'Add Item', icon: <AddBox />, href: '/additems' },
  { text: 'Categories', icon: <Category />, href: '/addcategory' },
  { text: 'AI Recipe Generator', icon: <FlareIcon />, href: '/recipe' },
  { text: 'AI Camera ', icon: <DeviceHubIcon />, href: '/imgrecog' },
];

const authItems = [
  { text: 'Sign up', icon: <PersonAdd />, href: '/signup' },
  { text: 'Login', icon: <Login />, href: '/login' },
  { text: 'Logout', icon: <Logout />, href: '/logout' },
];

export default function ResponsiveDrawer(props: Props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isClosing, setIsClosing] = React.useState(false);
  const [user, loading] = useAuth(); // Use the custom hook here

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  const drawer = (
    <div>

      {/* Logo section */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', my: 2 }}>
        <Image src={Logo} alt="Logo"  width={750}height={100} />
      </Box>
      <Divider />
      <Box sx={{ textAlign: 'center', py: 4 }}>
        {loading ? (
          <Typography variant="subtitle1">Loading...</Typography>
        ) : user ? (
          <React.Fragment>
            <Avatar
              alt={user.email || 'User'}
              src={user.photoURL || '/static/images/avatar/1.jpg'}
              sx={{ margin: '0 auto', mb: 1 }}
            />
            <Typography variant="subtitle1">{user.email || 'User'}</Typography>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Avatar
              alt="Dummy User"
              src="/static/images/avatar/1.jpg"
              sx={{ margin: '0 auto', mb: 1 }}
            />
            <Button
              variant="outlined"
              component={Link}
              href="/login"
              color="primary"
            >
              Login
            </Button>
          </React.Fragment>
        )}
      </Box>
      <Divider />
      <List>
        {menuItems.map(({ text, icon, href }) => (
          <ListItemButton component={Link} href={href} key={text}>
            <ListItemIcon>{icon}</ListItemIcon>
            <ListItemText primary={text} />
          </ListItemButton>
        ))}
        {user && (
          <ListItemButton component={Link} href="/searchitems">
            <ListItemIcon>
              <Search />
            </ListItemIcon>
            <ListItemText primary="Search & Filters" />
          </ListItemButton>
        )}
      </List>
      <Divider />
      <List>
        {authItems.map(({ text, icon, href }) => (
          <ListItemButton component={Link} href={href} key={text}>
            <ListItemIcon>{icon}</ListItemIcon>
            <ListItemText primary={text} />
          </ListItemButton>
        ))}
      </List>
    </div>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar
          position="fixed"
          sx={{
            width: { sm: `calc(100% - 20vw)` },
            ml: { sm: '20vw' },
            backgroundColor: 'white',
            color: 'black',
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
            <Box sx={{ flexGrow: 1 }} /> {/* Spacer to push GoogleSignIn to the right */}
            <GoogleSignIn />
          </Toolbar>
        </AppBar>

        <Box
          component="nav"
          sx={{ width: { sm: '6vw' }, flexShrink: { sm: 0 } }}
          aria-label="mailbox folders"
        >
          <Drawer
            container={container}
            variant="temporary"
            open={mobileOpen}
            onTransitionEnd={handleDrawerTransitionEnd}
            onClose={handleDrawerClose}
            ModalProps={{
              keepMounted: true,
            }}
            sx={{
              display: { xs: 'block', sm: 'none' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: '40vw' },
            }}
          >
            {drawer}
          </Drawer>
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: 'none', sm: 'block' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: '20vw' },
            }}
            open
          >
            {drawer}
          </Drawer>
        </Box>
        <Box
          component="main"
          sx={{
            width: { sm: `calc(100% - 20vw)` },
          }}
        >
          <Toolbar />
          {/* Main content goes here */}
        </Box>
      </Box>
    </>
  );
}
