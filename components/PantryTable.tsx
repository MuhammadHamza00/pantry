"use client";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { Edit, Delete, Save, Cancel } from '@mui/icons-material';
import { firestore } from '../../firebase';
import { useEffect, useState } from 'react';
import { Firestore, getDocs, collection, query, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  Typography,
  Grid,
  TextField,
  IconButton,
  Stack,
  Paper
} from '@mui/material';

interface PantryItem {
  id: string;
  name: string;
  category: string;
  description: string;
  expirationDate: string;
  quantity: number;
  imageUrl?: string;
}

export default function PantryTable() {
  const [pantryItems, setPantryItems] = useState<PantryItem[]>([]);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editingData, setEditingData] = useState<Partial<PantryItem>>({});

  useEffect(() => {
    const updatePantry = async () => {
      try {
        const snapshot = await getDocs(query(collection(firestore, 'pantry')));
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as PantryItem[];
        console.log(data);
        setPantryItems(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    updatePantry();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(firestore, 'pantry', id));
      setPantryItems(pantryItems.filter(pantryItem => pantryItem.id !== id));
      alert("Item deleted successfully!");
    } catch (error) {
      console.error("Error deleting item: ", error);
      alert("Error deleting item.");
    }
  };

  const handleEdit = (item: PantryItem) => {
    setEditingItemId(item.id);
    setEditingData(item);
  };

  const handleCancel = () => {
    setEditingItemId(null);
    setEditingData({});
  };

  const handleSave = async () => {
    if (editingItemId && editingData) {
      try {
        await updateDoc(doc(firestore, 'pantry', editingItemId), editingData);
        setPantryItems(pantryItems.map(item =>
          item.id === editingItemId ? { ...item, ...editingData } : item
        ));
        setEditingItemId(null);
        setEditingData({});
        alert("Item updated successfully!");
      } catch (error) {
        console.error("Error updating item: ", error);
        alert("Error updating item.");
      }
    }
  };

  return (
    <Paper sx={{ padding: 8 }}>
      <Grid container spacing={2}>
        {pantryItems.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <Card sx={{ maxWidth: 345, height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="img"
                alt="Item Image"
                height="140"
                image={item.imageUrl || 'path/to/default-image.jpg'}
                title={item.name}
                sx={{ objectFit: 'cover', height: '140px' }} // Set fixed height and cover
              />
              <CardContent
                sx={{ flexGrow: 1, overflowY: 'auto' }} // Make content area scrollable
              >
                {editingItemId === item.id ? (
                  <>
                    <TextField
                      label="Name"
                      value={editingData.name || ''}
                      onChange={(e) => setEditingData({ ...editingData, name: e.target.value })}
                      fullWidth
                      margin="normal"
                    />
                    <TextField
                      label="Category"
                      value={editingData.category || ''}
                      onChange={(e) => setEditingData({ ...editingData, category: e.target.value })}
                      fullWidth
                      margin="normal"
                    />
                    <TextField
                      label="Description"
                      value={editingData.description || ''}
                      onChange={(e) => setEditingData({ ...editingData, description: e.target.value })}
                      fullWidth
                      margin="normal"
                    />
                    <TextField
                      label="Expiration Date"
                      value={editingData.expirationDate || ''}
                      onChange={(e) => setEditingData({ ...editingData, expirationDate: e.target.value })}
                      fullWidth
                      margin="normal"
                    />
                    <TextField
                      label="Quantity"
                      type="number"
                      value={editingData.quantity?.toString() || ''}
                      onChange={(e) => setEditingData({ ...editingData, quantity: parseInt(e.target.value) })}
                      fullWidth
                      margin="normal"
                    />
                  </>
                ) : (
                  <>
                    <Typography gutterBottom variant="h5" component="div">
                      {item.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Category: {item.category}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Description: {item.description}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Expiration Date: {item.expirationDate}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Quantity: {item.quantity}
                    </Typography>
                  </>
                )}
              </CardContent>
              <CardActions>
                {editingItemId === item.id ? (
                  <Stack direction="row" spacing={1}>
                    <IconButton aria-label="save" onClick={handleSave}>
                      <Save />
                    </IconButton>
                    <IconButton aria-label="cancel" onClick={handleCancel}>
                      <Cancel />
                    </IconButton>
                  </Stack>
                ) : (
                  <Stack direction="row" spacing={1}>
                    <IconButton aria-label="edit" onClick={() => handleEdit(item)}>
                      <Edit />
                    </IconButton>
                    <IconButton aria-label="delete" onClick={() => handleDelete(item.id)}>
                      <Delete />
                    </IconButton>
                  </Stack>
                )}
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Paper>

  );
}
