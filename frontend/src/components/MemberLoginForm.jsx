import React from 'react';

const MemberLoginForm = () => {
    return (
        <div className="loginForm">
            <div className="form-group">
                <label htmlFor="username">아이디</label>
                <input type="text" id="username" name="username" className="form-control" />
            </div>
            <div className="form-group">
                <label htmlFor="password">비밀번호</label>
                <input type="password" id="password" name="password" className="form-control" />
            </div>
            <button className="login-button">로그인</button>
            <div className="help-links">
                <a href="#">아이디 찾기</a>
                <a href="#">비밀번호 찾기</a>
                <a href="#">회원가입</a>
            </div>
        </div>
    );
}

export default MemberLoginForm;
