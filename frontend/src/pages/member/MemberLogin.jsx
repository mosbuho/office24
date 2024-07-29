import '../../styles/pages/member/MemberLogin.css';
import {setTokens} from '../../utils/auth';
import {useNavigate} from 'react-router-dom';
import React, {useState} from 'react';
import axios from 'axios';

const MemberLogin = () => {
    const [formData, setFormData] = useState({
        id: '',
        pw: ''
    });

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:8080/auth/member/login', {
            id: formData.id,
            pw: formData.pw
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                const {accessToken, refreshToken} = response.data;
                setTokens(accessToken, refreshToken);
                navigate('/');
            })
            .catch(error => {
                alert(error.response.data || '알 수 없는 오류가 발생했습니다.');
            });
    };

    return (
        <div className="member-login-form">
            <div className="logo">로고</div>
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
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default MemberLogin;
