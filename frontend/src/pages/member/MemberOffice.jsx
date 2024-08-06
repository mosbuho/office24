import { default as React, useEffect, useRef, useState } from "react";
import { CiShare2 } from "react-icons/ci";
import { FaStar } from "react-icons/fa";
import { PiHeartThin } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import Calendar from "../../components/member/Calendar";
import KakaoMapSingleLocation from "../../components/member/KakaoMapSingleLocation";
import MemberFooter from "../../components/member/MemberFooter";
import MemberHeader from "../../components/member/MemberHeader";
import "../../styles/pages/member/MemberOffice.css";

//mock data//
const resultItemMockData = {
  no: 1,
  title: "하늘 오피스",
  address: "경기 성남시 분당구 대왕판교로 364",
  zip_code: "13543",
  latitude: 37.3760971555385,
  longitude: 127.102416516508,
  content:
    "경기 성남시에 위치한 하늘 오피스는 편리한 위치와 현대적인 시설을 자랑합니다.<br> <br> 여러 종류의 사무공간을 제공하며, <br> 최신 기술과 편의 시설을 갖추고 있습니다. <br> <br> 여러 종류의 사무공간을 제공하며, <br> 최신 기술과 편의 시설을 갖추고 있습니다. <br> <br> 여러 종류의 사무공간을 제공하며, <br> 최신 기술과 편의 시설을 갖추고 있습니다. <br> <br> 여러 종류의 사무공간을 제공하며, <br> 최신 기술과 편의 시설을 갖추고 있습니다.",
  price: 7000,
  capacity: 20,
  title_img: "c5c45dfd-5fca-4ca5-861a-2d400c5849ee.webp",
  availability: 1,
  reg_date: "2024-08-01T16:38:26",

  officeImgURL1: "/demooffice1.webp",
  officeImgURL2: "/demooffice2.webp",
  officeImgURL3: "/demooffice3.webp",

  rating: 4.5,

  rating1: 1,
  rating2: 1,
  rating3: 3,
  rating4: 6,
  rating5: 29,
  noOfReview: 40,

  hostname: "SkyOffice",
  hostRating: 5.4,
  hostReview: 120,
  host_regdate: "2024-08-01T16:38:26",
};
//mock data//
const reviewMockData = [
  {
    id: 1,
    username: "김철수",
    score: 5,
    comment:
      "정말 좋은 오피스 공간이에요. 깨끗하고 조용해서 업무에 집중하기 좋았습니다.정말 좋은 오피스 공간이에요. 깨끗하고 조용해서 업무에 집중하기 좋았습니다.정말 좋은 오피스 공간이에요. 깨끗하고 조용해서 업무에 집중하기 좋았습니다.정말 좋은 오피스 공간이에요. 깨끗하고 조용해서 업무에 집중하기 좋았습니다.정말 좋은 오피스 공간이에요. 깨끗하고 조용해서 업무에 집중하기 좋았습니다.",
    regdate: "2024-03-15T09:30:00",
  },
  {
    id: 2,
    username: "이영희",
    score: 4,
    comment: "위치가 좋고 시설도 괜찮아요. 다만 주차가 조금 불편했습니다.",
    regdate: "2024-03-10T14:45:00",
  },
  {
    id: 3,
    username: "박지민",
    score: 5,
    comment: "직원들이 친절하고 서비스가 훌륭해요. 다음에도 이용하고 싶습니다.",
    regdate: "2024-03-05T11:20:00",
  },
  {
    id: 4,
    username: "최수진",
    score: 3,
    comment:
      "시설은 좋지만 가격이 조금 비싼 편이에요. 할인 이벤트가 있으면 좋겠어요.",
    regdate: "2024-02-28T16:55:00",
  },
  {
    id: 5,
    username: "정민우",
    score: 4,
    comment:
      "전반적으로 만족스러웠어요. 인터넷 속도가 빠르고 회의실도 잘 갖춰져 있습니다.",
    regdate: "2024-02-20T13:10:00",
  },
  {
    id: 6,
    username: "송지은",
    score: 5,
    comment:
      "환경이 정말 쾌적하고 좋았습니다. 특히 공용 공간의 디자인이 멋져요.",
    regdate: "2024-02-15T10:05:00",
  },
  {
    id: 7,
    username: "강동원",
    score: 4,
    comment:
      "업무 효율성이 높아졌어요. 다만 주변 식당이 좀 더 다양했으면 좋겠어요.",
    regdate: "2024-02-10T15:30:00",
  },
  {
    id: 8,
    username: "한소희",
    score: 5,
    comment:
      "정말 훌륭한 오피스 공간입니다. 직원들의 서비스 마인드가 특히 인상적이었어요. 항상 미소로 맞이해주시고, 어떤 요청사항이라도 신속하게 처리해주셨습니다. 회의실 예약 시스템도 사용하기 편리했고, 공용 주방의 커피머신도 고급스러워서 좋았습니다. 앞으로도 계속 이용할 예정이에요!",
    regdate: "2024-02-05T09:15:00",
  },
  {
    id: 9,
    username: "임재현",
    score: 3,
    comment:
      "위치는 좋지만 소음이 조금 있어요. 방음 시설 개선이 필요할 것 같습니다.",
    regdate: "2024-01-30T14:20:00",
  },
  {
    id: 10,
    username: "오나라",
    score: 5,
    comment:
      "청결도가 매우 높고 인테리어가 세련되어 있어요. 고객을 만나기에 좋은 환경입니다.",
    regdate: "2024-01-25T11:40:00",
  },
  {
    id: 11,
    username: "서민재",
    score: 4,
    comment:
      "편의시설이 잘 갖춰져 있어 좋았습니다. 프린터 사용이 무료라 특히 좋았어요.",
    regdate: "2024-01-20T16:00:00",
  },
  {
    id: 12,
    username: "유지민",
    score: 5,
    comment:
      "보안 시스템이 잘 되어 있어 안심하고 일할 수 있었습니다. 24시간 이용 가능한 점도 큰 장점이에요.",
    regdate: "2024-01-15T10:30:00",
  },
  {
    id: 13,
    username: "박서준",
    score: 4,
    comment:
      "전체적으로 만족스러웠습니다. 다만 엘리베이터 대기 시간이 조금 길었어요.",
    regdate: "2024-01-10T13:45:00",
  },
  {
    id: 14,
    username: "김다미",
    score: 5,
    comment:
      "업무 공간의 레이아웃이 효율적이고 쾌적해요. 특히 자연 채광이 잘 들어와서 기분 좋게 일할 수 있었습니다. 공용 라운지에서의 네트워킹 기회도 많아 좋았고, 정기적으로 열리는 세미나와 워크샵도 매우 유익했어요. 다른 회사들과의 협업 기회도 많아져서 비즈니스에 큰 도움이 되었습니다. 앞으로도 계속 이용할 예정이에요!",
    regdate: "2024-01-05T09:00:00",
  },
];

