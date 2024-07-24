import Logo from "../components/Logo.jsx";

import "/src/styles/MemberUpdate.css";
import MemberUpdateForm from "../components/MemberUpdateForm.jsx";

const MemberUpdate = () => {
    return (
        <div>
            <Logo/>
            <MemberUpdateForm/>
            <button className={"button1"}>회원수정</button>
            <button type={"button"} className={"button2"}>뒤로가기</button>
        </div>
    )
}

export default MemberUpdate;