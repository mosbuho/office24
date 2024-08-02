import '../../styles/pages/manager/ManagerLogin.css';
import { setTokens } from '../../utils/auth';
import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import axios from 'axios';

const ManagerLogin = () => {
    const [id, setId] = useState('');
    const [pw, setPw] = useState('');
    const navigate = useNavigate();

    // [로그인] 버튼
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/auth/manager/login', { id, pw });
            const { accessToken, refreshToken, no } = response.data;
            setTokens(accessToken, refreshToken);
            navigate(`/manager/${no}`);
        } catch (error) {
            alert(error.response.data || '알 수 없는 오류가 발생했습니다.');
        }
    };

    return (
        <div className="managerLogin-container">
            <div className='log-container'>
                <div className="logo">OFFICE24</div>
                <div className="login-tabs">
                    <div className="active">오피스 관리자</div>
                </div>
                <form className="login-form" onSubmit={handleSubmit}>
                    <input type="text" placeholder="아이디를 입력해 주세요." value={id}
                        onChange={(e) => setId(e.target.value)} required />
                    <input type="password" placeholder="비밀번호를 입력해 주세요." value={pw}
                        onChange={(e) => setPw(e.target.value)} required />
                    <button type="submit" className="login-btn">로그인</button>
                </form>
                <div className="login-options">
                    <button onClick={() => navigate('/manager/register')}>회원가입</button>
                    <button onClick={() => navigate('/manager/findAccount')}>아이디/비밀번호 찾기</button>
                </div>
            </div>
        </div>
    );
};

export default ManagerLogin;