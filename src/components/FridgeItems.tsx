import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Divider,
  CircularProgress,
  Alert,
  Paper,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from '@mui/material';
import { ItemDto } from '../types/fridge';
import { fridgeService } from '../services/fridgeService';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import EventIcon from '@mui/icons-material/Event';
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';

interface FridgeItemsProps {
  fridgeId: number;
}

export const FridgeItems: React.FC<FridgeItemsProps> = ({ fridgeId }) => {
  const [items, setItems] = useState<ItemDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [itemToDelete, setItemToDelete] = useState<ItemDto | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const [removeExpiredLoading, setRemoveExpiredLoading] = useState<boolean>(false);

  const fetchItems = async () => {
    try {
      // Ensure fridgeId is a valid number
      if (typeof fridgeId !== 'number' || isNaN(fridgeId)) {
        setError('Invalid fridge ID');
        setLoading(false);
        return;
      }
      
      setLoading(true);
      setError(null);
      const data = await fridgeService.getAllItems(fridgeId);
      setItems(data);
    } catch (err) {
      setError('Failed to fetch items. Please try again later.');
      console.error('Error fetching items:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [fridgeId]);

  // Function to determine if an item is close to expiration
  const getExpirationStatus = (bestBeforeDate: string | null) => {
    if (!bestBeforeDate) return { color: 'default', label: 'No expiration date' };
    
    const today = new Date();
    const expirationDate = new Date(bestBeforeDate);
    const daysUntilExpiration = Math.ceil((expirationDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiration < 0) {
      return { color: 'error', label: 'Expired' };
    } else if (daysUntilExpiration <= 3) {
      return { color: 'error', label: 'Expires soon' };
    } else if (daysUntilExpiration <= 7) {
      return { color: 'warning', label: 'Expires in a week' };
    } else {
      return { color: 'success', label: 'Good' };
    }
  };

  const handleDeleteClick = (item: ItemDto) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    debugger;
    if (!itemToDelete || !itemToDelete.id) return;
    
    try {
      setDeleteLoading(true);
      await fridgeService.removeItemFromFridge(itemToDelete.id);
      setDeleteDialogOpen(false);
      // Refresh the items list
      fetchItems();
    } catch (err) {
      console.error('Error deleting item:', err);
      setError('Failed to delete item. Please try again.');
    } finally {
      setDeleteLoading(false);
      setItemToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  const handleRemoveExpiredItems = async () => {
    try {
      setRemoveExpiredLoading(true);
      setError(null);
      await fridgeService.removeExpiredItems(fridgeId);
      // Refresh the items list
      fetchItems();
    } catch (err) {
      setError('Failed to remove expired items. Please try again later.');
      console.error('Error removing expired items:', err);
    } finally {
      setRemoveExpiredLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box mt={2}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (items.length === 0) {
    return (
      <Box mt={2}>
        <Alert severity="info">No items found in this fridge.</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', maxWidth: 600, margin: '0 auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" component="h2">
          Items in Fridge
        </Typography>
        <Button
          variant="outlined"
          color="error"
          startIcon={<DeleteSweepIcon />}
          onClick={handleRemoveExpiredItems}
          disabled={removeExpiredLoading}
        >
          {removeExpiredLoading ? 'Removing...' : 'Remove Expired Items'}
        </Button>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper elevation={1} sx={{ mt: 2, p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Items in Fridge
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <List>
          {items.map((item, index) => {
            const expirationStatus = getExpirationStatus(item.bestBeforeDate);
            
            return (
              <React.Fragment key={index}>
                <ListItem>
                  <ListItemIcon>
                    <RestaurantIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={item.name}
                    secondary={
                      <Box sx={{ display: 'flex', flexDirection: 'column', mt: 0.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Chip 
                            label={item.size} 
                            size="small" 
                            color="primary" 
                            variant="outlined" 
                          />
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                          <EventIcon fontSize="small" color="action" />
                          <Typography variant="caption" color="text.secondary">
                            {item.bestBeforeDate 
                              ? `Best before: ${new Date(item.bestBeforeDate).toLocaleDateString()}`
                              : 'No expiration date'}
                          </Typography>
                          <Chip 
                            label={expirationStatus.label}
                            size="small"
                            color={expirationStatus.color as any}
                            sx={{ ml: 1 }}
                          />
                        </Box>
                      </Box>
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton 
                      edge="end" 
                      aria-label="delete" 
                      onClick={() => handleDeleteClick(item)}
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
                {index < items.length - 1 && <Divider variant="inset" component="li" />}
              </React.Fragment>
            );
          })}
        </List>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={handleDeleteCancel}
        >
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to remove "{itemToDelete?.name}" from the fridge?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteCancel} disabled={deleteLoading}>
              Cancel
            </Button>
            <Button 
              onClick={handleDeleteConfirm} 
              color="error" 
              variant="contained"
              disabled={deleteLoading}
            >
              {deleteLoading ? <CircularProgress size={24} /> : 'Delete'}
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Box>
  );
}; 