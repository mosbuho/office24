import { useEffect, useState } from "react";
import { ReviewItem } from "../../components/member/ReviewItem";
import { getNo } from "../../utils/auth";
import axios from "../../utils/axiosConfig";
import '../../styles/pages/member/MemberReviews.css';

function MemberReviews() {
  const no = getNo();
  const [reviews, setReviews] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchReviews = async (currentPage) => {
    try {
      const response = await axios.get(`/member/${no}/review`, {
        params: {
          page: currentPage,
          size: 4
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

      if (reviewData.length < 4) {
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

  const handleDeleteReview = (reviewNo) => {
    setReviews(prevReviews => prevReviews.filter(review => review.no !== reviewNo));
  };

  return (
    <div className="reviews-tab">
      <h2>내가 쓴 리뷰</h2>
      <div className="review-list">
        {reviews.map((review) => (
          <div className="btn-review-out" key={review.no}>
            <ReviewItem {...review} onDelete={handleDeleteReview}/>
          </div>
        ))}
      </div>
      {hasMore && (
        <button onClick={handleLoadMore} className="reviewsbtn">
          <div>
            더보기
          </div>
        </button>
      )}
    </div>
  );
}

export default MemberReviews;
