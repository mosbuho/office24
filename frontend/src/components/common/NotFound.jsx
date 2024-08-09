import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/components/common/NotFound.css';

const NotFoundPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            const currentPath = window.location.pathname;
            let redirectPath = '/';
            if (currentPath.startsWith('/manager')) {
                redirectPath = '/manager';
            } else if (currentPath.startsWith('/admin')) {
                redirectPath = '/admin';
            }

            navigate(redirectPath);
        }, 2000);
        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className='not-found-page'>
            <h1>페이지를 찾을 수 없습니다.</h1>
            <p>메인 페이지로 이동합니다.</p>
        </div>
    );
};

export default NotFoundPage;