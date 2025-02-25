import api from './api';

const ProductService = {
    getAllProducts: async (filters = {}) => {
        try {
            const params = new URLSearchParams();
            Object.entries(filters).forEach(([key, value]) => {
                if (value) params.append(key, value);
            });
            
            const response = await api.get(`/products/${params.toString() ? `?${params.toString()}` : ''}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getProduct: async (id) => {
        const response = await api.get(`/products/${id}/`);
        return response.data;
    },

    createProduct: async (productData) => {
        const response = await api.post('/products/', productData);
        return response.data;
    },

    updateProduct: async (id, productData) => {
        const response = await api.put(`/products/${id}/`, productData);
        return response.data;
    },

    deleteProduct: async (id) => {
        await api.delete(`/products/${id}/`);
    }
};

export default ProductService; 