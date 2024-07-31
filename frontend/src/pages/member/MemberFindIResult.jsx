import React from 'react';
import { Link, useLocation, useNavigate } from "react-router-dom";
import '../../styles/pages/member/MemberFindIdResult.css';

const MemberFindIdResult = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { ids } = location.state || { ids: [] };

    const logoClick = () => {
        navigate("/");
    }

    return (
        <div className="member-find-id-result-page">
            <div className="member-find-id-result-form">
                <div className="member-find-id-result-logo" onClick={logoClick}>OFFICE24</div>
                <h2>찾은 아이디</h2>
                <ul>
                    {ids.length > 0 ? ids.map((id, index) => (
                        <li key={index}>{id}</li>
                    )) : (
                        <li>아이디를 찾을 수 없습니다.</li>
                    )}
                </ul>
                <div className="member-find-id-result-button-container">
                    <Link to="/member/resetPw" className="member-find-id-result-link-button">
                        비밀번호 재설정
                    </Link>
                    <Link to="/login" className="member-find-id-result-link-button">
                        로그인 화면으로
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default MemberFindIdResult;
