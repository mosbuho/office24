import React from "react";
import { FaStar } from "react-icons/fa";
import { PiHeartThin } from "react-icons/pi";
import "../../styles/components/member/OfficeItem.css";

// render: 오피스 아이템 컴포넌트 //
const OfficeItem = (itemData) => {
  return (
    <div className="office-item">
      <div className="office-item-image-box">
        <div className="office-item-like-on-image">
          <PiHeartThin />
          {/* <PiHeartStraightFill style={{ color: "red" }} /> */}
        </div>
        <div className="office-item-image">
          <img
            className="img100100"
            src="/demooffice1.webp"
            alt="오피스 이미지"
          />
        </div>
      </div>

      <div className="office-item-content">
        <div className="office-item-top">
          <div className="office-item-top-left">
            <h1>{itemData.title}</h1>
          </div>
          <div className="item-rating">
            <FaStar />
            <div className="rate">{itemData.rating}</div>
          </div>
        </div>

        <div className="office-item-middle">
          <p>{itemData.location}</p>
        </div>

        <div className="office-item-bottom">
          <div className="office-item-price">
            <p>
              <b>{itemData.pricePerDay}원/1일</b>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfficeItem;
