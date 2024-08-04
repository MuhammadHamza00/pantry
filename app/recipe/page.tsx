"use client";
import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Card, CardContent, CircularProgress } from '@mui/material';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { firestore } from '../../firebase'; // Adjust the import path as necessary

const OPENROUTER_API_KEY = process.env.NEXT_PUBLIC_FIREBASE_LLAMA_KEY;

const RecipesPage = () => {
  const [pantryItems, setPantryItems] = useState<{ name: string; amount: number }[]>([]);
  const [recipes, setRecipes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingItems, setFetchingItems] = useState(true);

  useEffect(() => {
    const fetchPantryItems = async () => {
      try {
        const pantryCollection = collection(firestore, 'pantry');
        const now = new Date().toISOString().split('T')[0]; // Current date in YYYY-MM-DD format
        const q = query(pantryCollection, where('expirationDate', '>=', now));
        const querySnapshot = await getDocs(q);
        const items: { name: string; amount: number }[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          items.push({ name: data.name, amount: data.quantity });
        });
        setPantryItems(items);
      } catch (error) {
        console.error('Error fetching pantry items: ', error);
      } finally {
        setFetchingItems(false);
      }
    };

    fetchPantryItems();
  }, []);

  const generateRecipes = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "model": "meta-llama/llama-3.1-8b-instruct:free",
          "messages": [
            { "role": "user", "content": `Generate one recipe using the following ingredients: ${pantryItems.map(item => `${item.amount} ${item.name}`).join(', ')} and explain it in 5 lines.` },
          ],
        }),
      });
      const data = await response.json();
      setRecipes(data.choices[0].message.content.split('\n')); // Adjust this based on API response format
    } catch (error) {
      console.error('Error generating recipes: ', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ ml: '15vw',mt:'20vh' }}>
      <Typography variant="h4" gutterBottom>
        Pantry Recipe Generator
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={generateRecipes}
        disabled={loading || fetchingItems}
      >
        {loading ? <CircularProgress size={24} /> : 'Generate Recipes'}
      </Button>

      <Box sx={{ marginTop: 3 }}>
        {fetchingItems ? (
          <Typography>Loading pantry items...</Typography>
        ) : (
          pantryItems.length === 0 ? (
            <Typography>No non-expired items in the pantry.</Typography>
          ) : (
            <Typography variant="h6">Pantry Items:</Typography>
          )
        )}
        {pantryItems.map((item, index) => (
          <Typography key={index}>{item.amount} {item.name}</Typography>
        ))}
      </Box>

      {recipes.length > 0 && (
        <Box sx={{ marginTop: 3 }}>
          <Typography variant="h6">Generated Recipes:</Typography>
          {recipes.map((recipe, index) => (
            <Card key={index} sx={{ marginBottom: 2 }}>
              <CardContent>
                <Typography variant="body1">{recipe}</Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default RecipesPage;
