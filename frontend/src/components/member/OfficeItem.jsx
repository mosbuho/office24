import React from "react";
import "../../styles/components/member/OfficeItem.css";

const OfficeItem = () => {
  return (
    <div className="office-item">
      <div className="office-item-image-box">
        <div className="office-item-like-on-image">
          <div className="icon heart-icon"></div>
        </div>
        <div className="office-item-image">
          <img className="img100100" src="../../../public/demooffice1.webp" />
        </div>
      </div>
      {/* end of office-item-image-box */}
      <div className="office-item-content">
        <div className="office-item-top">
          <div className="office-item-top-left">
            <h1>강남역 사무실</h1>
          </div>
          <div className="office-item-top-right">
            <div className="icon-wrap-small">
              <div className="icon star-icon"></div>
            </div>
            <div className="office-item-rating-values">
              <p> 4.5 · (40)</p>
            </div>
          </div>
        </div>

        <div className="office-item-middle">
          <p>강남역 5Km</p>
        </div>

        <div className="office-item-bottom">
          <div className="office-item-price">
            <p>
              <b>40000원/1박</b> · 50 seats
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfficeItem;
