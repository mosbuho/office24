import MemberDeleteForm from "../components/MemberDeleteForm.jsx";
import Logo from "../components/Logo.jsx";

import "/src/styles/MemberDelete.css";

const MemberDelete = () => {
    return (
        <div>
            <Logo/>
            <MemberDeleteForm/>
            <button className={"button1"}>회원가입</button>
            <button type={"button"} className={"button2"}>뒤로가기</button>
        </div>
    )
}
export default MemberDelete