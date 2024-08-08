import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated } from '../../utils/auth';

const getRedirectPath = (pathname) => {
    if (pathname.startsWith('/manager')) {
        return '/manager';
    } else if (pathname.startsWith('/admin')) {
        return '/admin';
    } else {
        return '/';
    }
};

const PublicRoute = ({ children }) => {
    const location = useLocation();
    const [authStatus, setAuthStatus] = useState(null);

    useEffect(() => {
        const checkAuth = async () => {
            const isAuth = await isAuthenticated();
            setAuthStatus(isAuth);
        };
        checkAuth();
    }, []);

    if (authStatus) {
        return <Navigate to={getRedirectPath(location.pathname)} state={{ from: location.pathname }} replace />;
    }

    return children;
};

export default PublicRoute;
