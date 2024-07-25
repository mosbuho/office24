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
        gender: 'M'
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (allCheck() && idDuplicate) {
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
                    <input id="phone" type="text" name="phone" value={formData.phone} onChange={handleChange} onKeyUp={phoneCheck} required/>
                    <span id="phoneInfo" className="error"></span>
                </div>
                <div className="form-group">
                    <label htmlFor="email">이메일</label>
                    <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} onKeyUp={emailCheck} required/>
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
