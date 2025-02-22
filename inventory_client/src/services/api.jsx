// api.js
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: 'An unexpected error occurred'
    }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Token ${token}` : '',
  };
};

export const api = {
  login: async (credentials) => {
    const response = await fetch(`${BASE_URL}/auth/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    const data = await handleResponse(response);
    localStorage.setItem('token', data.token);
    return data;
  },

  logout: () => {
    localStorage.removeItem('token');
  },

  getProducts: async () => {
    try {
      const response = await fetch(`${BASE_URL}/products/`, {
        headers: getHeaders()
      });
      return await handleResponse(response);
    } catch (error) {
      throw new Error(`Failed to fetch products: ${error.message}`);
    }
  },

  createProduct: async (product) => {
    try {
      const response = await fetch(`${BASE_URL}/products/`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(product)
      });
      return await handleResponse(response);
    } catch (error) {
      throw new Error(`Failed to create product: ${error.message}`);
    }
  },

  updateProduct: async (id, data) => {
    try {
      const response = await fetch(`${BASE_URL}/products/${id}/`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(data)
      });
      return await handleResponse(response);
    } catch (error) {
      throw new Error(`Failed to update product: ${error.message}`);
    }
  },

  deleteProduct: async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/products/${id}/`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return true;
    } catch (error) {
      throw new Error(`Failed to delete product: ${error.message}`);
    }
  },

  register: async (userData) => {
    const response = await fetch(`${BASE_URL}/auth/register/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return await handleResponse(response);
  }
};

export default api;