// function 호스트 평균 평점 계산 함수 //
const calculateAverageRating = () => {
  const { rating1, rating2, rating3, rating4, rating5, noOfReview } =
    resultItemMockData;
  const average =
    (rating1 + 2 * rating2 + 3 * rating3 + 4 * rating4 + 5 * rating5) /
    noOfReview;
  return Number(average.toFixed(1));
};

// function 호스트 경력 계산 함수 //
const calculateTimeDifference = (regDate) => {
  const now = new Date();
  const registrationDate = new Date(regDate);
  const diffTime = Math.abs(now - registrationDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays >= 365) {
    const years = Math.floor(diffDays / 365);
    return `${years}년 전`;
  } else if (diffDays >= 30) {
    const months = Math.floor(diffDays / 30);
    return `${months}개월 전`;
  } else {
    return `${diffDays}일 전`;
  }
};
const hostJoinedTime = calculateTimeDifference(resultItemMockData.host_regdate);
const averageRating = calculateAverageRating();

//component그래프 바 렌더링//
const RatingBarGraph = ({ rating, count, total }) => {
  const percentage = (count / total) * 100;

  //render그래프 바 렌더링//
  return (
    <div className="rating-bar">
      <span>{rating}</span>
      <div className="bar-container">
        <div className="bar" style={{ width: `${percentage}%` }}></div>
      </div>
    </div>
  );
};

