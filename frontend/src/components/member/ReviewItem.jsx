import { useState } from "react";
import { EditReviewPopup } from "./Popups";

export function ReviewItem({ customTitle, ...review }) {
  const [isReviewPopupOpen, setIsReviewPopupOpen] = useState(false);
  const [currentReview, setCurrentReview] = useState(review);

  const handleEdit = (review) => {
    setIsReviewPopupOpen(true);
  };

  const renderStars = (rating) => {
    const filledStars = "★".repeat(rating);
    const emptyStars = "☆".repeat(5 - rating);
    return filledStars + emptyStars;
  };

  const handleUpdate = (updatedReview) => {
    setCurrentReview(updatedReview);
    setIsReviewPopupOpen(false);
  };

  return (
    <div className="review-item">
      <div className="review-header">
        <div className="text-container">
          <h4>{customTitle ? customTitle : currentReview.title}</h4>
          <h4>{renderStars(currentReview.rating)}</h4>
          <p>{currentReview.content}</p>
        </div>
        <div className="edit-button" onClick={handleEdit}>
          <p>수정</p>
        </div>
      </div>
      {isReviewPopupOpen && (
        <EditReviewPopup
          initialValue={currentReview}
          onClose={() => setIsReviewPopupOpen(false)}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
}
