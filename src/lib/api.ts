// API configuration for connecting to the backend
// In development, Vite proxy forwards /api to localhost:5000
// In production, set VITE_API_URL to your deployed backend URL
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const fetchLatestMenus = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/menu/latest`);
        const data = await response.json();
        if (data.success) {
            return data.menus;
        }
        return [];
    } catch (error) {
        console.error('Error fetching latest menus:', error);
        return [];
    }
};

export const fetchTodayMenus = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/menu/today`);
        const data = await response.json();
        if (data.success) {
            return data.menus;
        }
        return [];
    } catch (error) {
        console.error('Error fetching today menus:', error);
        return [];
    }
};

export default API_BASE_URL;
