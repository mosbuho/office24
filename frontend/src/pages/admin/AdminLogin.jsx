import '../../styles/pages/admin/AdminLogin.css';
import { setTokens } from '../../utils/auth';
import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import axios from 'axios';

const AdminLogin = () => {
    const [id, setId] = useState('');
    const [pw, setPw] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/auth/admin/login', { id, pw });
            const { accessToken, refreshToken, no } = response.data;
            setTokens(accessToken, refreshToken);
            navigate('/admin');
        } catch (error) {
            alert(error.response.data || '알 수 없는 오류가 발생했습니다.');
        }
    };

    return (
        <div className="admin-login-container">
            <div className='log-container'>
                <div className="logo">office24</div>
                <div className="login-tabs">
                    <div className="active">총 관리자</div>
                </div>
                <form className="login-form" onSubmit={handleSubmit}>
                    <input type="text" placeholder="아이디를 입력해 주세요." value={id}
                        onChange={(e) => setId(e.target.value)} required />
                    <input type="password" placeholder="비밀번호를 입력해 주세요." value={pw}
                        onChange={(e) => setPw(e.target.value)} required />
                    <button type="submit" className="login-btn">로그인</button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;