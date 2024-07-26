import axios from 'axios';
import { jwtDecode } from "jwt-decode";

export const setTokens = (accessToken, refreshToken) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
};

export const getAccessToken = () => localStorage.getItem('accessToken');
export const getRefreshToken = () => localStorage.getItem('refreshToken');

export const removeTokens = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
};

export const refreshAccessToken = async () => {
    try {
        const response = await axios.post('http://localhost:8080/auth/refresh', {
            refreshToken: getRefreshToken(),
        });
        const { accessToken, refreshToken } = response.data;
        setTokens(accessToken, refreshToken);
        return accessToken;
    } catch (error) {
        console.error('Failed to refresh token:', error);
        removeTokens();
        return null;
    }
};

export const isAuthenticated = () => {
    const token = getAccessToken();
    if (!token) {
        return false;
    }

    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decodedToken.exp > currentTime;
};