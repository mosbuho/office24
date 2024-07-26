import { useState } from "react";
import axios from 'axios';
import "/src/styles/pages/member/MemberRegister.css";
import {
    allCheck,
    birthCheck,
    emailCheck,
    idCheck,
    nameCheck, phoneCheck,
    pwCheck,
    pwCheckCheck
} from "/src/utils/MemberRegister.js";

const MemberRegister = () => {
    const [formData, setFormData] = useState({
        id: '',
        pw: '',
        pwCheck: '',
        name: '',
        phone: '',
        email: '',
        birth: '',
        gender: 'M',
        phoneCode: '',
        emailCode: '',
    });

    const [phoneCodeSent, setPhoneCodeSent] = useState(false);
    const [emailCodeSent, setEmailCodeSent] = useState(false);
    const [phoneVerified, setPhoneVerified] = useState(false);
    const [emailVerified, setEmailVerified] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const sendPhoneCode = async () => {
        try {
            await axios.post('http://localhost:8080/auth/sendPhoneCode', { phone: formData.phone });
            setPhoneCodeSent(true);
            alert("핸드폰 인증 코드 전송 성공");
        } catch (error) {
            console.error('Error sending phone code:', error);
            alert("핸드폰 인증 코드 전송 실패");
        }
    };

    const verifyPhoneCode = async () => {
        try {
            const response = await axios.post('http://localhost:8080/auth/verifyPhoneCode', {
                phone: formData.phone,
                code: formData.phoneCode
            });
            if (response.data === "인증 성공") {
                setPhoneVerified(true);
                alert("핸드폰 인증 성공");
            } else {
                alert("핸드폰 인증 실패");
            }
        } catch (error) {
            console.error('Error verifying phone code:', error);
            alert("핸드폰 인증 실패");
        }
    };

    const sendEmailCode = async () => {
        try {
            await axios.post('http://localhost:8080/auth/sendEmailCode', { email: formData.email });
            setEmailCodeSent(true);
            alert("이메일 인증 코드 전송 성공");
        } catch (error) {
            console.error('Error sending email code:', error);
            alert("이메일 인증 코드 전송 실패");
        }
    };

    const verifyEmailCode = async () => {
        try {
            const response = await axios.post('http://localhost:8080/auth/verifyEmailCode', {
                email: formData.email,
                code: formData.emailCode
            });
            if (response.data === "인증 성공") {
                setEmailVerified(true);
                alert("이메일 인증 성공");
            } else {
                alert("이메일 인증 실패");
            }
        } catch (error) {
            console.error('Error verifying email code:', error);
            alert("이메일 인증 실패");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (allCheck() && idDuplicate && phoneVerified && emailVerified) {
            const response = await axios.post('http://localhost:8080/member/registerProc', formData, {
                headers: {
                    "Content-Type": "application/json"
                }
            });
            if (response.data === "회원가입 성공") {
                alert("회원가입 성공");
                window.location.href = 'http://localhost:5173/';
            } else {
                alert("회원가입 실패");
            }
        } else {
            alert("입력사항에 오류가 있습니다.");
        }

    };

    const idDuplicate = async () => {
        if (idCheck())  {
            const id = document.querySelector("#id").value;
            const idInfo = document.querySelector("#idInfo");
            try {
                const response = await axios.get(`http://localhost:8080/member/idDuplicate`, {
                    params: { id: id }
                });
                if (response.data === "아이디 중복확인 완료") {
                    alert("아이디 중복확인 완료");
                    return true;
                } else {
                    idInfo.textContent = '중복된 아이디입니다.';
                    return false;
                }
            } catch (error) {
                idInfo.textContent = '아이디 중복 확인 중 오류가 발생했습니다.';
                return false;
            }
        }
    };

    return (
        <div className="memberRegister">
            <h1><a>로고</a></h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="id">아이디</label>
                    <div className="id-group">
                        <input type="text" id="id" name="id" value={formData.id} onChange={handleChange} onKeyUp={idCheck} required/>
                        <button type="button" onClick={idDuplicate}>아이디 중복확인</button>
                    </div>
                    <span id="idInfo" className="error"></span>
                </div>
                <div className="form-group">
                    <label htmlFor="pw">비밀번호</label>
                    <input type="password" id="pw" name="pw" value={formData.pw} onChange={handleChange} onKeyUp={pwCheck} required/><br/>
                    <span id="pwInfo" className="error"></span>
                </div>
                <div className="form-group">
                    <label htmlFor="pwCheck">비밀번호 확인</label>
                    <input type="password" id="pwCheck" name="pwCheck" value={formData.pwCheck} onChange={handleChange} onKeyUp={pwCheckCheck} required/><br/>
                    <span id="pwCheckInfo" className="error"></span>
                </div>
                <div className="form-group">
                    <label htmlFor="name">이름</label>
                    <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} onKeyUp={nameCheck} required/><br/>
                    <span id="nameInfo" className="error"></span>
                </div>
                <div className="form-group">
                    <label>전화번호</label>
                    <div className="phone-group">
                        <input id="phone" type="text" name="phone" value={formData.phone} onChange={handleChange} onKeyUp={phoneCheck} required/>
                        <button type="button" onClick={sendPhoneCode}>인증 코드 전송</button>
                    </div>
                    {phoneCodeSent && (
                        <div className="phone-verification">
                            <input
                                type="text"
                                name="phoneCode"
                                value={formData.phoneCode}
                                onChange={handleChange}
                                placeholder="인증 코드 입력"
                                required
                            />
                            <button type="button" onClick={verifyPhoneCode}>확인</button>
                        </div>
                    )}
                    <span id="phoneInfo" className="error"></span>
                </div>
                <div className="form-group">
                    <label htmlFor="email">이메일</label>
                    <div className="email-group">
                        <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} onKeyUp={emailCheck} required/>
                        <button type="button" onClick={sendEmailCode}>인증 코드 전송</button>
                    </div>
                    {emailCodeSent && (
                        <div className="email-verification">
                            <input
                                type="text"
                                name="emailCode"
                                value={formData.emailCode}
                                onChange={handleChange}
                                placeholder="인증 코드 입력"
                                required
                            />
                            <button type="button" onClick={verifyEmailCode}>확인</button>
                        </div>
                    )}
                    <span id="emailInfo" className="error"></span>
                </div>
                <div className="form-group">
                    <label htmlFor="birth">생년월일</label>
                    <input type="text" id="birth" name="birth" value={formData.birth} onChange={handleChange} onKeyUp={birthCheck} required/>
                    <span id="birthInfo" className="error"></span>
                </div>
                <div className="form-group">
                    <label htmlFor="gender">성별</label>
                    <select id="gender" name="gender" value={formData.gender} onChange={handleChange} required>
                        <option value="M">남성</option>
                        <option value="W">여성</option>
                    </select>
                </div>
                <button className="button1" type="submit">회원가입</button>
                <button className="button2" type="button">뒤로가기</button>
            </form>
        </div>
    );
};

export default MemberRegister;
