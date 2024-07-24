import Logo from "../components/Logo.jsx";
import MemberRegisterForm from "../components/MemberRegisterForm.jsx";

import "/src/styles/MemberRegister.css";

const MemberRegister = () => {
    return (
        <div>
            <Logo/>
            <MemberRegisterForm/>
            <button className={"button1"}>회원가입</button>
            <button type={"button"} className={"button2"}>뒤로가기</button>
        </div>
    )
}
export default MemberRegister;