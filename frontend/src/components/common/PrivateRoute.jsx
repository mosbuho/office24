import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated } from '../../utils/auth';
import { jwtDecode } from 'jwt-decode';

const handleRedirect = (pathname) => {
    if (pathname.startsWith('/manager')) {
        return <Navigate to="/manager" state={{ from: pathname }} replace />;
    } else if (pathname.startsWith('/admin')) {
        return <Navigate to="/admin/login" state={{ from: pathname }} replace />;
    } else {
        return <Navigate to="/login" state={{ from: pathname }} replace />;
    }
};

const PrivateRoute = ({ children, requiredRole }) => {
    const location = useLocation();
    const [authStatus, setAuthStatus] = useState(null);
    const accessToken = localStorage.getItem('accessToken');

    useEffect(() => {
        const checkAuth = async () => {
            const isAuth = await isAuthenticated();
            setAuthStatus(isAuth);
        };
        checkAuth();
    }, []);

    if (authStatus === null) {
        return <></>;
    }

    if (!authStatus) {
        return handleRedirect(location.pathname);
    }

    try {
        const decodedToken = jwtDecode(accessToken);
        const userRole = decodedToken.role;
        if (userRole !== requiredRole) {
            return handleRedirect(location.pathname);
        }
    } catch {
        return handleRedirect(location.pathname);
    }

    return children;
};

export default PrivateRoute;