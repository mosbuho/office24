import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import "../../styles/pages/member/MemberMyPage.css";
import MemberFooter from "./MemberFooter";
import MemberHeader from "./MemberHeader";

function MemberMyPageLayout() {
  const tabs = [
    { id: "viewInfo", label: "내 정보", path: "profile" },
    { id: "favorites", label: "찜 목록", path: "wish" },
    { id: "reservations", label: "결제 내역", path: "booking" },
    { id: "reviews", label: "내가 쓴 리뷰", path: "review" },
  ];

  return (
    <div className="member-my-page">
      <MemberHeader />
      <main className="member-content-wrapper">
        <section className="tab-container">
          {tabs.map((tab) => (
            <NavLink
              key={tab.id}
              to={tab.path}
              className={({ isActive }) => `tab ${isActive ? "active" : ""}`}
            >
              {tab.label}
            </NavLink>
          ))}
        </section>
        <section className="tab-content">
          <Outlet />
        </section>
      </main>
      <MemberFooter />
    </div>
  );
}

export default MemberMyPageLayout;