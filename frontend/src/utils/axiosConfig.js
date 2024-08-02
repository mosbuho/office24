import axios from 'axios';
import { getAccessToken, refreshAccessToken, removeTokens } from './auth';

const instance = axios.create({
    baseURL: 'http://localhost:8080',
});

instance.interceptors.request.use(
    (config) => {
        const accessToken = getAccessToken();
        if (accessToken) {
            config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

instance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const newAccessToken = await refreshAccessToken();
            if (newAccessToken) {
                originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                return instance(originalRequest);
            } else {
                removeTokens();
                const pathname = window.location.pathname;
                if (pathname.startsWith('/manager')) {
                    window.location.href = '/manager';
                } else if (pathname.startsWith('/admin')) {
                    window.location.href = '/admin/login';
                } else {
                    window.location.href = '/login';
                }
            }
        }
        return Promise.reject(error);
    }
);

export default instance;