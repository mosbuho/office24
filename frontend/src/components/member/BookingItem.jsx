import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/components/member/BookingItem.css";
import { getNo } from "../../utils/auth";
import axios from "../../utils/axiosConfig";
import { VerifyPopup } from "./Popups";
import { ReviewItem } from "./ReviewItem";



const BookingItem = ({
  item,
  activeTab,
  onEdit,
  onCancel,
  onReview,
  review,
}) => {
    const navigate = useNavigate();
    const [isReviewPopupOpen, setIsReviewPopupOpen] = useState(false);
    const [isVerifyPopupOpen, setIsVerifyPopupOpen] = useState(false);
    const [currentReview, setCurrentReview] = useState(review);

  
    const handleClick = useCallback(() => {
      navigate(`/office/${item.OFFICE_NO}`);
    }, [navigate, item.OFFICE_NO]);

  const handleUpdate = (updatedReview) => {
    setCurrentReview(updatedReview);
    setIsReviewPopupOpen(false);
  };

  const handleCancelBookingClick = () => {
    setIsVerifyPopupOpen(true);
  };

  const no = getNo();

  const handleCancelBooking = async (response) => {
   if (response === "yes") {
     try {
       await axios.delete(`member/${no}/booking`, {
         params: { bookingNo: item.NO },
       });
       onCancel(item);
     } catch (error) {
       console.error("Error cancelling booking:", error);
       alert("예약 취소에 실패했습니다.");
     }
   }
   setIsVerifyPopupOpen(false);
 };

  const imageUrl = `http://localhost:8080/img/${item.OFFICE_IMG_URL.trim()}`;

  const formattedReview = currentReview
    ? {
        no: currentReview.REVIEWNO,
        title: item.OFFICE_TITLE,
        content: currentReview.CONTENT,
        rating: currentReview.RATING,
      }
    : null;

  return (
    <div className="booking-item">
      <div
        onClick={handleClick}
        className="office-info"
        style={{
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="overlay">
          <h3>{item.OFFICE_TITLE}</h3>
          <p>{item.ADDRESS}</p>
          <p>가격: {item.OFFICE_PRICE}원/일</p>
        </div>

        <div className="booking-dates">
          <p>
            {new Date(item.START_DATE).toLocaleDateString()} ~{" "}
            {new Date(item.END_DATE).toLocaleDateString()}
          </p>
        </div>
      </div>
      {activeTab === "upcoming" && (
        <div className="action-buttons">
          <button onClick={handleCancelBookingClick}>예약 취소</button>
        </div>
      )}

      {(activeTab === "inUse" || activeTab === "past") && (
        <div className="review-section">
          {formattedReview ? (
            <ReviewItem
              {...formattedReview}
              onSelect={() => {}}
              isSelected={false}
              onDelete={() => {}}
            />
          ) : (
            <div className="no-review">
              <h4>작성한 리뷰가 없습니다</h4>
              <button
                onClick={() =>
                  onReview({
                    title: item.OFFICE_TITLE,
                    ...item,
                  })
                }
              >
                작성
              </button>
            </div>
          )}
        </div>
      )}
      {isVerifyPopupOpen && (
        <VerifyPopup
          onConfirm={handleCancelBooking}
          onCancel={() => setIsVerifyPopupOpen(false)}
          msg="예약을 취소하시겠습니까?"
        />
      )}
    </div>
  );
};

export default BookingItem;
