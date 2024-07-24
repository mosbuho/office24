import MemberDeleteForm from "../components/MemberDeleteForm.jsx";
import MemberLogo from "../components/MemberLogo.jsx";

import "/src/styles/MemberDelete.css";

const MemberDelete = () => {
    return (
        <div>
            <MemberLogo/>
            <MemberDeleteForm/>
            <button className={"button1"}>회원가입</button>
            <button type={"button"} className={"button2"}>뒤로가기</button>
        </div>
    )
}
export default MemberDelete