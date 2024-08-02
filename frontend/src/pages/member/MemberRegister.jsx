import React, { useState } from 'react';
import '/src/styles/pages/member/MemberRegister.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
    allCheck,
    emailCheck,
    idCheck,
    nameCheck,
    phoneCheck,
    pwCheck,
    pwCheckCheck
} from '../../utils/MemberRegister.js';

const MemberRegister = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        id: '',
        pw: '',
        pwCheck: '',
        email: '',
        name: '',
        birth: '',
        telecom: '',
        gender: 'M',
        phone: ''
    });

    const [verification, setVerification] = useState({
        isCodeSent: false,
        verificationCode: '',
        isVerified: false
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const idDuplicate = () => {
        const id = formData.id;
        if (!id) {
            alert('아이디를 입력하세요.');
            return false;
        } else if (!idCheck()) {
            alert('아이디는 6자 이상 12자 이하의 영문자와 숫자로만 구성되어야 합니다.');
            return false;
        }
        axios.get(`http://localhost:8080/member/idCheck`, { params: { id }, withCredentials: true })
            .then(response => {
                if (response.status === 200) {
                    alert('사용 가능한 아이디입니다.');
                    return true;
                }
            })
            .catch(error => {
                alert('이미 사용중인 아이디입니다.')
                return false;
            });
        return false;
    };

    const handleVerificationChange = (e) => {
        const { name, value } = e.target;
        setVerification({
            ...verification,
            [name]: value
        });
    };

    const sendVerificationCode = () => {
        if (!phoneCheck()) {
            alert('전화번호는 010으로 시작하며 숫자 11자여야 합니다.');
            return false;
        }
        return axios.post(`http://localhost:8080/message/send-one`, { to: formData.phone }, {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
        })
            .then(response => {
                if (response.status === 200) {
                    setVerification({
                        ...verification,
                        isCodeSent: true
                    });
                    alert("인증 코드가 전송되었습니다.");
                    return true;
                }
            })
            .catch(error => {
                alert('인증 코드 전송 실패');
                return false;
            });
    };

    const verifyCode = () => {
        return axios.post(`http://localhost:8080/message/verify-code`, { text: verification.verificationCode }, {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
        })
            .then(response => {
                if (response.data) {
                    setVerification({
                        ...verification,
                        isVerified: true
                    });
                    alert("인증 성공");
                    return true;
                } else {
                    alert("인증 실패");
                    return false;
                }
            })
            .catch(error => {
                alert("인증 실패");
                return false;
            });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (allCheck() && verification.isVerified) {
            axios.post('http://localhost:8080/member/register', formData, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            })
                .then(response => {
                    if (response.status === 200) {
                        alert('회원가입 완료');
                        navigate('/');
                    } else {
                        alert('회원가입 실패');
                    }
                })
                .catch(error => {
                    alert('회원가입 실패');
                });
        } else {
            alert("회원가입 데이터가 잘못되었습니다.")
        }
    };
    const logoClick = () => {
        navigate("/")
    }

    return (
        <div className="register-page">
            <div className="member-register">
                <div className="logo" onClick={logoClick}>OFFICE24</div>
                <h1>회원가입</h1>
                <form onSubmit={handleSubmit}>
                    <div className="form-group id-group">
                        <label htmlFor="id">아이디</label>
                        <div className="input-group">
                            <input type="text" id="id" name="id" value={formData.id} onChange={handleChange} required
                                   onKeyUp={idCheck} placeholder="6~12자, 영문자와 숫자만"/>
                            <button type="button" className="check-btn" onClick={idDuplicate}>중복확인</button>
                        </div>
                        <span id="idInfo" className="info-message"></span>
                    </div>
                    <div className="form-group">
                        <label htmlFor="pw">비밀번호</label>
                        <input type="password" id="pw" name="pw" value={formData.pw} onChange={handleChange}
                               onKeyUp={pwCheck} required placeholder="8~16자, 영문, 숫자, 특수문자 포함"/>
                        <span id="pwInfo" className="info-message"></span>
                    </div>
                    <div className="form-group">
                        <label htmlFor="pwCheck">비밀번호 확인</label>
                        <input type="password" id="pwCheck" name="pwCheck" value={formData.pwCheck}
                               onChange={handleChange}
                               onKeyUp={pwCheckCheck} required placeholder="비밀번호를 다시 입력하세요"/>
                        <span id="pwCheckInfo" className="info-message"></span>
                    </div>
                    <div className="form-group">
                        <label htmlFor="name">이름</label>
                        <input type="text" id="name" name="name" value={formData.name} onChange={handleChange}
                               onKeyUp={nameCheck} required placeholder="2~12자, 한글만"/>
                        <span id="nameInfo" className="info-message"></span>
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">[선택] 이메일주소</label>
                        <input type="email" id="email" name="email" value={formData.email} onChange={handleChange}
                               onKeyUp={emailCheck} placeholder="(선택 항목)"/>
                        <span id="emailInfo" className=""></span>
                    </div>
                    <div className="form-group">
                        <label htmlFor="birth">생년월일</label>
                        <input type="date" id="birth" name="birth" value={formData.birth} onChange={handleChange}
                               required/>
                        <span id="birthInfo" className="info-message"></span>
                    </div>
                    <div className="form-group">
                        <label htmlFor="gender">성별</label>
                        <select id="gender" name="gender" value={formData.gender} onChange={handleChange} required>
                            <option value="M">남성</option>
                            <option value="W">여성</option>
                        </select>
                    </div>
                    <div className="form-group phone-group">
                        <label htmlFor="phone">휴대전화번호</label>
                        <div className="input-group">
                            <input type="text" id="phone" name="phone" value={formData.phone} onChange={handleChange}
                                   onKeyUp={phoneCheck} required placeholder="'-' 를 제외한 11자리 숫자"/>
                            <button type="button" className="check-btn" onClick={sendVerificationCode}>번호 인증</button>
                        </div>
                        <span id="phoneInfo" className="info-message"></span>
                    </div>
                    {verification.isCodeSent && (
                        <div className="form-group verify-group">
                            <label htmlFor="verificationCode">인증 코드</label>
                            <div className="input-group">
                                <input type="text" id="verificationCode" name="verificationCode"
                                       value={verification.verificationCode} onChange={handleVerificationChange}
                                       required/>
                                <button type="button" className="check-btn" onClick={verifyCode}>인증</button>
                            </div>
                            {verification.isVerified && (
                                <span className="info-message-success">번호 인증이 완료되었습니다.</span>
                            )}
                        </div>
                    )}
                    <button type="submit" className="button1">회원가입</button>
                </form>
            </div>
        </div>
    );
};

export default MemberRegister;
