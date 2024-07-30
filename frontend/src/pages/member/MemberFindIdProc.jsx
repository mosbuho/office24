import React from 'react';
import {Link, useLocation, useNavigate} from "react-router-dom";
import '../../styles/pages/member/MemberFindIdProc.css';

const MemberFindIdProc = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const {ids} = location.state || { ids: [] };

    const logoClick = () => {
        navigate("/");
    }

    return (
        <div className="find-id-result-page">
            <div className="find-id-result-form">
                <div className="logo" onClick={logoClick}>OFFICE24</div>
                <h2>찾은 아이디</h2>
                <ul>
                    {ids.map((id, index) => (
                        <li key={index}>{id}</li>
                    ))}
                </ul>
                <div className="button-container">
                    <Link to="/member/findPw" className="link-button">
                        비밀번호 찾기
                    </Link>
                    <Link to="/login" className="link-button">
                        로그인 화면으로
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default MemberFindIdProc;