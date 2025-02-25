import api from './api';

const StockReportService = {
    getAllReports: async () => {
        const response = await api.get('/stock-reports/');
        return response.data;
    },

    createReport: async (reportData) => {
        const response = await api.post('/stock-reports/', reportData);
        return response.data;
    },

    resolveReport: async (id) => {
        const response = await api.post(`/stock-reports/${id}/resolve/`);
        return response.data;
    },

    getReportsByProduct: async (productId) => {
        const response = await api.get(`/stock-reports/?product=${productId}`);
        return response.data;
    }
};

export default StockReportService; 