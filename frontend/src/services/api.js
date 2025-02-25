import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add a request interceptor
api.interceptors.request.use(
    (config) => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.access) {
            config.headers.Authorization = `Bearer ${user.access}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If the error status is 401 and there is no originalRequest._retry flag,
        // it means the token has expired and we need to refresh it
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const user = JSON.parse(localStorage.getItem('user'));
                const response = await axios.post('http://localhost:8000/api/auth/token/refresh/', {
                    refresh: user.refresh
                });

                const { access } = response.data;

                // Update the user in localStorage
                user.access = access;
                localStorage.setItem('user', JSON.stringify(user));

                // Update the authorization header
                originalRequest.headers.Authorization = `Bearer ${access}`;

                return api(originalRequest);
            } catch (error) {
                // If refresh token fails, logout the user
                localStorage.removeItem('user');
                window.location.href = '/login';
                return Promise.reject(error);
            }
        }

        return Promise.reject(error);
    }
);

export default api; 