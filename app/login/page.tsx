'use client';

import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box, Paper } from '@mui/material';
import { auth } from '../../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert('Login successful!');
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
        marginTop: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Paper elevation={3} sx={{ padding: 4, borderRadius: 2, width: '100%' }}>
        <Typography variant="h4" gutterBottom>
          Welcome Back! 👋
        </Typography>
        <Typography variant="body1" color="textSecondary" paragraph>
          Please log in to continue using our pantry app. Glad to see you again! 😊
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
            onClick={handleLogin}
            sx={{
              mt: 2,
              padding: '10px 0',
              fontWeight: 'bold',
              fontSize: '16px',
            }}
          >
            Login
          </Button>
        </Box>
      </Paper>
      <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
        Dont have an account? <Button variant="text" color="primary">Sign Up</Button>
      </Typography>
    </Container>
  );
};

export default Login;
