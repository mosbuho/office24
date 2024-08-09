import React from "react";
import { FaStar } from "react-icons/fa";
import { PiHeartThin } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import "../../styles/components/member/OfficeItem.css";

const OfficeItem = ({ NO, TITLE, RATING, LOCATION, PRICEPERDAY, OFFICEIMGURL }) => {
  const navigate = useNavigate();
  const imageUrl = `http://localhost:8080/img/${OFFICEIMGURL}`;

  const handleClick = () => {
    navigate(`/office/${NO}`);
  };

  return (
    <>
      <div className="office-item">
      <div onClick={handleClick}>
        <div className="office-item-image-box">
          <div className="office-item-like-on-image">
            <PiHeartThin />
          </div>
          <div
            className="office-item-image"
            style={{
              backgroundImage: `url(${imageUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              width: "100%",
              height: "100%",
            }}
          ></div>{" "}
        </div>
      </div>

      <div className="office-item-content">
        <div className="office-item-top">
          <div className="office-item-top-left">
            <h1>{TITLE}</h1>
          </div>
          <div className="item-rating">
            <FaStar />
            <div className="rate">{RATING}</div>
          </div>
        </div>


        <div className="office-item-middle">
          <p>{LOCATION}</p>
        </div>

        <div className="office-item-bottom">
          <div className="office-item-price">
            <p>
              <b>{PRICEPERDAY}원/일</b>
            </p>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default OfficeItem;
