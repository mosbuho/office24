import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

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

export const isAuthenticated = async () => {
    let accessToken = getAccessToken();
    if (!accessToken) {
        return false;
    }

    let decodedToken;
    try {
        decodedToken = jwtDecode(accessToken);
    } catch {
        return false;
    }

    const currentTime = Date.now() / 1000;
    if (decodedToken.exp <= currentTime) {
        accessToken = await refreshAccessToken();
        if (!accessToken) {
            return false;
        }
        decodedToken = jwtDecode(accessToken);
    }
    return decodedToken.exp > currentTime;
};

export const refreshAccessToken = async () => {
    try {
        const response = await axios.post('http://localhost:8080/auth/refresh', {
            refreshToken: getRefreshToken(),
        });
        const { accessToken, refreshToken } = response.data;
        setTokens(accessToken, refreshToken);
        return accessToken;
    } catch {
        removeTokens();
        return null;
    }
};