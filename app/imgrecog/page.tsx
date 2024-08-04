"use client";
import React, { useState, useRef } from 'react';
import Webcam from 'react-webcam';
import { Button, Typography, Box } from '@mui/material';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';
import { firestore } from '../../firebase'; // Adjust the import path

const CameraPage: React.FC = () => {
  const webcamRef = useRef<Webcam>(null);
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<string | null>(null);
  const [itemStored, setItemStored] = useState<boolean>(false); // New state variable for item stored message

  const handleTakePhoto = async () => {
    setLoading(true);
    if (webcamRef.current) {
      const photo = webcamRef.current.getScreenshot();
      setImage(photo || null);

      if (photo) {
        try {
          // Convert image to Blob for uploading
          const response = await fetch(photo);
          const blob = await response.blob();

          // Upload image to Firebase
          const storage = getStorage();
          const storageRef = ref(storage, `images/${Date.now()}.jpg`);
          await uploadBytes(storageRef, blob);
          const imageURL = await getDownloadURL(storageRef);

          // Classify image using Clarifai
          await classifyImage(imageURL);
        } catch (error) {
          console.error('Error uploading image:', error);
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    }
  };

  const classifyImage = async (imageURL: string) => {
    const PAT = process.env.NEXT_PUBLIC_CLARIFAI_PAT; // Replace with your actual PAT
    const USER_ID = process.env.NEXT_PUBLIC_CLARIFAI_USER_ID;
    const APP_ID = process.env.NEXT_PUBLIC_CLARIFAI_APP_ID;
    const MODEL_ID = process.env.NEXT_PUBLIC_CLARIFAI_MODEL_ID;
    const MODEL_VERSION_ID = process.env.NEXT_PUBLIC_CLARIFAI_MODEL_VERSION_ID;

    const raw = JSON.stringify({
      "user_app_id": {
        "user_id": USER_ID,
        "app_id": APP_ID
      },
      "inputs": [
        {
          "data": {
            "image": {
              "url": imageURL
            }
          }
        }
      ]
    });

    const requestOptions = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Key ' + PAT,
        'Content-Type': 'application/json',
      },
      body: raw
    };

    try {
      const response = await fetch(`https://api.clarifai.com/v2/models/${MODEL_ID}/versions/${MODEL_VERSION_ID}/outputs`, requestOptions);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();
      console.log(result);

      // Extract the classification result
      const concepts = result.outputs[0].data.concepts;
      const mostConfident = concepts[0]?.name || 'Unknown';
      setResult(mostConfident);

      // Store the result in Firebase
      await addDoc(collection(firestore, 'pantry'), {
        name: mostConfident,
        imageURL,
      });
      // Set itemStored to true
      setItemStored(true);
      setLoading(false);

    } catch (error) {
      console.error('Error classifying image:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" padding={2}>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width="50%"
        height="auto"
      />
      <Button onClick={handleTakePhoto} variant="contained" color="primary" sx={{ marginTop: 2 }}>
        Take Photo
      </Button>
      {loading && <Typography>Loading...</Typography>}
      {image && <img src={image} alt="Taken photo" style={{ marginTop: 20, maxWidth: '100%' }} />}
      {result && (
        <Typography variant="h6" sx={{ marginTop: 2 }}>
          Classification Result: {result}
        </Typography>
      )}
      {itemStored && (
        <Typography variant="h6" sx={{ marginTop: 2, color: 'green' }}>
          Item has been successfully stored!
        </Typography>
      )}
    </Box>
  );
};

export default CameraPage;
