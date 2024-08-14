import { useState } from "react";
import { EditReviewPopup } from "./Popups";
import axios from "../../utils/axiosConfig";
import { getNo } from "../../utils/auth";

export function ReviewItem({ customTitle, onDelete, onSelect, isSelected, ...review }) {
  const userNo = getNo();
  const [isReviewPopupOpen, setIsReviewPopupOpen] = useState(false);
  const [currentReview, setCurrentReview] = useState(review);

  const handleEdit = (review) => {
    setIsReviewPopupOpen(true);
  };

  const handleDelete = async () => {
    const confirmed = window.confirm("이 리뷰를 삭제하시겠습니까?");
    if (!confirmed) return;

    try {
      await axios.delete(`/member/${userNo}/review/${currentReview.no}`);

      if (onDelete) {
        onDelete(currentReview.no);
      }
      alert("리뷰가 성공적으로 삭제되었습니다.");
    } catch {
      alert("리뷰를 삭제하는 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  const renderStars = (rating) => {
    const filledStars = "★".repeat(rating);
    const emptyStars = "☆".repeat(5 - rating);
    return filledStars + emptyStars;
  };

  const handleUpdate = (updatedContent) => {
    setCurrentReview(prevReview => ({
      ...prevReview,
      content: updatedContent
    }));
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
        <div className="review-button-group">
          <div className="edit-button" onClick={handleEdit}>
            <p>수정</p>
          </div>
          <div className="del-button" onClick={handleDelete}>
            <p>삭제</p>
          </div>
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
