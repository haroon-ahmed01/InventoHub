import api from './api';

const DashboardService = {
    getProductStats: async () => {
        const response = await api.get('/products/stats/');
        return response.data;
    },

    getReportStats: async () => {
        const response = await api.get('/stock-reports/stats/');
        return response.data;
    },

    searchProducts: async (params) => {
        const response = await api.get('/products/', { params });
        return response.data;
    },

    getFilteredReports: async (params) => {
        const response = await api.get('/stock-reports/', { params });
        return response.data;
    }
};

export default DashboardService; 