// GoogleSignIn.tsx
"use client";
import { useState } from 'react';
import { Button, CircularProgress, Snackbar, Alert } from '@mui/material';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../firebase'; // Adjust the import path as necessary

const GoogleSignIn = () => {
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      // Do something with the user (e.g., store user details in your app state or database)
      console.log('User:', user);
      setAlertMessage('Successfully signed in!');
      setAlertSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error signing in with Google:', error);
      setAlertMessage('Failed to sign in.');
      setAlertSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Button
        variant="contained"
        color="primary"
        onClick={handleGoogleSignIn}
        disabled={loading}
        startIcon={loading ? <CircularProgress size={24} /> : null}
      >
        {loading ? 'Signing in...' : 'Sign in with Google'}
      </Button>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        sx={{ marginTop: 2 }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          sx={{ width: '100%' }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default GoogleSignIn;
