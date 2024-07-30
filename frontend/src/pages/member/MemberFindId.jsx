import React, { useState } from 'react';
import axios from 'axios';
import '../../styles/pages/member/MemberFindId.css';
import { phoneCheck } from "../../utils/MemberRegister.js";
import { Link } from "react-router-dom";

const MemberFindId = () => {
    const [formData, setFormData] = useState({ phone: '' });
    const [verification, setVerification] = useState({
        isCodeSent: false,
        verificationCode: '',
        isVerified: false
    });
    const [id, setId] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleVerificationChange = (e) => {
        setVerification({ ...verification, [e.target.name]: e.target.value });
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
                    setVerification({ ...verification, isCodeSent: true });
                    alert("인증 코드가 전송되었습니다.");
                    return true;
                }
            })
            .catch(error => {
                alert('인증 코드 전송 실패: ' + error.message);
                console.error(error.response.data);
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
                    setVerification({ ...verification, isVerified: true });
                    alert("인증 성공");
                    return true;
                } else {
                    alert("인증 실패");
                    return false;
                }
            })
            .catch(error => {
                alert("인증 실패: " + error.message);
                console.error(error.response.data);
                return false;
            });
    };

    const findIdByPhone = () => {
        axios.get(`http://localhost:8080/auth/idExist`, {
            params: { phone: formData.phone }
        })
            .then(response => {
                if (response.status === 200) {
                    setId(response.data.id);
                }
            })
            .catch(error => {
                console.error(error.response);
                alert("아이디가 존재하지 않습니다.");
            });
    };

    return (
        <div className="find-id-form">
            <Link to="/" className="logo">로고</Link>
            <h2>아이디 찾기</h2>
            <div className="form-group phone-group">
                <label htmlFor="phone">휴대전화번호</label>
                <div className="input-group">
                    <input
                        type="text"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        onKeyUp={phoneCheck}
                        required
                        placeholder="'-' 를 제외한 11자리 숫자"
                    />
                    <button type="button" className="check-btn" onClick={sendVerificationCode}>
                        번호 인증
                    </button>
                </div>
                <span id="phoneInfo" className="info-message"></span>
            </div>
            {verification.isCodeSent && (
                <div className="form-group verify-group">
                    <label htmlFor="verificationCode">인증 코드</label>
                    <div className="input-group">
                        <input
                            type="text"
                            id="verificationCode"
                            name="verificationCode"
                            value={verification.verificationCode}
                            onChange={handleVerificationChange}
                            required
                        />
                        <button type="button" className="check-btn" onClick={verifyCode}>
                            인증
                        </button>
                    </div>
                    {verification.isVerified && (
                        <span className="info-message-success">번호 인증이 완료되었습니다.</span>
                    )}
                </div>
            )}
            {verification.isVerified && (
                <div>
                    <button type="button" className="find-id-btn" onClick={findIdByPhone}>
                        아이디 찾기
                    </button>
                    {id && (
                        <div className="user-id-result">
                            <span className="info-message-success">아이디: {id}</span>
                        </div>
                    )}
                </div>
            )}
            <div className="additional-links">
                <Link to="/findPw" className="link-button">
                    비밀번호 찾기
                </Link>
                <Link to="/login" className="link-button">
                    로그인 화면으로
                </Link>
            </div>
        </div>
    );
};

export default MemberFindId;
