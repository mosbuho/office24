import React, {useState} from 'react';
import '/src/styles/pages/member/MemberRegister.css';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import {emailCheck, idCheck, nameCheck, phoneCheck, pwCheck, pwCheckCheck} from '../../utils/MemberRegister.js';

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

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const idDuplicate = () => {
        const id = formData.id;
        if (!id) {
            alert('아이디를 입력하세요.');
            return;
        }
        axios.get(`http://localhost:8080/auth/idCheck`,{ params: { id } })
            .then(response => {
                if (response.status === 200) {
                    alert('사용 가능한 아이디입니다.');
                } else {
                    alert('이미 사용 중인 아이디입니다.');
                }
            })
            .catch(error => {
                alert('회원가입 중 오류가 발생했습니다.');
            });
    };

    const handleSubmit = (e) => {
        console.log('Form Data:', formData);
        e.preventDefault();
        axios.post('http://localhost:8080/auth/register', formData, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                if (response.status === 200) {
                    alert('회원가입 성공');
                    navigate('/');
                } else {
                    alert('회원가입 실패');
                }
            })
            .catch(error => {
                alert('회원가입 중 오류가 발생했습니다.');
                console.log(error);
            });
    };

    return (
        <div className="member-register">
            <h1>회원가입</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group id-group">
                    <label htmlFor="id">아이디</label>
                    <div className="input-group">
                        <input type="text" id="id" name="id" value={formData.id} onChange={handleChange} required
                               onKeyUp={idCheck}/>
                        <button type="button" className="check-btn" onClick={idDuplicate}>아이디 중복 확인</button>
                    </div>
                    <span id="idInfo" className="info-message"></span>
                </div>
                <div className="form-group">
                    <label htmlFor="pw">비밀번호</label>
                    <input type="password" id="pw" name="pw" value={formData.pw} onChange={handleChange}
                           onKeyUp={pwCheck} required />
                    <span id="pwInfo" className="info-message"></span>
                </div>
                <div className="form-group">
                    <label htmlFor="pwCheck">비밀번호 확인</label>
                    <input type="password" id="pwCheck" name="pwCheck" value={formData.pwCheck} onChange={handleChange}
                           onKeyUp={pwCheckCheck} required/>
                    <span id="pwCheckInfo" className="info-message"></span>
                </div>
                <div className="form-group">
                    <label htmlFor="name">이름</label>
                    <input type="text" id="name" name="name" value={formData.name} onChange={handleChange}
                           onKeyUp={nameCheck} required/>
                    <span id="nameInfo" className="info-message"></span>
                </div>
                <div className="form-group">
                    <label htmlFor="email">[선택] 이메일주소</label>
                    <input type="email" id="email" name="email" value={formData.email} onChange={handleChange}
                           onKeyUp={emailCheck}/>
                    <span id="emailInfo" className=""></span>
                </div>
                <div className="form-group">
                    <label htmlFor="birth">생년월일</label>
                    <input type="date" id="birth" name="birth" value={formData.birth} onChange={handleChange} required/>
                    <span id="birthInfo" className="info-message"></span>
                </div>
                <div className="form-group">
                    <label htmlFor="gender">성별</label>
                    <select id="gender" name="gender" value={formData.gender} onChange={handleChange} required>
                        <option value="M">남성</option>
                        <option value="W">여성</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="phone">휴대전화번호</label>
                    <input type="text" id="phone" name="phone" value={formData.phone} onChange={handleChange}
                           onKeyUp={phoneCheck} required/>
                    <span id="phoneInfo" className="info-message"></span>
                </div>
                <button type="submit" className="button1">회원가입</button>
            </form>
        </div>
    );
};

export default MemberRegister;
