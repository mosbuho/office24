import React, {useState} from 'react';
import axios from 'axios';
import '../../styles/pages/member/MemberResetPw.css';
import {useNavigate} from "react-router-dom";
import {newPwCheck, newPwCheckCheck} from "../../utils/MemberResetPw.js";
import {phoneCheck} from "../../utils/MemberRegister.js";

const MemberResetPw = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        id: '',
        phone: '',
        newPw: '',
        newPwCheck: ''
    });
    const [verification, setVerification] = useState({
        idCheck: false,
        isCodeSent: false,
        verificationCode: '',
        isVerified: false
    });

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleVerificationChange = (e) => {
        setVerification({
            ...verification, [e.target.name]: e.target.value
        });
    };

    const handleIdCheck = () => {
        axios.get('http://localhost:8080/member/checkId', {params: {id: formData.id}},
            {headers: {'Content-Type': 'application/x-www-form-urlencoded'}, withCredentials: true})
            .then(response => {
                if (response.status === 200) {
                    alert('아이디 확인 완료')
                    setVerification({
                            ...verification,
                            idCheck: true
                        }
                    )
                    return true;
                } else {
                    alert('존재하지 않는 아이디입니다.')
                    return false;
                }
            })
            .catch(error => {
                alert('존재하지 않는 아이디입니다.')
                return false;
            });
    };

    const sendVerificationCode = () => {
        if (phoneCheck()) {
            axios.post('http://localhost:8080/message/send-one', {to: formData.phone},
                {headers: {'Content-Type': 'application/json'}, withCredentials: true})
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
        } else {
            alert("올바른 전화번호가 아닙니다.")
            return false;
        }
    };

    const verifyCode = () => {
        axios.post(`http://localhost:8080/message/verify-code`, {text: verification.verificationCode}, {
            headers: {'Content-Type': 'application/json'},
            withCredentials: true
        })
            .then(response => {
                if (response.data) {
                    setVerification({...verification, isVerified: true});
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

    const resetPw = () => {
        if (newPwCheck() && newPwCheckCheck()) {
            axios.post("http://localhost:8080/member/resetPw",
                {pw: formData.newPw, id: formData.id},
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .then(response => {
                    if (response.status === 200) {
                        alert("비밀번호 재설정 완료");
                    } else {
                        alert("비밀번호 재설정 실패");
                    }
                })
                .catch(error => {
                    console.error('Error response:', error.response);
                    alert("비밀번호 재설정 실패");
                });
        } else {
            alert("비밀번호가 일치하지 않습니다.")
            return false;
        }
    };


    const logoClick = () => {
        navigate("/");
    }

    const toLogin = () => {
        navigate("/login")
    }

    return (
        <div className="pw-reset-page">
            <div className="pw-reset-form">
                <div className="logo" onClick={logoClick}>OFFICE24</div>
                <h2>비밀번호 재설정</h2>
                <div className="form-group">
                    <label htmlFor="id">아이디</label>
                    <div className="input-group">
                        <input type="text" id="id" name="id" value={formData.id} onChange={handleChange} required
                               placeholder="아이디를 입력하세요"/>
                        <button type="button" className="check-btn" onClick={handleIdCheck}>
                            아이디 확인
                        </button>
                    </div>
                </div>
                {verification.idCheck && (<div className="form-group">
                    <label htmlFor="phone">휴대폰 번호</label>
                    <div className="input-group">
                        <input
                            type="text"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange} onKeyUp={phoneCheck}
                            required
                            placeholder="휴대폰 번호를 입력하세요"
                        />
                        <button type="button" className="check-btn" onClick={sendVerificationCode}>
                            번호 인증
                        </button>

                    </div>
                    <span id="phoneInfo" className="info-message"></span>
                </div>)}
                {verification.isCodeSent && (
                    <div className="form-group">
                        <label htmlFor="verificationCode">인증 코드</label>
                        <div className="input-group">
                            <input
                                type="text"
                                id="verificationCode"
                                name="verificationCode"
                                value={verification.verificationCode}
                                onChange={handleVerificationChange}
                                required
                                placeholder="인증 코드를 입력하세요"
                            />
                            <button type="button" className="check-btn" onClick={verifyCode}>
                                인증 코드 확인
                            </button>
                        </div>
                    </div>
                )}
                {verification.isVerified && (
                    <div className="form-group">
                        <label htmlFor="newPw">새로운 비밀번호</label>
                        <div className="input-group">
                            <input type="password" id="newPw" name="newPw" value={formData.newPw}
                                   onChange={handleChange}
                                   onKeyUp={newPwCheck} required/>
                        </div>
                        <span id="newPwInfo" className="info-message"></span>
                    </div>
                )}
                {verification.isVerified && (
                    <div className="form-group">
                        <label htmlFor="newPwCheck"></label>
                        <div className="input-group">
                            <input type="password" id="newPwCheck" name="newPwCheck" value={formData.newPwCheck}
                                   onChange={handleChange} onKeyUp={newPwCheckCheck} required/>
                            <button type="button" className="check-btn" onClick={resetPw}>
                                비밀번호 재설정
                            </button>
                        </div>
                        <span id="newPwCheckInfo" className="info-message"></span>
                    </div>
                )}
                <button type="button" className="submit-btn" onClick={toLogin}>로그인 화면으로</button>
            </div>
        </div>
    );
};

export default MemberResetPw;
