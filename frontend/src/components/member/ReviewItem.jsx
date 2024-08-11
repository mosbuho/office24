import { useState } from "react";
import { EditReviewPopup } from "./Popups";

//component reviewItem
export function ReviewItem({ customTitle, ...review }) {
  const [isReviewPopupOpen, setIsReviewPopupOpen] = useState(false);

  const handleEdit = (review) => {
    setIsReviewPopupOpen(true);
  };

  const renderStars = (rating) => {
    const filledStars = "★".repeat(rating);
    const emptyStars = "☆".repeat(5 - rating);
    return filledStars + emptyStars;
  };
  //render reviewItem
  return (
    <div className="review-item">
      <div className="review-header">
        <div className="text-container">
          <h4>{customTitle ? customTitle : review.title}</h4>

          <h4>{renderStars(review.rating)}</h4>
          <p>{review.content}</p>
        </div>
        <div className="edit-button" onClick={handleEdit}>
          <p>수정</p>
        </div>
      </div>
      {isReviewPopupOpen && (
        <EditReviewPopup
          initialValue={review}
          onClose={() => setIsReviewPopupOpen(false)}
        />
      )}
    </div>
  );
}
