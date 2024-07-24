import {Route, Routes} from "react-router-dom";
import MemberLogin from "./MemberLogin.jsx";
import MemberRegister from "./MemberRegister.jsx";
import MemberUpdate from "./MemberUpdate.jsx";
import MemberDelete from "./MemberDelete.jsx";
import MemberPayment from "./MemberPayment.jsx";

import MemberHome from "./MemberHome.jsx";

const MemberMain = () => {
    return (
        <div>
            <Routes>
                <Route path="/" element={<MemberHome/>}/>
                <Route path="login" element={<MemberLogin/>}/>
                <Route path="register" element={<MemberRegister/>}/>
                <Route path="update" element={<MemberUpdate/>}/>
                <Route path="delete" element={<MemberDelete/>}/>
                <Route path="payment" element={<MemberPayment/>}/>
            </Routes>
        </div>
    )
}
export default MemberMain;