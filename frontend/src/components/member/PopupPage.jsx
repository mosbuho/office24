import React from "react";
import "../../styles/components/member/PopupPage.css";

function PopupPage({ popupComponent, onClickBackground }) {
  if (!popupComponent) return null;

  return (
    <div className="popup-page">
      <div className="popup-window">{popupComponent}</div>
      <div className="background-cover" onClick={onClickBackground}></div>
    </div>
  );
}

export default PopupPage;
