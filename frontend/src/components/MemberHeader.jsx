import React from 'react';

const MemberHeader = () => {
    return (
        <div className="header">
            <div className="header-logo">로고</div>
            <div className="header-buttons">
                <button className="header-button">로그인</button>
                <button className="header-button">회원가입</button>
            </div>
        </div>
    );
};

export default MemberHeader;
