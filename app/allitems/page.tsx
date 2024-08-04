import React from 'react';
import PantryTable from '../../components/PantryTable';
import { Box, Typography } from '@mui/material';

const AllItemsPage  = () => {
  return (
    <Box
      width="100%"
      height="100vh"
      display="flex"
      flexDirection="column"
      alignItems="center"
      bgcolor="background.default"
    >
      <Box
        width="100%"
        height="30vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Typography variant="h3" component="h2">
          All Pantry Items
        </Typography>
      </Box>

      <Box
        width="80%"
        maxWidth="1200px"
        height="auto"
        marginTop="20px"
      >
        <PantryTable />
      </Box>
    </Box>
  );
};

export default AllItemsPage ;
