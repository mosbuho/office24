import { useState, useEffect } from "react";
import { ReviewItem } from "../../components/member/ReviewItem";
import axios from "../../utils/axiosConfig";
import { getNo } from "../../utils/auth";

function MemberReviews() {
  const no = getNo();
  const [reviews, setReviews] = useState([]);
  const [page, setPage] = useState(1); // 페이지 번호 상태 추가
  const [hasMore, setHasMore] = useState(true); // 더 불러올 데이터가 있는지 확인

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

      // 만약 받아온 데이터의 개수가 size보다 작으면 더 이상 불러올 데이터가 없다고 판단
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

  return (
    <div className="reviews-tab">
      <h2>내가 쓴 리뷰</h2>
      <div className="review-list">
        {reviews.map((review) => (
          <div className="btn-review-out" key={review.no}>
            <ReviewItem {...review} />
          </div>
        ))}
      </div>
      {hasMore && (
        <button onClick={handleLoadMore}
        style={{
          display: 'inline-block',
          marginTop: '20px',
          marginLeft: '235px',
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
