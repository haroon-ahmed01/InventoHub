import api from './api';

const AuthService = {
    login: async (credentials) => {
        try {
            const response = await api.post('/auth/login/', credentials);
            if (response.data.access) {
                localStorage.setItem('user', JSON.stringify({
                    ...response.data,
                    user_type: response.data.user_type || 'staff' // Default to staff if not specified
                }));
            }
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    register: async (userData) => {
        const response = await api.post('/auth/register/', userData);
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('user');
    },

    getCurrentUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    updateToken: async (refreshToken) => {
        const response = await api.post('/auth/token/refresh/', {
            refresh: refreshToken
        });
        return response.data;
    }
};

export default AuthService; 