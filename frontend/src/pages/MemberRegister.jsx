import MemberLogo from "../components/MemberLogo.jsx";
import MemberRegisterForm from "../components/MemberRegisterForm.jsx";

import "/src/styles/MemberRegister.css";

const MemberRegister = () => {
    return (
        <div>
            <MemberLogo/>
            <MemberRegisterForm/>
            <button className={"button1"}>회원가입</button>
            <button type={"button"} className={"button2"}>뒤로가기</button>
        </div>
    )
}
export default MemberRegister;