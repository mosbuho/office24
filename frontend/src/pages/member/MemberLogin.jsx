import React from 'react';
import "/src/styles/pages/member/MemberLogin.css"

const MemberLogin = () => {
    return (
        <div className="loginForm">
            <div className="form-group">
                <label htmlFor="id">아이디</label>
                <input type="text" id="id" name="id" className="form-control" />
            </div>
            <div className="form-group">
                <label htmlFor="pw">비밀번호</label>
                <input type="password" id="pw" name="pw" className="form-control" />
            </div>
            <button className="login-button">로그인</button>
            <div className="help-links">
                <a href="#">아이디 찾기</a>
                <a href="#">비밀번호 찾기</a>
                <a href="#">회원가입</a>
            </div>
            <div className="apis">
                <button className="api-button">구글 로그인</button>
                <button className="api-button">카카오 로그인</button>
                <button className="api-button">네이버 로그인</button>
            </div>
        </div>
    );
}

export default MemberLogin;