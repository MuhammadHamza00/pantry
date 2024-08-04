"use client";
// src/pages/search-items.tsx
import React, { useEffect, useState } from 'react';
import {
    Box, Button, TextField, Select, MenuItem, FormControl, InputLabel,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Dialog, DialogActions, DialogContent, DialogTitle, IconButton
} from '@mui/material';
import { collection, getDocs, query, where, doc, updateDoc, deleteDoc, DocumentData, Query } from 'firebase/firestore';
import { firestore } from '../../firebase'; // Adjust the import according to your file structure
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

interface Item {
    id: string;
    name: string;
    category: string;
    description: string;
    expirationDate: string;
    quantity: number;
}

const SearchItemsPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [category, setCategory] = useState('');
    const [items, setItems] = useState<Item[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [selectedItem, setSelectedItem] = useState<Item | null>(null);
    const [openEditDialog, setOpenEditDialog] = useState(false);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const querySnapshot = await getDocs(collection(firestore, 'categories'));
                const categoriesData: string[] = querySnapshot.docs.map(doc => doc.data().name);
                setCategories(categoriesData);
            } catch (error) {
                console.error("Error fetching categories: ", error);
            }
        };
        fetchCategories();
    }, []);

    const handleSearch = async () => {
        try {
            let q: Query<DocumentData> = collection(firestore, 'pantry');
            if (searchTerm) {
                q = query(q, where('name', '>=', searchTerm), where('name', '<=', searchTerm + '\uf8ff'));
            }
            if (category) {
                q = query(q, where('category', '==', category));
            }

            const querySnapshot = await getDocs(q);
            const itemsData: Item[] = querySnapshot.docs.map(doc => ({
                id: doc.id,
                name: doc.data().name,
                category: doc.data().category,
                description: doc.data().description,
                expirationDate: doc.data().expirationDate,
                quantity: doc.data().quantity,
            }));
            setItems(itemsData);
        } catch (error) {
            console.error("Error fetching items: ", error);
        }
    };

    const handleEdit = (item: Item) => {
        setSelectedItem(item);
        setOpenEditDialog(true);
    };

    const handleEditSave = async () => {
        if (selectedItem) {
            try {
                await updateDoc(doc(firestore, 'pantry', selectedItem.id), {
                    name: selectedItem.name,
                    category: selectedItem.category,
                    description: selectedItem.description,
                    expirationDate: selectedItem.expirationDate,
                    quantity: selectedItem.quantity,
                });
                setOpenEditDialog(false);
                setSelectedItem(null);
                handleSearch(); // Refresh the item list
            } catch (error) {
                console.error("Error updating document: ", error);
            }
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteDoc(doc(firestore, 'pantry', id));
            handleSearch(); // Refresh the item list
        } catch (error) {
            console.error("Error deleting document: ", error);
        }
    };

    return (
        <Box sx={{ p: 3, marginTop:"80px",ml:'12vw' }}>
            {/* Search and Filters */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <TextField
                    label="Search Items"
                    variant="outlined"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <FormControl variant="outlined" sx={{ minWidth: 120 }}>
                    <InputLabel>Category</InputLabel>
                    <Select
                        value={category}
                        onChange={(e) => setCategory(e.target.value as string)}
                        label="Category"
                    >
                        <MenuItem value=""><em>None</em></MenuItem>
                        {categories.map((cat, index) => (
                            <MenuItem key={index} value={cat}>{cat}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Button variant="contained" onClick={handleSearch}>Search</Button>
            </Box>

            {/* Table with Items */}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Category</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Expiration Date</TableCell>
                            <TableCell>Quantity</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {items.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell>{item.id}</TableCell>
                                <TableCell>{item.name}</TableCell>
                                <TableCell>{item.category}</TableCell>
                                <TableCell>{item.description}</TableCell>
                                <TableCell>{item.expirationDate}</TableCell>
                                <TableCell>{item.quantity}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleEdit(item)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleDelete(item.id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Edit Dialog */}
            <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
                <DialogTitle>Edit Item</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            label="Name"
                            variant="outlined"
                            value={selectedItem?.name || ''}
                            onChange={(e) => setSelectedItem({ ...selectedItem!, name: e.target.value })}
                        />
                        <FormControl variant="outlined" fullWidth>
                            <InputLabel>Category</InputLabel>
                            <Select
                                value={selectedItem?.category || ''}
                                onChange={(e) => setSelectedItem({ ...selectedItem!, category: e.target.value as string })}
                                label="Category"
                            >
                                {categories.map((cat, index) => (
                                    <MenuItem key={index} value={cat}>{cat}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <TextField
                            label="Description"
                            variant="outlined"
                            value={selectedItem?.description || ''}
                            onChange={(e) => setSelectedItem({ ...selectedItem!, description: e.target.value })}
                        />
                        <TextField
                            label="Expiration Date"
                            variant="outlined"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            value={selectedItem?.expirationDate || ''}
                            onChange={(e) => setSelectedItem({ ...selectedItem!, expirationDate: e.target.value })}
                        />
                        <TextField
                            label="Quantity"
                            variant="outlined"
                            type="number"
                            value={selectedItem?.quantity || 0}
                            onChange={(e) => setSelectedItem({ ...selectedItem!, quantity: Number(e.target.value) })}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
                    <Button onClick={handleEditSave} variant="contained">Save</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default SearchItemsPage;
