import { useState } from "react";
import { ReviewItem } from "../../components/member/ReviewItem";

function MemberReviews() {
  const [reviews, setReviews] = useState([
    {
      no: 1,
      title: "강남역 사무실",
      content:
        "깨끗하고 조용한 환경에서 업무에 집중할 수 있었습니다. 위치도 좋고 시설도 훌륭해요.",
      rating: 5,
      date: "2024-03-15",
    },
    {
      no: 2,
      title: "홍대입구 코워킹스페이스",
      content:
        "창의적인 분위기와 다양한 사람들과의 교류가 가능해서 좋았습니다. 다만 가끔 소음이 있어 아쉬웠어요.",
      rating: 4,
      date: "2024-02-20",
    },
    {
      no: 3,
      title: "판교 테크노밸리 오피스",
      content:
        "최신 시설과 넓은 공간이 인상적이었습니다. IT 기업들이 많아 네트워킹에도 좋았어요.",
      rating: 5,
      date: "2024-01-10",
    },
    {
      no: 4,
      title: "역삼동 비즈니스 센터",
      content:
        "위치가 매우 좋고 회의실 이용이 편리했습니다. 다만 주차 공간이 부족한 점이 아쉬웠어요.",
      rating: 4,
      date: "2023-12-05",
    },
    {
      no: 5,
      title: "성수동 창업 공간",
      content:
        "젊고 활기찬 분위기에서 일할 수 있어 좋았습니다. 주변 카페와 식당도 많아 편리해요.",
      rating: 4,
      date: "2023-11-22",
    },
  ]);

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
    </div>
  );
}

export default MemberReviews;
