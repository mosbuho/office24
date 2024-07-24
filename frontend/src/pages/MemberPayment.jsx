import MemberHeader from "../components/MemberHeader.jsx";
import MemberPaymentPage from "../components/MemberPaymentPage.jsx";
import MemberFooter from "../components/MemberFooter.jsx";

import "/src/styles/MemberPayment.css";
const MemberPayment = () => {
    return (
        <div>
            <MemberHeader/>
            <MemberPaymentPage/>
            <MemberFooter/>
        </div>
    )
}
export default MemberPayment;