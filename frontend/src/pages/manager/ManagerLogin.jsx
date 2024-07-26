import '../../styles/pages/manager/ManagerLogin.css';
import { setTokens } from '../../utils/auth';
import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import axios from 'axios';

const ManagerLogin = () => {
    const [id, setId] = useState('');
    const [pw, setPw] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/auth/manager/login', { id, pw });
            const { accessToken, refreshToken } = response.data;
            setTokens(accessToken, refreshToken);
            navigate('/manager');
        } catch (error) {
            alert(error.response.data || '알 수 없는 오류가 발생했습니다.');
        }
    };

    return (
        <div>
            <h2>Manager Login</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>ID:</label>
                    <input type="text" value={id} onChange={(e) => setId(e.target.value)} required />
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} required />
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default ManagerLogin;