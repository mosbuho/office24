import OfficeItem from "../../components/member/OfficeItem";
import "../../styles/pages/member/MemberMain.css";

function MemberMain() {
  return (
    <div>
      <h1>Main Page</h1>
      <div className="main-container">
        <div className="office-item-list">
          <OfficeItem />
          <OfficeItem />
          <OfficeItem />
          <OfficeItem />
          <OfficeItem />
          <OfficeItem />
          <OfficeItem />
          <OfficeItem />
          <OfficeItem />
          <OfficeItem />
          <OfficeItem />
          <OfficeItem />
        </div>
      </div>
    </div>
  );
}

export default MemberMain;
