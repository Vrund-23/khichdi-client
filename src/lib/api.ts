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
            // Returns [] when backend is up but no menus posted today yet
            return data.menus;
        }
        // Backend responded but signalled failure — treat as empty (not an outage)
        return [];
    } catch (error) {
        // Network error or backend completely unreachable — return null
        // so MasonryGrid can fall back to static demo data instead of showing
        // a misleading "no menus yet" message
        console.error('Error fetching today menus:', error);
        return null;
    }
};

// Fetch all hotels + today's menu for each (null if not uploaded yet).
// Used by the client homepage to show all mess cards — with a placeholder
// for those that haven't posted today's menu yet.
export const fetchAllHotelsWithTodayMenu = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/hotels`);
        const data = await response.json();
        if (data.success) {
            return data.hotels; // each hotel has a `todayMenu` field (null if not posted)
        }
        return [];
    } catch (error) {
        console.error('Error fetching hotels with today menu:', error);
        return null; // null = network error → caller should show fallback
    }
};

export default API_BASE_URL;
