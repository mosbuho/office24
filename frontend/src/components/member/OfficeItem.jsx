import React, { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import { PiHeartFill, PiHeartThin } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import "../../styles/components/member/OfficeItem.css";
import { getNo } from "../../utils/auth";
import axios from "../../utils/axiosConfig";

const OfficeItem = ({
  NO,
  TITLE,
  RATING = 0,
  LOCATION,
  PRICEPERDAY,
  OFFICEIMGURL,
  initialLikeStatus = false,
  onLikeChange = null,
}) => {
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(initialLikeStatus);
  const imageUrl = `http://localhost:8080/img/${OFFICEIMGURL}`;

  useEffect(() => {
    setIsLiked(initialLikeStatus);
  }, [initialLikeStatus]);

  const handleClick = () => {
    navigate(`/office/${NO}`);
  };

  const handleLike = async (e) => {
    e.stopPropagation();
    const userNo = getNo();
    if (!userNo) {
      const wantLogin = window.confirm(
        "로그인이 필요합니다. 로그인 페이지로 이동하시겠습니까?"
      );
      if (wantLogin) {
        navigate("/login");
      }
      return;
    }

    try {
      const response = await axios.put(`/member/${NO}/like`, {
        userNo: userNo,
      });
      if (response.data.success) {
        const newLikeStatus = response.data.isLiked;
        setIsLiked(newLikeStatus);
        if (onLikeChange) {
          onLikeChange(NO, newLikeStatus);
        }
      }
    } catch (error) {
      if (error.response && error.response.status === 403) {
        const wantLogin = window.confirm(
          "인증이 만료되었습니다. 다시 로그인하시겠습니까?"
        );
        if (wantLogin) {
          localStorage.removeItem("accessToken");
          navigate("/login");
        }
      } else {
        console.error("좋아요 기능 에러:", error);
      }
    }
  };

  return (
    <div className="office-item">
      <div onClick={handleClick}>
        <div className="office-item-image-box">
          <div
            className="office-item-image"
            style={{
              backgroundImage: `url(${imageUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              width: "100%",
              height: "100%",
            }}
          ></div>
          <div className="office-item-like-on-image" onClick={handleLike}>
            {isLiked ? <PiHeartFill color="red" /> : <PiHeartThin />}
          </div>
        </div>
      </div>
      <div className="office-item-content">
        <div className="office-item-top">
          <div className="office-item-top-left">
            <h1>{TITLE}</h1>
          </div>
          <div className="item-rating">
            <FaStar />
            <div className="rate">{RATING.toFixed(2)}</div>{" "}
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
  );
};

export default OfficeItem;
