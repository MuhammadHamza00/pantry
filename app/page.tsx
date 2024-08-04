"use client";
import React from 'react';
import { Box, Button, Typography, Toolbar, Grid, Paper } from '@mui/material';
import Sidebar from '../components/sidebar';
import Link from 'next/link';
import { Inventory, AddShoppingCart, Assessment, People } from '@mui/icons-material';
import Googlesingin from '../components/Googlesign';
import bg from '../../public/bgg.jpg'
import Image from 'next/image';

const Home = () => {
  // Function to scroll to the main content
  const scrollToContent = () => {
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Box
        component="main"
        sx={{ flexGrow: 1, minHeight: '100vh' }}
      >
        {/* Cover Section */}
        <Box
          sx={{
            height: '100vh',
            backgroundImage: `url("../../public/logo.png")`, // Replace with your image path
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
          }}
        >
          <Image src={bg} alt="Logo"  height={400}/>
          <Button
            variant="contained"
            color="primary"
            onClick={scrollToContent}
            sx={{ mt: 4 }}
          >
            Get Started
          </Button>
        </Box>

        {/* Main Content */}
        <Box id="main-content" sx={{ p: 3 }} >
          <Toolbar />
          <Typography variant="h4" gutterBottom>
            Welcome to the Pantry Tracker!
          </Typography>
          <Typography variant="h6" gutterBottom>
            Manage your pantry efficiently and stay on top of your inventory.
          </Typography>

          <Grid container spacing={3} sx={{ mt: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
                <Inventory sx={{ fontSize: 40, color: '#4caf50' }} />
                <Typography variant="h6" sx={{ mt: 2 }}>
                  Track Inventory
                </Typography>
                <Typography variant="body1">
                  Keep an eye on what in your pantry and never run out of essentials.
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
                <AddShoppingCart sx={{ fontSize: 40, color: '#ff9800' }} />
                <Typography variant="h6" sx={{ mt: 2 }}>
                  Shopping Lists
                </Typography>
                <Typography variant="body1">
                  Create and manage shopping lists with ease.
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper elevation={3} sx={{ p: 3, textAlign: 'center'}}>
                <Assessment sx={{ fontSize: 40, color: '#2196f3' }} />
                <Typography variant="h6" sx={{ mt: 2 }}>
                  Analytics
                </Typography>
                <Typography variant="body1">
                  Get insights into your pantry usage and optimize your shopping.
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
                <People sx={{ fontSize: 40, color: '#f44336' }} />
                <Typography variant="h6" sx={{ mt: 2 }}>
                  User Management
                </Typography>
                <Typography variant="body1">
                  Manage multiple users and share your pantry with family members.
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          <Box sx={{ mt: 5, textAlign: 'center' }}>
            <Box sx={{ textAlign: 'center', m: 2 }}>
              <Googlesingin />
            </Box>
            <Box sx={{ textAlign: 'center', m: 2 }}>
              <Button
                variant="outlined"
                color="secondary"
                sx={{ margin: '0 8px' }}
              >
                <Link href={'https://www.linkedin.com/in/mdothamza/'}>LinkedIn</Link>
              </Button>

              <Button
                variant="outlined"
                color="secondary"
                sx={{ margin: '0 8px' }}
              >
                <Link href={'https://github.com/MuhammadHamza00/'}>Github</Link>
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Home;
