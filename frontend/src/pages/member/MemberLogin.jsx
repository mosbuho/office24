import '../../styles/pages/member/MemberLogin.css';
import { setTokens } from '../../utils/auth';
import { useNavigate, Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const socialLogin = async (path) => {
    const response = await axios.get(`http://localhost:8080/auth/${path}/login`);
    window.location.href = response.data;
};

const MemberLogin = () => {
    const [formData, setFormData] = useState({
        id: '',
        pw: ''
    });

    const navigate = useNavigate();

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const accessToken = urlParams.get('accessToken');
        const refreshToken = urlParams.get('refreshToken');
        const userNo = urlParams.get('userNo');
        if (accessToken && refreshToken && userNo) {
            setTokens(accessToken, refreshToken, userNo);
            navigate("/");
        } else if (urlParams.has('accessToken') || urlParams.has('refreshToken')) {
            alert('로그인에 실패했습니다. 다시 시도해주세요.');
            navigate("/login");
        }
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:8080/auth/member/login', formData, {
            headers: { 'Content-Type': 'application/json' }
        })
            .then(response => {
                const { accessToken, refreshToken, no } = response.data;
                setTokens(accessToken, refreshToken, no);
                navigate('/');
            })
            .catch(error => {
                alert(error.response?.data || '알 수 없는 오류가 발생했습니다.');
            });
    };

    const logoClick = () => {
        navigate("/");
    };

    return (
        <div className="member-login-page">
            <div className="member-login-form">
                <div className="member-login-logo" onClick={logoClick}>OFFICE24</div>
                <h2>로그인</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="id">아이디</label>
                        <input type="text" id="id" name="id" value={formData.id} onChange={handleChange} required />
                    </div>
                    <div>
                        <label htmlFor="pw">비밀번호</label>
                        <input type="password" id="pw" name="pw" value={formData.pw} onChange={handleChange} required />
                    </div>
                    <div className="member-login-help-links">
                        <Link to="/member/findId">아이디 찾기</Link>
                        <Link to="/member/resetPw">비밀번호 재설정</Link>
                        <Link to="/member/register">회원가입</Link>
                    </div>
                    <button type="submit" className="member-login-submit-button">로그인</button>
                </form>
                <button onClick={() => socialLogin("naver")} className="member-login-naver-button">네이버 로그인</button>
                <button onClick={() => socialLogin("google")} className="member-login-google-button">구글 로그인</button>
                <button onClick={() => socialLogin("kakao")} className="member-login-kakao-button">카카오 로그인</button>
            </div>
        </div>
    );
};

export default MemberLogin;
