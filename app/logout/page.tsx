'use client';

import React from 'react';
import { Button, Container, Typography, Box } from '@mui/material';
import { auth } from '../../firebase';
import { signOut } from 'firebase/auth';

const Logout = () => {
  const handleLogout = () => {
    signOut(auth)
      .then(() => alert('Logout successful!'))
      .catch((error) => console.error(error));
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        marginTop: 10, // Reduced margin to adjust content
        textAlign: 'center', // Center align content
        padding: 4,
        borderRadius: 2,
        backgroundColor: '#f0f0f0', // Light grey background
      }}
    >
      <Typography variant="h4" gutterBottom>
        👋 See you soon!
      </Typography>
      <Typography variant="body1" gutterBottom>
        Thank you for using our pantry app. We hope to see you back soon. Click the button below to logout.
      </Typography>
      <Box mt={4}>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleLogout}
          sx={{
            padding: '10px 20px',
            fontSize: '16px',
          }}
        >
          Logout
        </Button>
      </Box>
    </Container>
  );
};

export default Logout;
