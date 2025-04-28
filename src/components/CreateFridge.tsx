import React, { useState } from 'react';
import { Button, FormControl, InputLabel, MenuItem, Select, Typography, Box, Paper } from '@mui/material';
import { FridgeType, FridgeSize, FridgeDto } from '../types/fridge';
import { fridgeService } from '../services/fridgeService';

export const CreateFridge: React.FC = () => {
    const [selectedType, setSelectedType] = useState<FridgeType>(FridgeType.BASIC);
    const [selectedSize, setSelectedSize] = useState<FridgeSize>(FridgeSize.M);
    const [createdFridge, setCreatedFridge] = useState<FridgeDto | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleCreateFridge = async () => {
        try {
            setError(null);
            const fridge = await fridgeService.createFridgeByTypeAndSize(selectedType, selectedSize);
            setCreatedFridge(fridge);
        } catch (err) {
            setError('Failed to create fridge. Please try again.');
            console.error('Error creating fridge:', err);
        }
    };

    return (
        <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4, p: 2 }}>
            <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h5" component="h2" gutterBottom>
                    Create New Fridge
                </Typography>
                
                <FormControl fullWidth sx={{ mb: 3 }}>
                    <InputLabel id="fridge-type-label">Fridge Type</InputLabel>
                    <Select
                        labelId="fridge-type-label"
                        value={selectedType}
                        label="Fridge Type"
                        onChange={(e) => setSelectedType(e.target.value as FridgeType)}
                    >
                        <MenuItem value={FridgeType.BASIC}>Basic Fridge</MenuItem>
                        <MenuItem value={FridgeType.WITH_FREEZER}>Fridge with Freezer</MenuItem>
                        <MenuItem value={FridgeType.PREMIUM}>Premium Fridge</MenuItem>
                    </Select>
                </FormControl>

                <FormControl fullWidth sx={{ mb: 3 }}>
                    <InputLabel id="fridge-size-label">Fridge Size</InputLabel>
                    <Select
                        labelId="fridge-size-label"
                        value={selectedSize}
                        label="Fridge Size"
                        onChange={(e) => setSelectedSize(e.target.value as FridgeSize)}
                    >
                        <MenuItem value={FridgeSize.S}>Small</MenuItem>
                        <MenuItem value={FridgeSize.M}>Medium</MenuItem>
                        <MenuItem value={FridgeSize.L}>Large</MenuItem>
                    </Select>
                </FormControl>

                <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={handleCreateFridge}
                    fullWidth
                >
                    Create Fridge
                </Button>

                {error && (
                    <Typography color="error" sx={{ mt: 2 }}>
                        {error}
                    </Typography>
                )}

                {createdFridge && (
                    <Box sx={{ mt: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Created Fridge Details:
                        </Typography>
                        <Typography>
                            Name: {createdFridge.name}
                        </Typography>
                        <Typography>
                            Total Capacity: {createdFridge.totalCapacity}L
                        </Typography>
                        <Typography>
                            Compartments: {Object.keys(createdFridge.compartments).join(', ')}
                        </Typography>
                    </Box>
                )}
            </Paper>
        </Box>
    );
}; 