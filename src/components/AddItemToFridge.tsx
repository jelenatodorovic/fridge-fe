import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Alert,
  CircularProgress
} from '@mui/material';
import { ItemDto, ItemSize } from '../types/fridge';
import { fridgeService } from '../services/fridgeService';

interface AddItemToFridgeProps {
  fridgeId: number;
  fridgeName: string;
  onItemAdded: () => void;
}

export const AddItemToFridge: React.FC<AddItemToFridgeProps> = ({ fridgeId, fridgeName, onItemAdded }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  // Form state
  const [itemName, setItemName] = useState('');
  const [itemSize, setItemSize] = useState<ItemSize>(ItemSize.M);
  const [temperature, setTemperature] = useState(4); // Default fridge temperature
  const [bestBeforeDate, setBestBeforeDate] = useState<string>('');
  
  const handleClickOpen = () => {
    setOpen(true);
  };
  
  const handleClose = () => {
    setOpen(false);
    // Reset form state
    setItemName('');
    setItemSize(ItemSize.M);
    setTemperature(4);
    setBestBeforeDate('');
    setError(null);
    setSuccess(false);
  };
  
  const handleSubmit = async () => {
    if (!itemName.trim()) {
      setError('Item name is required');
      return;
    }
    
    // Ensure temperature is a valid number
    const validTemperature = isNaN(temperature) ? 4 : temperature;
    
    try {
      setLoading(true);
      setError(null);
      
      const newItem: ItemDto = {
        name: itemName,
        size: itemSize,
        bestBeforeDate: bestBeforeDate || null
      };
      
      await fridgeService.addItemToFridge(fridgeId, newItem, validTemperature);
      
      setSuccess(true);
      setTimeout(() => {
        handleClose();
        onItemAdded();
      }, 1500);
    } catch (err) {
      console.error('Error adding item:', err);
      setError('Failed to add item. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <>
      <Button 
        variant="contained" 
        color="primary" 
        onClick={handleClickOpen}
        size="small"
      >
        Add Item
      </Button>
      
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Add Item to {fridgeName}</DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Item added successfully!
            </Alert>
          )}
          
          <Box sx={{ mt: 2 }}>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Item Name"
              type="text"
              fullWidth
              variant="outlined"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              disabled={loading}
            />
            
            <FormControl fullWidth margin="dense" disabled={loading}>
              <InputLabel id="size-label">Item Size</InputLabel>
              <Select
                labelId="size-label"
                id="size"
                value={itemSize}
                label="Item Size"
                onChange={(e) => setItemSize(e.target.value as ItemSize)}
              >
                <MenuItem value={ItemSize.XS}>Extra Small (XS)</MenuItem>
                <MenuItem value={ItemSize.S}>Small (S)</MenuItem>
                <MenuItem value={ItemSize.M}>Medium (M)</MenuItem>
                <MenuItem value={ItemSize.L}>Large (L)</MenuItem>
                <MenuItem value={ItemSize.XL}>Extra Large (XL)</MenuItem>
              </Select>
            </FormControl>
            
            <TextField
              margin="dense"
              id="bestBeforeDate"
              label="Best Before Date"
              type="date"
              fullWidth
              variant="outlined"
              value={bestBeforeDate}
              onChange={(e) => setBestBeforeDate(e.target.value)}
              disabled={loading}
              InputLabelProps={{
                shrink: true,
              }}
            />
            
            <TextField
              margin="dense"
              id="temperature"
              label="Storage Temperature (°C)"
              type="number"
              fullWidth
              variant="outlined"
              value={temperature}
              onChange={(e) => setTemperature(Number(e.target.value))}
              disabled={loading}
              inputProps={{ step: 0.5 }}
            />
            
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              Note: The system will find the appropriate compartment based on the temperature.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            color="primary"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Add Item'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}; 