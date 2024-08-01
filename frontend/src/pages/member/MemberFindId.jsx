import React, { useState } from 'react';
import axios from 'axios';
import '../../styles/pages/member/MemberFindId.css';
import { phoneCheck } from "../../utils/MemberRegister.js";
import { Link, useNavigate } from "react-router-dom";

const MemberFindId = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ phone: '' });
    const [verification, setVerification] = useState({
        isCodeSent: false,
        verificationCode: '',
        isVerified: false
    });

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
        axios.post(`http://localhost:8080/message/send-one`, { to: formData.phone }, {
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
                alert('인증 코드 전송 실패');
                return false;
            });
    };

    const verifyCode = () => {
        axios.post(`http://localhost:8080/message/verify-code`, { text: verification.verificationCode }, {
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
                return false;
            });
    };

    const findIdByPhone = () => {
        axios.get(`http://localhost:8080/auth/idExist`, {
            params: { phone: formData.phone }
        })
            .then(response => {
                if (response.status === 200 && Array.isArray(response.data)) {
                    navigate("/member/findIdResult", { state: { ids: response.data } });
                } else if (response.status === 200 && response.data.ids) {
                    navigate("/member/findIdResult", { state: { ids: response.data.ids } });
                }
            })
            .catch(error => {
                alert("아이디가 존재하지 않습니다.");
            });
    };

    const logoClick = () => {
        navigate("/");
    };

    return (
        <div className="member-find-id-page">
            <div className="member-find-id-form">
                <div className="member-find-id-logo" onClick={logoClick}>OFFICE24</div>
                <h2>아이디 찾기</h2>
                <div className="member-find-id-form-group">
                    <label htmlFor="phone">휴대전화번호</label>
                    <div className="member-find-id-input-group">
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
                        <button type="button" className="member-find-id-check-btn" onClick={sendVerificationCode}>
                            번호 인증
                        </button>
                    </div>
                    <span id="phoneInfo" className="member-find-id-info-message"></span>
                </div>
                {verification.isCodeSent && (
                    <div className="member-find-id-form-group">
                        <label htmlFor="verificationCode">인증 코드</label>
                        <div className="member-find-id-input-group">
                            <input
                                type="text"
                                id="verificationCode"
                                name="verificationCode"
                                value={verification.verificationCode}
                                onChange={handleVerificationChange}
                                required
                            />
                            <button type="button" className="member-find-id-check-btn" onClick={verifyCode}>
                                인증
                            </button>
                        </div>
                        {verification.isVerified && (
                            <span className="member-find-id-info-message-success">번호 인증이 완료되었습니다.</span>
                        )}
                    </div>
                )}
                {verification.isVerified && (
                    <div>
                        <button type="button" className="member-find-id-find-id-btn" onClick={findIdByPhone}>
                            아이디 찾기
                        </button>
                    </div>
                )}
                <div className="member-find-id-additional-links">
                    <Link to="/member/resetPw" className="member-find-id-link-button">
                        비밀번호 재설정
                    </Link>
                    <Link to="/login" className="member-find-id-link-button">
                        로그인 화면으로
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default MemberFindId;
