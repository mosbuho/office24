import React from "react";
import { FaStar } from "react-icons/fa";
import { PiHeartThin } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import "../../styles/components/member/OfficeItem.css";

// render: 오피스 아이템 컴포넌트 //
const OfficeItem = (itemData) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/member/office/1");
  };

  return (
    <>
      <div className="office-item" onClick={handleClick}>
        <div className="office-item-image-box">
          <div
            className="office-item-image"
            style={{
              backgroundImage: `url(${itemData.officeImgURL})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              width: "100%",
              height: "100%",
            }}
          ></div>
          <div className="office-item-like-on-image">
            <PiHeartThin />
            {/* <PiHeartStraightFill style={{ color: "red" }} /> */}
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
    </>
  );
};

export default OfficeItem;
