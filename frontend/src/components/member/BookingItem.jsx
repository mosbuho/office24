import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/components/member/BookingItem.css";
import { getNo } from "../../utils/auth";
import { DeleteBookingPopup } from "./Popups";
import axios from '../../utils/axiosConfig';

const BookingItem = ({
  item,
  activeTab,
  onCancel,
  onReview,
  hasWrittenReview,
  refund = false,
}) => {
  const navigate = useNavigate();
  const [isVerifyPopupOpen, setIsVerifyPopupOpen] = useState(false);

  const handleClick = useCallback(() => {
    navigate(`/office/${item.OFFICE_NO}`);
  }, [navigate, item.OFFICE_NO]);

  const handleCancelBookingClick = () => {
    setIsVerifyPopupOpen(true);
  };

  const handleReviewClick = () => {
    onReview(item);
  };

  const no = getNo();

  const handleCancelBooking = async (response) => {
    if (response === "yes") {
      try {
        await axios.delete(`member/${no}/booking`, {
          params: { bookingNo: item.NO },
        });
        setIsVerifyPopupOpen(false);
        onCancel(item.NO);
      } catch (error) {
        alert("예약 취소에 실패했습니다.");
        setIsVerifyPopupOpen(false);
      }
    } else {
      setIsVerifyPopupOpen(false);
    }
  };

  const imageUrl = `http://localhost:8080/img/${item.OFFICE_IMG_URL.trim()}`;

  return (
    <div className="booking-item">
      <div
        onClick={handleClick}
        className="office-info"
        style={{ backgroundImage: `url(${imageUrl})` }}
      >
        <div className="overlay">
          <h3>{item.OFFICE_TITLE}</h3>
          <p>{item.ADDRESS}</p>
          <p>
            결제 금액 : {item.BOOKING_PRICE.toLocaleString()}원
            {refund && (
              <span className="booking-item-refund-price "> 환불 금액 : {item.REFUND_AMOUNT.toLocaleString()}원</span>
            )}
          </p>
          <p>
            {refund
              ? `결제일 : ${new Date(item.BOOKING_DATE).toISOString().split('T')[0]}`
              : `결제일 : ${new Date(item.REG_DATE).toISOString().split('T')[0]}`
            }
          </p>
          {refund && (
            <p>결제 취소일 : {new Date(item.REG_DATE).toISOString().split('T')[0]}</p>
          )}
        </div>

        <div className="booking-dates">
          <p>
            {new Date(item.START_DATE).toISOString().split('T')[0]}&nbsp;~&nbsp;
            {new Date(item.END_DATE).toISOString().split('T')[0]}
          </p>
        </div>
      </div>
      {activeTab === "upcoming" && (
        <div className="action-buttons">
          <button onClick={handleCancelBookingClick}>예약 취소</button>
        </div>
      )}
      {(activeTab === "inUse" || activeTab === "past") && !hasWrittenReview && (
        <div className="review-create-buttons">
          <button onClick={handleReviewClick}>리뷰 작성</button>
        </div>
      )}
      {isVerifyPopupOpen && (
        <DeleteBookingPopup
          item={{ BOOKING_PRICE: item.BOOKING_PRICE, START_DATE: item.START_DATE }}
          onConfirm={handleCancelBooking}
          onCancel={() => setIsVerifyPopupOpen(false)}
          msg="예약을 취소하시겠습니까?"
        />
      )}
    </div>
  );
};

export default BookingItem;
