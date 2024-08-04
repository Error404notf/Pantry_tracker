'use client';

import { useState, useEffect } from 'react';
import { firestore } from '@/firebase';
import { Box, Modal, Typography, Stack, TextField, Button, IconButton } from '@mui/material';
import { getDocs, query, collection, doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [currentItem, setCurrentItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch and update inventory
  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      });
    });
    setInventory(inventoryList);
  };

  // Add or update an item
  const handleSubmit = async () => {
    const docRef = doc(collection(firestore, 'inventory'), itemName);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }
    await updateInventory();
    setItemName('');
    handleClose();
  };

  // Remove an item
  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }
    await updateInventory();
  };

  // Handle open modal
  const handleOpen = (item) => {
    if (item) {
      setCurrentItem(item);
      setItemName(item.name);
    } else {
      setCurrentItem(null);
      setItemName('');
    }
    setOpen(true);
  };

  // Handle close modal
  const handleClose = () => setOpen(false);

  // Search/filter items
  const filteredInventory = inventory.filter(({ name }) =>
    name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    updateInventory();
  }, []);

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      gap={2}
      p={2}
    >
      <Modal
        open={open}
        onClose={handleClose}
      >
        <Box
          position="absolute"
          top="50%"
          left="50%"
          width={400}
          bgcolor="white"
          border="2px solid #000"
          boxShadow={24}
          p={4}
          display={'flex'}
          flexDirection="column"
          gap={3}
          sx={{ transform: "translate(-50%,-50%)" }}
        >
          <Typography variant="h6">{currentItem ? 'Update Item' : 'Add Item'}</Typography>
          <TextField
            variant='outlined'
            fullWidth
            label="Item Name"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
          />
          <Button
            variant="contained"
            onClick={handleSubmit}
          >
            {currentItem ? 'Update' : 'Add'}
          </Button>
        </Box>
      </Modal>

      <Stack direction="row" spacing={2} alignItems="center" mb={2}>
        <TextField
          variant="outlined"
          label="Search Items"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            endAdornment: (
              <IconButton>
                <SearchIcon />
              </IconButton>
            ),
          }}
        />
        <Button variant="contained" onClick={() => handleOpen()}>
          Add New Item
        </Button>
      </Stack>

      <Box border='1px solid #333'>
        <Box
          width="800px"
          height="100px"
          bgcolor="#ADD8E6"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Typography variant='h2' color='#333'>Inventory Items</Typography>
        </Box>
      </Box>

      <Stack width="800px" spacing={2} overflow="auto">
        {filteredInventory.map(({ name, quantity }) => (
          <Box
            key={name}
            width="100%"
            minHeight="150px"
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            bgcolor="#f0f0f0"
            padding={3}
            borderRadius={1}
          >
            <Typography variant="h4" color="#333" textAlign="center" flex={1}>
              {name.charAt(0).toUpperCase() + name.slice(1)}
            </Typography>
            <Typography variant='h5' color='#333' textAlign='center' flex={1}>
              {quantity}
            </Typography>
            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                color="success"
                onClick={() => handleOpen({ name })}
              >
                <EditIcon />
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={() => removeItem(name)}
              >
                <DeleteIcon />
              </Button>
            </Stack>
          </Box>
        ))}
      </Stack>
    </Box>
  );
}
