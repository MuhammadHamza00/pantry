import React, { useEffect, useState } from 'react';
import {
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { firestore } from '../../firebase'; // Adjust the import according to your file structure

// Define a TypeScript interface for the category data structure
interface Category {
    id: string;
    name: string;
}

const CategoryTable = () => {
    const [categories, setCategories] = useState<Category[]>([]); // Explicitly set the type

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const querySnapshot = await getDocs(collection(firestore, 'categories'));
                const categoriesData: Category[] = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    name: doc.data().name,
                }));
                setCategories(categoriesData);
            } catch (error) {
                console.error("Error fetching categories: ", error);
            }
        };

        fetchCategories();
    }, []);

    const handleDelete = async (id: string) => {
        try {
            await deleteDoc(doc(firestore, 'categories', id));
            setCategories(categories.filter(category => category.id !== id));
            alert("Category deleted successfully!");
        } catch (error) {
            console.error("Error deleting category: ", error);
            alert("Error deleting category.");
        }
    };

    return (
        <TableContainer component={Paper} sx={{ ml: '10vw' }}>
            <Table >
                <TableHead>
                    <TableRow>
                        <TableCell>Category ID</TableCell>
                        <TableCell>Category Name</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {categories.map((category) => (
                        <TableRow key={category.id}>
                            <TableCell>{category.id}</TableCell>
                            <TableCell>{category.name}</TableCell>
                            <TableCell>
                                <IconButton
                                    aria-label="delete"
                                    onClick={() => handleDelete(category.id)}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default CategoryTable;
