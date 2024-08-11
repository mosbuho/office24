import { default as React, useState } from "react";
import { useNavigate } from "react-router-dom";
import MemberFooter from "../../components/member/MemberFooter";
import MemberHeader from "../../components/member/MemberHeader";
import "../../styles/pages/member/MemberMyPage.css";
import TabFavorites from "./TabFavoriteList";
import TabReservations from "./TabReservations";
import TabReviews from "./TabReviews";
import TabMyInfo from "./TabViewInfo";

//component member mypage
function MemberMyPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("viewInfo");

  // interface tabs
  const tabs = [
    { id: "viewInfo", label: "내 정보" },
    { id: "favorites", label: "찜 목록" },
    { id: "reservations", label: "결제 내역" },
    { id: "reviews", label: "내가 쓴 리뷰" },
  ];

  // render tabcontent
  const renderTabContent = () => {
    switch (activeTab) {
      case "viewInfo":
        return <TabMyInfo />;
      case "reservations":
        return <TabReservations />;
      case "reviews":
        return <TabReviews />;
      case "favorites":
        return <TabFavorites />;
      default:
        return null;
    }
  };

  //render my page
  return (
    <div className="member-my-page">
      <MemberHeader />
      <main className="member-content-wrapper">
        <>
          <section className="tab-container">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`tab ${activeTab === tab.id ? "active" : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </section>
          <section className="tab-content">{renderTabContent()}</section>
        </>
      </main>
      <MemberFooter />
    </div>
  );
}

export default MemberMyPage;
