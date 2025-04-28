import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  CircularProgress, 
  Alert,
  Divider,
  List,
  ListItem,
  ListItemText,
  Paper,
  CardActions,
  Button
} from '@mui/material';
import { FridgeDto, CompartmentType } from '../types/fridge';
import { fridgeService } from '../services/fridgeService';
import { AddItemToFridge } from './AddItemToFridge';
import { FridgeItems } from './FridgeItems';

export const FridgeList: React.FC = () => {
  const [fridges, setFridges] = useState<FridgeDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedFridgeId, setExpandedFridgeId] = useState<number | null>(null);

  const fetchFridges = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fridgeService.getAllFridges();
      setFridges(data);
    } catch (err) {
      setError('Failed to fetch fridges. Please try again later.');
      console.error('Error fetching fridges:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFridges();
  }, []);

  const handleItemAdded = () => {
    // Refresh the fridges list to show updated data
    fetchFridges();
  };

  const toggleFridgeExpansion = (fridgeId: number) => {
    if (expandedFridgeId === fridgeId) {
      setExpandedFridgeId(null);
    } else {
      setExpandedFridgeId(fridgeId);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
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

  if (fridges.length === 0) {
    return (
      <Box mt={2}>
        <Alert severity="info">No fridges found. Create a new fridge to get started.</Alert>
      </Box>
    );
  }

  return (
    <Box mt={4}>
      <Typography variant="h4" gutterBottom>
        Your Fridges
      </Typography>
      <Box 
        display="flex" 
        flexWrap="wrap" 
        gap={3}
        sx={{ 
          '& > *': { 
            flexBasis: { xs: '100%', md: 'calc(50% - 12px)', lg: 'calc(33.333% - 16px)' },
            maxWidth: { xs: '100%', md: 'calc(50% - 12px)', lg: 'calc(33.333% - 16px)' }
          } 
        }}
      >
        {fridges.map((fridge) => (
          <Card elevation={3} key={fridge.id}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                {fridge.name}
              </Typography>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                Total Capacity: {fridge.totalCapacity}L
              </Typography>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                Compartments:
              </Typography>
              <List>
                {Object.entries(fridge.compartments).map(([type, compartment]) => (
                  <ListItem key={type}>
                    <ListItemText
                      primary={`${type.charAt(0) + type.slice(1).toLowerCase()}`}
                      secondary={`Temperature: ${compartment.tempFromTo[0]}°C to ${compartment.tempFromTo[1]}°C | Capacity: ${compartment.capacity}L`}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
            <CardActions>
              <AddItemToFridge 
                fridgeId={fridge.id} 
                fridgeName={fridge.name} 
                onItemAdded={handleItemAdded} 
              />
              <Button 
                size="small" 
                onClick={() => toggleFridgeExpansion(fridge.id)}
              >
                {expandedFridgeId === fridge.id ? 'Hide Items' : 'Show Items'}
              </Button>
            </CardActions>
            {expandedFridgeId === fridge.id && (
              <Box sx={{ p: 2, pt: 0 }}>
                <FridgeItems fridgeId={fridge.id} key={`items-${fridge.id}`} />
              </Box>
            )}
          </Card>
        ))}
      </Box>
    </Box>
  );
}; 