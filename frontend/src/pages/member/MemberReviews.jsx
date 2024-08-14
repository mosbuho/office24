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
  const [isLoading, setIsLoading] = useState(true);
  const [isEmpty, setIsEmpty] = useState(false);

  const fetchReviews = async (currentPage) => {
    setIsLoading(true);
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

      if (currentPage === 1 && reviewData.length === 0) {
        setIsEmpty(true);
      }

      setReviews(prevReviews => [...prevReviews, ...reviewData]);

      if (reviewData.length < 4) {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews(page);
  }, [page]);

  const handleLoadMore = () => {
    if (hasMore && !isLoading) {
      setPage(prevPage => prevPage + 1);
    }
  };

  const handleDeleteReview = (reviewNo) => {
    setReviews(prevReviews => prevReviews.filter(review => review.no !== reviewNo));
  };

  return (
    <div className="reviews-tab">
      <h2>작성한 리뷰</h2>
      <div className="review-list">
        {isEmpty ? (
          <div>리뷰가 존재하지 않습니다.</div>
        ) : (
          reviews.map((review) => (
            <div className="btn-review-out" key={review.no}>
              <ReviewItem {...review} onDelete={handleDeleteReview} />
            </div>
          ))
        )}
      </div>
      {hasMore && !isLoading && !isEmpty && (
        <button onClick={handleLoadMore} className="reviewsbtn">
          <div>더보기</div>
        </button>
      )}
      {isLoading && !isEmpty && <></>}
    </div>
  );
}

export default MemberReviews;
