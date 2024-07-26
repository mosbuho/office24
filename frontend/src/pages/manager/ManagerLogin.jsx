import '../../styles/pages/manager/ManagerLogin.css';

const ManagerLogin = () => {

    return (
        <div className="login-container">
            <div className="logo">office24</div>
            <form className="login-form">
                <input type="text" placeholder="아이디를 입력해 주세요." />
                <input type="password" placeholder="비밀번호를 입력해 주세요." />
                <button type="submit" className="login-btn">로그인</button>
            </form>
            <div className="login-options">
                <button >회원가입</button>
                <button >아이디/비밀번호 찾기</button>
            </div>
        </div>
    );
};

export default ManagerLogin;
