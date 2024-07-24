import MemberLogo from "../components/MemberLogo.jsx";

import "/src/styles/MemberUpdate.css";
import MemberUpdateForm from "../components/MemberUpdateForm.jsx";

const MemberUpdate = () => {
    return (
        <div>
            <MemberLogo/>
            <MemberUpdateForm/>
            <button className={"button1"}>회원수정</button>
            <button type={"button"} className={"button2"}>뒤로가기</button>
        </div>
    )
}

export default MemberUpdate;