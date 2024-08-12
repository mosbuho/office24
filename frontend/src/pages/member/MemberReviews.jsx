import { useState, useEffect } from "react";
import { ReviewItem } from "../../components/member/ReviewItem";
import axios from "../../utils/axiosConfig";
import { getNo } from "../../utils/auth";

function MemberReviews() {
  const no = getNo();
  const [reviews, setReviews] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedReviews, setSelectedReviews] = useState([]);

  const fetchReviews = async (currentPage) => {
    try {
      const response = await axios.get(`/member/${no}/review`, {
        params: {
          page: currentPage,
          size: 6
        }
      });
      const reviewData = response.data.map(review => ({
        no: review.REVIEWNO,
        title: review.OFFICETITLE,
        content: review.CONTENT,
        rating: review.RATING,
        officeNo: review.OFFICENO
      }));
      
      setReviews(prevReviews => [...prevReviews, ...reviewData]);

      if (reviewData.length < 6) {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  useEffect(() => {
    fetchReviews(page);
  }, [page]);

  const handleLoadMore = () => {
    setPage(prevPage => prevPage + 1); 
  };

  const handleReviewSelect = (reviewNo) => {
    setSelectedReviews((prevSelected) =>
      prevSelected.includes(reviewNo)
        ? prevSelected.filter((no) => no !== reviewNo)
        : [...prevSelected, reviewNo]
    );
  };

  const handleDeleteSelected = async () => {
    const confirmed = window.confirm("선택한 리뷰를 삭제하시겠습니까?");
    if (!confirmed) return;

    try {
      await axios.delete(`/member/review`, { data: { ids: selectedReviews } });

      setReviews((prevReviews) =>
        prevReviews.filter((review) => !selectedReviews.includes(review.no))
      );
      setSelectedReviews([]);
      alert("해당 리뷰가 성공적으로 삭제되었습니다.");
    } catch (error) {
      console.error("Error deleting reviews:", error);
    }
  };

  return (
    <div className="reviews-tab">
      <h2>내가 쓴 리뷰</h2>
      <div className="review-list">
        {reviews.map((review) => (
          <div className="btn-review-out" key={review.no}>
            <ReviewItem {...review}
            onSelect={handleReviewSelect}
            isSelected={selectedReviews.includes(review.no)}
            />
          </div>
        ))}
      </div>
      {selectedReviews.length > 0 && (
        <button onClick={handleDeleteSelected}
        style={{
          display: 'inline-block',
          marginTop: '20px',
          marginRight: '10px',
          padding: '10px 20px',
          backgroundColor: '#f9f9f9',
          color: '#333',
          border: '1px solid #ddd',
          borderRadius: '8px',
          cursor: 'pointer',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          fontSize: '14px',
          fontWeight: 'bold',
          textAlign: 'center'
        }}>
          선택된 리뷰 삭제
        </button>
      )}
      {hasMore && (
        <button onClick={handleLoadMore}
        style={{
          display: 'inline-block',
          marginTop: '20px',
          padding: '10px 20px',
          backgroundColor: '#f9f9f9',
          color: '#333',
          border: '1px solid #ddd',
          borderRadius: '8px',
          cursor: 'pointer',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          fontSize: '14px',
          fontWeight: 'bold',
          textAlign: 'center'
        }}>
          더보기</button>
      )}
    </div>
  );
}

export default MemberReviews;
