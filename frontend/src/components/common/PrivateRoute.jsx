import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated } from '../../utils/auth';
import { jwtDecode } from 'jwt-decode';

const PrivateRoute = ({ children, requiredRole }) => {
    const location = useLocation();
    const accessToken = localStorage.getItem('accessToken');

    if (!isAuthenticated()) {
        const pathname = location.pathname;
        if (pathname.startsWith('/manager')) {
            return <Navigate to="/manager/login" state={{ from: location }} replace />;
        } else if (pathname.startsWith('/admin')) {
            return <Navigate to="/admin/login" state={{ from: location }} replace />;
        } else {
            return <Navigate to="/login" state={{ from: location }} replace />;
        }
    }

    try {
        const decodedToken = jwtDecode(accessToken);
        const userRole = decodedToken.role;

        if (userRole !== requiredRole) {
            const redirectPaths = {
                'ROLE_MANAGER': '/manager/login',
                'ROLE_ADMIN': '/admin/login',
            };

            const redirectTo = redirectPaths[requiredRole] || '/login';
            return <Navigate to={redirectTo} replace />;
        }
    } catch (error) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default PrivateRoute;