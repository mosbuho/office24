import React, { useState } from 'react';

const MemberLoginForm = () => {
    const [formData, setFormData] = useState({
        id: '',
        pw: ''
    });


    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value });
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        const response = await fetch('/member/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Login successful:', data);
            alert("로그인 성공")
        } else {
            console.error('Login failed');
            alert("로그인 실패")
        }
    };

    return (
        <form className="loginForm" onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="id">아이디</label>
                <input
                    type="text"
                    id="id"
                    name="id"
                    className="form-control"
                    value={formData.id}
                    onChange={handleChange}
                />
            </div>
            <div className="form-group">
                <label htmlFor="pw">비밀번호</label>
                <input
                    type="password"
                    id="pw"
                    name="pw"
                    className="form-control"
                    value={formData.pw}
                    onChange={handleChange}
                />
            </div>
            <button type="submit" className="login-button">로그인</button>
            <div className="help-links">
                <a href="#">아이디 찾기</a>
                <a href="#">비밀번호 찾기</a>
                <a href="#">회원가입</a>
            </div>
        </form>
    );
};

export default MemberLoginForm;