//component그래프 렌더링//
const ReviewGraph = ({ averageRating, resultItemMockData }) => {
  //render그래프 렌더링//
  return (
    <div className="review-statics-section">
      <h3>
        <FaStar /> {averageRating.toFixed(1)} · 후기
        {resultItemMockData.noOfReview}개
      </h3>
      <div className="rating-bars">
        <RatingBarGraph
          rating={5}
          count={resultItemMockData.rating5}
          total={resultItemMockData.noOfReview}
        />
        <RatingBarGraph
          rating={4}
          count={resultItemMockData.rating4}
          total={resultItemMockData.noOfReview}
        />
        <RatingBarGraph
          rating={3}
          count={resultItemMockData.rating3}
          total={resultItemMockData.noOfReview}
        />
        <RatingBarGraph
          rating={2}
          count={resultItemMockData.rating2}
          total={resultItemMockData.noOfReview}
        />
        <RatingBarGraph
          rating={1}
          count={resultItemMockData.rating1}
          total={resultItemMockData.noOfReview}
        />
      </div>
    </div>
  );
};

//component 리뷰목록 렌더링 //
const ReviewList = ({ reviews }) => {
  const [visibleReviews, setVisibleReviews] = useState(6);
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleReviews = () => {
    if (isExpanded) {
      setVisibleReviews(6);
      setIsExpanded(false);
    } else {
      setVisibleReviews(reviews.length);
      setIsExpanded(true);
    }
  };
  //render 리뷰목록 렌더링 //
  return (
    <div className="review-list">
      {reviews.slice(0, visibleReviews).map((review, index) => (
        <ReviewItem key={index} review={review} />
      ))}
      {reviews.length > 6 && (
        <button onClick={toggleReviews} className="show-more-button">
          <div>{isExpanded ? "접기" : "더보기"}</div>
        </button>
      )}
    </div>
  );
};
//component 리뷰 아이템 렌더링 //
const ReviewItem = ({ review }) => {
  //render 리뷰 아이템 렌더링 //
  return (
    <div className="review-item">
      <div className="reviewer">{review.username}</div>
      <div className="sub-content-line">
        <div className="reviewScore">
          {[...Array(5)].map((_, index) => (
            <span key={index}>
              {index < review.score ? (
                <span style={{ color: "var(--shaded-dark-color)" }}>★</span>
              ) : (
                <span style={{ color: "var(--shaded-color)" }}>★</span>
              )}
            </span>
          ))}
        </div>
        <div className="reviewDate">
          <span>·</span>
          <span>{calculateTimeDifference(review.regdate)}</span>
        </div>
      </div>
      <div className="reviewComment">{review.comment}</div>
    </div>
  );
};

//component 지도 렌더링 //
const LocationSection = ({ resultItemData }) => {
  const centerMarker = {
    latitude: resultItemData.latitude,
    longitude: resultItemData.longitude,
    content: resultItemData.title,
  };

  //render 지도 렌더링 //
  return (
    <div className="map-section-wrapper">
      <div className="map-title">위치</div>
      <div className="map-address">{resultItemData.address}</div>
      <div className="map-section">
        <KakaoMapSingleLocation centerMarker={centerMarker} />
      </div>
    </div>
  );
};

