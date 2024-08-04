"use client";
import React, { useState } from 'react';
import { TextField, Button, CircularProgress, Snackbar, Alert, Box, Typography } from '@mui/material';
import {
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, IconButton
  } from '@mui/material';
import CategoryTable from '@/components/CategoryTable';
import { collection, addDoc } from 'firebase/firestore';
import { firestore } from '../../firebase'; // Adjust the import path as necessary

const AddCategoryForm = () => {
  const [categoryName, setCategoryName] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(firestore, 'categories'), {
        name: categoryName,
      });
      setAlertMessage('Category added successfully!');
      setAlertSeverity('success');
      setSnackbarOpen(true);
      setCategoryName(''); // Clear the input field
    } catch (error) {
      console.error("Error adding category: ", error);
      setAlertMessage('Failed to add category.');
      setAlertSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" padding={10}>
      <Typography variant="h4" gutterBottom>
        Add New Category
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        display="flex"
        flexDirection="column"
        alignItems="center"
        width="100%"
        maxWidth="400px"
      >
        <TextField
          label="Category Name"
          variant="outlined"
          margin="normal"
          fullWidth
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          required
        />
        <Box position="relative" width="100%">
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
          >
            {loading ? 'Adding...' : 'Add Category'}
          </Button>
          {loading && (
            <CircularProgress
              size={24}
              sx={{
                color: 'primary.main',
                position: 'absolute',
                top: '50%',
                left: '50%',
                marginTop: '-12px',
                marginLeft: '-12px',
              }}
            />
          )}
        </Box>
      </Box>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          sx={{ width: '100%' }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
      <CategoryTable/>
    </Box>
  );
};

export default AddCategoryForm;
