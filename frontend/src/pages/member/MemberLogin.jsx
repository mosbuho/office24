import '../../styles/pages/member/MemberLogin.css';
import {setTokens} from '../../utils/auth';
import {useNavigate, Link, useLocation} from 'react-router-dom';
import React, {useState, useEffect} from 'react';
import axios from 'axios';

const SocialKakao = () => {
    const handleKakao = () => {
        axios.get('http://localhost:8080/auth/kakao/login-url')
            .then(response => {
                const kakaoURL = response.data;
                window.location.href = kakaoURL;
            })
            .catch(error => {
            });
    };

    return (
        <>
            <button onClick={handleKakao} className="kakao-login-button">카카오 로그인</button>
        </>
    );
};

const SocialNaver = () => {
    const handleNaver = () => {
        axios.get('http://localhost:8080/auth/naver/login-url')
            .then(response => {
                const naverURL = response.data;
                window.location.href = naverURL;
            })
            .catch(error => {
            })
    }

    return (
        <>
            <button onClick={handleNaver} className="naver-login-button">네이버 로그인</button>
        </>
    )
}

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
    const location = useLocation();

    useEffect(() => {
        const query = new URLSearchParams(location.search);
        const message = query.get('message');
        if (message === 'success') {
            alert('소셜 계정으로 회원등록 성공');
        } else if (message === 'error') {
            alert('소셜 계정으로 회원등록 실패');
        }
    }, [location]);

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

    const logoClick = () => {
        navigate("/");
    }

    return (
        <div className="member-login-form">
            <div className="logo" onClick={logoClick}>OFFICE24</div>
            <h2>로그인</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="id">아이디</label>
                    <input type="text" id="id" name="id" value={formData.id} onChange={handleChange} required/>
                </div>
                <div>
                    <label htmlFor="pw">비밀번호</label>
                    <input type="password" id="pw" name="pw" value={formData.pw} onChange={handleChange} required/>
                </div>
                <div className="help-links">
                    <Link to="/member/findId">아이디 찾기</Link>
                    <Link to="/member/findPw">비밀번호 찾기</Link>
                    <Link to="/member/register">회원가입</Link>
                </div>
                <button type="submit">Login</button>
            </form>
            <SocialKakao/>
            <SocialNaver/>
        </div>
    );
};

export default MemberLogin;
