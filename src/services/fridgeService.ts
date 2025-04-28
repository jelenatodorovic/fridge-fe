import axios from 'axios';
import { FridgeDto, FridgeType, FridgeSize, ItemDto } from '../types/fridge';

const API_BASE_URL = 'http://localhost:8080/api';

export const fridgeService = {
    createFridgeByType: async (type: FridgeType): Promise<FridgeDto> => {
        try {
            console.log('Sending request to create fridge of type:', type);
            const response = await axios.post(`${API_BASE_URL}/fridges/type/${type}`, null, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            console.log('Response received:', response.data);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Axios error:', {
                    message: error.message,
                    status: error.response?.status,
                    data: error.response?.data,
                    config: error.config
                });
            } else {
                console.error('Unknown error:', error);
            }
            throw error;
        }
    },
    
    createFridgeByTypeAndSize: async (type: FridgeType, size: FridgeSize): Promise<FridgeDto> => {
        try {
            console.log('Sending request to create fridge of type:', type, 'and size:', size);
            const response = await axios.post(`${API_BASE_URL}/fridges/type/${type}/size/${size}`, null, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            console.log('Response received:', response.data);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Axios error:', {
                    message: error.message,
                    status: error.response?.status,
                    data: error.response?.data,
                    config: error.config
                });
            } else {
                console.error('Unknown error:', error);
            }
            throw error;
        }
    },
    
    getAllFridges: async (): Promise<FridgeDto[]> => {
        try {
            console.log('Fetching all fridges');
            const response = await axios.get(`${API_BASE_URL}/fridges`);
            console.log('Fridges fetched:', response.data);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Error fetching fridges:', {
                    message: error.message,
                    status: error.response?.status,
                    data: error.response?.data
                });
            } else {
                console.error('Unknown error:', error);
            }
            throw error;
        }
    },
    
    addItemToFridge: async (fridgeId: number, item: ItemDto, temperature: number): Promise<ItemDto> => {
        try {
            // Check if fridgeId is undefined or not a valid number
            if (typeof fridgeId !== 'number' || isNaN(fridgeId)) {
                console.error('Invalid fridge ID:', fridgeId);
                throw new Error('Invalid fridge ID');
            }

            // Ensure temperature is a valid number
            const validTemperature = isNaN(temperature) ? 4 : temperature;
            
            console.log('Adding item to fridge:', fridgeId, item, 'at temperature:', validTemperature);
            const response = await axios.post(
                `${API_BASE_URL}/fridges/${fridgeId}/items?temperature=${validTemperature}`,
                item,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            );
            console.log('Item added successfully:', response.data);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Error adding item to fridge:', {
                    message: error.message,
                    status: error.response?.status,
                    data: error.response?.data
                });
            } else {
                console.error('Unknown error:', error);
            }
            throw error;
        }
    },
    
    getAllItems: async (fridgeId: number): Promise<ItemDto[]> => {
        try {
            // Check if fridgeId is undefined or not a valid number
            if (typeof fridgeId !== 'number' || isNaN(fridgeId)) {
                console.error('Invalid fridge ID:', fridgeId);
                throw new Error('Invalid fridge ID');
            }

            console.log('Fetching all items for fridge:', fridgeId);
            const response = await axios.get(`${API_BASE_URL}/fridges/${fridgeId}/items`);
            console.log('Items fetched:', response.data);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Error fetching items:', {
                    message: error.message,
                    status: error.response?.status,
                    data: error.response?.data
                });
            } else {
                console.error('Unknown error:', error);
            }
            throw error;
        }
    },
    
    removeItemFromFridge: async (itemId: number): Promise<boolean> => {
        try {
            // Check if itemId is undefined or not a valid number
            if (typeof itemId !== 'number' || isNaN(itemId)) {
                console.error('Invalid item ID:', itemId);
                throw new Error('Invalid item ID');
            }

            console.log('Removing item:', itemId);
            const response = await axios.delete(`${API_BASE_URL}/fridges/items/${itemId}`);
            console.log('Item removed successfully:', response.data);
            return true;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Error removing item:', {
                    message: error.message,
                    status: error.response?.status,
                    data: error.response?.data
                });
            } else {
                console.error('Unknown error:', error);
            }
            throw error;
        }
    },
    
    removeExpiredItems: async (fridgeId: number): Promise<boolean> => {
        try {
            // Check if fridgeId is undefined or not a valid number
            if (typeof fridgeId !== 'number' || isNaN(fridgeId)) {
                console.error('Invalid fridge ID:', fridgeId);
                throw new Error('Invalid fridge ID');
            }

            console.log('Removing expired items from fridge:', fridgeId);
            const response = await axios.delete(`${API_BASE_URL}/fridges/${fridgeId}/items/removeExpired`);
            console.log('Expired items removed successfully');
            return true;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Error removing expired items:', {
                    message: error.message,
                    status: error.response?.status,
                    data: error.response?.data
                });
            } else {
                console.error('Unknown error:', error);
            }
            throw error;
        }
    }
}; 