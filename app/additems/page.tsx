"use client";
import { useState, useEffect, ChangeEvent } from 'react';
import {
    Box,
    TextField,
    MenuItem,
    Button,
    Typography,
    CircularProgress,
    Snackbar,
    Alert,
} from '@mui/material';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { firestore } from '../../firebase'; // Adjust the import path as necessary
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const PantryForm = () => {
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [expirationDate, setExpirationDate] = useState('');
    const [quantity, setQuantity] = useState('');
    const [categories, setCategories] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('success');
    const [image, setImage] = useState<File | null>(null);
    const [imageURL, setImageURL] = useState('');
    const storage = getStorage();

    useEffect(() => {
        const fetchCategories = async () => {
            const categoriesCollection = collection(firestore, 'categories');
            const categorySnapshot = await getDocs(categoriesCollection);
            const categoryList = categorySnapshot.docs.map(doc => doc.data().name);
            setCategories(categoryList);
        };

        fetchCategories();
    }, []);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const target = e.target as HTMLInputElement;
        setImage(target.files ? target.files[0] : null);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);

        let imageUrl = '';
        if (image) {
            try {
                const imageRef = ref(storage, `pantry/${image.name}`);
                await uploadBytes(imageRef, image);
                imageUrl = await getDownloadURL(imageRef);
                setImageURL(imageUrl);
            } catch (error) {
                console.error('Error uploading image: ', error);
                setAlertMessage('Failed to upload image.');
                setAlertSeverity('error');
                setSnackbarOpen(true);
                setLoading(false);
                return;
            }
        }

        try {
            await addDoc(collection(firestore, 'pantry'), {
                name,
                category,
                description,
                expirationDate,
                quantity,
                imageUrl,
            });
            setAlertMessage('Item added successfully!');
            setAlertSeverity('success');
            setSnackbarOpen(true);
            // clear the data
            setName('');
            setCategory('');
            setDescription('');
            setExpirationDate('');
            setQuantity('');
            setImage(null);
            setImageURL('');
        } catch (error) {
            console.error('Error adding document: ', error);
            setAlertMessage('Failed to add item.');
            setAlertSeverity('error');
            setSnackbarOpen(true);
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <Box display="flex" flexDirection="column" alignItems="center" margin="2rem"marginTop="20vh">
            <Typography variant="h4" gutterBottom color="primary">
                Add New Pantry Item
            </Typography>
            <Box
                component="form"
                onSubmit={handleSubmit}
                display="flex"
                flexDirection="column"
                alignItems="center"
                width="100%"
                maxWidth="600px"
                sx={{
                    backgroundColor: 'background.paper',
                    borderRadius: 2,
                    boxShadow: 3,
                    padding: 3,
                }}
            >
                <TextField
                    label="Name"
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    sx={{
                        marginBottom: 2,
                    }}
                />
                <TextField
                    label="Category"
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                    sx={{
                        marginBottom: 2,
                    }}
                >
                    {categories.map((cat, index) => (
                        <MenuItem key={index} value={cat}>
                            {cat}
                        </MenuItem>
                    ))}
                </TextField>
                <Button
                    variant="contained"
                    component="label"
                    sx={{ marginBottom: 2 }}
                >
                    Upload File
                    <input
                        type="file"
                        hidden
                        onChange={handleFileChange}
                    />
                </Button>

                <TextField
                    label="Description"
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    multiline
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    sx={{
                        marginBottom: 2,
                    }}
                />
                <TextField
                    label="Expiration Date"
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    type="date"
                    value={expirationDate}
                    onChange={(e) => setExpirationDate(e.target.value)}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    sx={{
                        marginBottom: 2,
                    }}
                />
                <TextField
                    label="Quantity"
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    required
                    sx={{
                        marginBottom: 2,
                    }}
                />
                <Box position="relative" width="100%">
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        disabled={loading}
                        sx={{
                            padding: 1.5,
                            fontSize: '1rem',
                        }}
                    >
                        {loading ? 'Adding...' : 'Add Item'}
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
                sx={{ marginTop: 2 }}
            >
                <Alert
                    onClose={() => setSnackbarOpen(false)}
                    sx={{ width: '100%' }}
                >
                    {alertMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default PantryForm;
