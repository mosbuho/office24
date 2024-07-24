import MemberLogo from "../components/MemberLogo.jsx";
import MemberLoginForm from "../components/MemberLoginForm.jsx";
import MemberApis from "../components/MemberApis.jsx";

import "/src/styles/MemberLogin.css";

const MemberLogin = () => {
    return (
        <div className="container">
            <MemberLogo />
            <MemberLoginForm />
            <MemberApis />
        </div>
    );
}

export default MemberLogin;