const MemberOffice = () => {
  const formatDate = (date) => {
    return date.toISOString().split("T")[0];
  };
  //render LeftCol
  const LeftColumn = ({
    resultItemMockData,
    averageRating,
    hostJoinedTime,
  }) => {
    return (
      <div className="left-column">
        <div className="title">
          <h2>{resultItemMockData.address}</h2>
        </div>
        <div className="information">
          총 좌석 {resultItemMockData.capacity}석 · 오늘 남은 좌석{" "}
          {resultItemMockData.availability}석
        </div>
        <div className="rating">
          <div className="score">
            <FaStar />
            <div className="rate">{averageRating}</div>
          </div>
          <span>·</span>
          <u>
            후기<b>({resultItemMockData.noOfReview})</b>
          </u>
        </div>
        <hr />
        <div
          className="content"
          dangerouslySetInnerHTML={{ __html: resultItemMockData.content }}
        />
        <hr />
        <div className="more-information">
          <ReviewGraph
            averageRating={averageRating}
            resultItemMockData={resultItemMockData}
          />
          <div className="owner-information">
            <div className="owner">호스트: {resultItemMockData.hostname}</div>
            <div>호스팅 시작: {hostJoinedTime}</div>
          </div>
        </div>
      </div>
    );
  };
  //Component RightCol
  const RightColumn = ({ resultItemMockData }) => {
    // function: 날짜 포맷 //
    const formatDate = (date) => {
      if (!date) return "";
      return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    };
    const today = new Date();
    const [startDate, setStartDate] = useState(today);
    const [endDate, setEndDate] = useState(today);
    const [attendance, setAttendance] = useState(1);
    const [extendDateInput, setExtendDateInput] = useState(false);
    const [extendAttendInput, setExtendAttendInput] = useState(false);
    const attendanceInputRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
      const handleClickOutside = (event) => {
        const attendanceWrapper = document.querySelector(".attend-count");
        const dateInputWrapper = document.querySelector(".date-input-wrapper");
        const calendar = document.querySelector(".calendar");

        if (
          attendanceWrapper &&
          !attendanceWrapper.contains(event.target) &&
          !event.target.closest("button")
        ) {
          setExtendAttendInput(false);
          setAttendance((prev) => prev || 1);
        }

        if (
          dateInputWrapper &&
          !dateInputWrapper.contains(event.target) &&
          calendar &&
          !calendar.contains(event.target)
        ) {
          setExtendDateInput(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleExtendDateInput = () => setExtendDateInput(!extendDateInput);
    const toggleExtendAttendInput = () => {
      setExtendAttendInput(!extendAttendInput);
      if (!extendAttendInput) {
        setAttendance("");
        setTimeout(() => {
          if (attendanceInputRef.current) {
            attendanceInputRef.current.focus();
          }
        }, 0);
      } else {
        setAttendance((prev) => prev || 1);
      }
    };

    const renderDateInput = (label, date, onClick) => (
      <div className={`${label.toLowerCase()}-date input-wrapper`}>
        <label
          htmlFor={`reservation-${label.toLowerCase()}-day-input`}
          className="search-label"
        >
          {label} 시간
        </label>
        <input
          id={`reservation-${label.toLowerCase()}-day-input`}
          type="text"
          className="search-input"
          value={formatDate(date)}
          readOnly
          onClick={onClick}
        />
      </div>
    );

    const calculateTotalPrice = () => {
      const diffTime = Math.abs(endDate - startDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      return diffDays * (attendance || 1) * resultItemMockData.price;
    };

    return (
      <>
        <button
          className="mobile-reservation-button"
          onClick={() =>
            navigate("/payment", {
              state: {
                startDate: startDate,
                endDate: endDate,
                attendance,
                officeNo: resultItemMockData.officeNo,
              },
            })
          }
        >
          예약하기
        </button>
        <div className="right-column">
          <div className="background-for-input-wrapper">
            <div className="price">
              <h4>
                <b>₩{resultItemMockData.price.toLocaleString()}</b> /1석&1일
              </h4>
            </div>
            <h3>사용 기간과 인원 입력하고 가격을 확인하세요</h3>
            <div className="extended-input-wrapper">
              <div className="date-input-wrapper">
                {renderDateInput("시작", startDate, toggleExtendDateInput)}
                {renderDateInput("종료", endDate, toggleExtendDateInput)}
              </div>
              <div
                className={`attend-count ${extendAttendInput ? "extend" : ""}`}
                onClick={(e) => {
                  if (
                    !e.target.closest("button") &&
                    !e.target.closest("input")
                  ) {
                    toggleExtendAttendInput();
                  }
                }}
              >
                <div className="attendance-input-wrapper">
                  <label
                    htmlFor="reservation-attendance-input"
                    className="search-label"
                  >
                    인원
                  </label>
                  <div className="attendance-input-wrapper">
                    <input
                      id="reservation-attendance-input"
                      type="number"
                      className="search-input"
                      value={attendance}
                      onChange={(e) => {
                        const value = parseInt(e.target.value, 10);
                        if (!isNaN(value)) {
                          setAttendance(value);
                        }
                      }}
                      onBlur={() => {
                        setAttendance((prev) => prev || 1);
                        setExtendAttendInput(false);
                      }}
                      min="1"
                      max="100"
                      step="1"
                      ref={attendanceInputRef}
                    />
                  </div>
                </div>
                <button
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setAttendance((prev) => Math.min(100, (prev || 0) + 1));
                  }}
                >
                  +
                </button>
                <button
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setAttendance((prev) => Math.max(1, (prev || 1) - 1));
                  }}
                >
                  -
                </button>
              </div>
              <button
                className="reservation-button"
                onClick={() =>
                  navigate("/payment", {
                    state: {
                      startDate: startDate,
                      endDate: endDate,
                      attendance,
                      officeNo: resultItemMockData.officeNo,
                    },
                  })
                }
              >
                예약하기
              </button>
              <div
                className={`extended-input ${
                  extendDateInput ? "extended" : ""
                }`}
              >
                <div className="extended-input-container">
                  <Calendar
                    settingStartDate={setStartDate}
                    settingEndDate={setEndDate}
                    startDate={startDate}
                    endDate={endDate}
                  />
                </div>
              </div>
            </div>
            <div className="reservation-information">
              #예약이 확정되기 전에는 요금이 청구되지 않습니다.
            </div>
            <hr />
            <div className="total-price-line">
              <div>총합계</div>
              <div>₩{calculateTotalPrice().toLocaleString()}</div>
            </div>
          </div>
        </div>
      </>
    );
  };

  //Render MemberOfficePage

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <>
      <MemberHeader />
      <div className="member-office-page">
        <div className="main-container">
          <div className="item-heading">
            <div className="title">
              <h1>{resultItemMockData.title}</h1>
            </div>
            <div className="item-utils">
              <div className="share">
                <CiShare2 />
                <u>공유</u>
              </div>
              <div className="save">
                <PiHeartThin />
                <u>저장</u>
              </div>
            </div>
          </div>
          <div className="office-images-wrapper">
            <div
              className="image1"
              style={{
                backgroundImage: `url(${resultItemMockData.officeImgURL1})`,
              }}
            ></div>

            <div
              className="image2"
              style={{
                backgroundImage: `url(${resultItemMockData.officeImgURL2})`,
              }}
            ></div>

            <div
              className="image3"
              style={{
                backgroundImage: `url(${resultItemMockData.officeImgURL3})`,
              }}
            ></div>
          </div>
          <div className="main-content">
            <LeftColumn
              resultItemMockData={resultItemMockData}
              averageRating={averageRating}
              hostJoinedTime={hostJoinedTime}
            />

            <RightColumn resultItemMockData={resultItemMockData} />
          </div>
          <hr />
          <ReviewList reviews={reviewMockData} />
          <LocationSection resultItemData={resultItemMockData} />
        </div>
      </div>
      <MemberFooter />
    </>
  );
};

export default MemberOffice;
