'use client';

import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box, Paper } from '@mui/material';
import { auth } from '../../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSignup = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert('Signup successful!');
    } catch (err) {
      if (err instanceof FirebaseError) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred.');
      }
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        marginTop: 10, // Adjusted for a more balanced look
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Paper elevation={3} sx={{ padding: 4, borderRadius: 2, width: '100%' }}>
        <Typography variant="h4" gutterBottom>
          ✨ Join Us!
        </Typography>
        <Typography variant="body1" color="textSecondary" paragraph>
          Sign up and start managing your pantry with ease. Its quick and easy! 🚀
        </Typography>
        <Box component="form" sx={{ mt: 2 }}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            variant="outlined"
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            variant="outlined"
          />
          {error && <Typography color="error">{error}</Typography>}
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleSignup}
            sx={{
              mt: 2,
              padding: '10px 0',
              fontWeight: 'bold',
              fontSize: '16px',
            }}
          >
            Sign Up
          </Button>
        </Box>
      </Paper>
      <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
        Already have an account? <Button variant="text" color="primary">Login</Button>
      </Typography>
    </Container>
  );
};

export default Signup;
