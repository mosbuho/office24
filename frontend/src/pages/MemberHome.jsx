import MemberHeader from "../components/MemberHeader.jsx";
import MemberNewList from "../components/MemberNewList.jsx";
import MemberLowList from "../components/MemberLowList.jsx";
import MemberFooter from "../components/MemberFooter.jsx";

import "/src/styles/MemberHome.css";

const MemberHome = () => {
    return(
        <div>
            <MemberHeader/>
            <MemberNewList/>
            <MemberLowList/>
            <MemberFooter/>
        </div>
    )
}

export default MemberHome;