import { default as React, useEffect, useRef, useState } from "react";
import { CiShare2 } from "react-icons/ci";
import { FaStar } from "react-icons/fa";
import { PiHeartThin, PiHeartFill } from "react-icons/pi";
import { useNavigate, useParams } from "react-router-dom";
import Calendar from "../../components/member/Calendar";
import KakaoMapSingleLocation from "../../components/member/KakaoMapSingleLocation";
import MemberFooter from "../../components/member/MemberFooter";
import MemberHeader from "../../components/member/MemberHeader";
import "../../styles/pages/member/MemberOffice.css";
import axios from '../../utils/axiosConfig';
import { EditorState, convertFromRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { getNo } from "../../utils/auth";

const calculateAverageRating = (reviews) => {
  if (!Array.isArray(reviews) || reviews.length === 0) return 0;

  const totalRating = reviews.reduce((acc, review) => acc + review.RATING, 0);
  const average = totalRating / reviews.length;
  return isNaN(average) ? 0 : Number(average.toFixed(1));
};

const RatingBarGraph = ({ rating, count, total }) => {
  const percentage = (count / total) * 100;

  return (
    <div className="rating-bar">
      <span>{rating}</span>
      <div className="bar-container">
        <div className="bar" style={{ width: `${percentage}%` }}></div>
      </div>
    </div>
  );
};

const ReviewGraph = ({ averageRating = 0, noOfReview, ratingsDistribution }) => {
  return (
    <div className="review-statics-section">
      <h3>
        <FaStar /> {averageRating.toFixed(1)} <span>후기 {noOfReview}개</span>
      </h3>
      <div className="rating-bars">
        {Object.keys(ratingsDistribution).map((rating) => (
          <RatingBarGraph
            key={rating}
            rating={rating}
            count={ratingsDistribution[rating]}
            total={noOfReview}
          />
        ))}
      </div>
    </div>
  );
};

const ReviewList = ({ reviews }) => {
  const [visibleReviews, setVisibleReviews] = useState(6);
  const [isExpanded, setIsExpanded] = useState(false);

  const loadMoreReviews = () => {
    const newVisibleCount = visibleReviews + 6;
    if (newVisibleCount >= reviews.length) {
      setVisibleReviews(reviews.length);
      setIsExpanded(true);
    } else {
      setVisibleReviews(newVisibleCount);
    }
  };

  const collapseReviews = () => {
    setVisibleReviews(6);
    setIsExpanded(false);
  };

  if (!Array.isArray(reviews) || reviews.length === 0) {
    return <></>;
  }

  return (
    <div className="review-list">
      {reviews.slice(0, visibleReviews).map((review, index) => (
        <ReviewItem key={index} review={review} />
      ))}
      {visibleReviews < reviews.length ? (
        <button onClick={loadMoreReviews} className="show-more-button">
          <div>더보기</div>
        </button>
      ) : (
        reviews.length > 6 && (
          <button onClick={collapseReviews} className="show-more-button">
            <div>접기</div>
          </button>
        )
      )}
    </div>
  );
};

const ReviewItem = ({ review }) => {
  return (
    <div className="review-item">
      <div className="reviewer">{review.USERNAME}</div>
      <div className="sub-content-line">
        <div className="reviewScore">
          {[...Array(5)].map((_, index) => (
            <span key={index}>
              {index < review.RATING ? (
                <span style={{ color: "var(--shaded-dark-color)" }}>★</span>
              ) : (
                <span style={{ color: "var(--shaded-color)" }}>★</span>
              )}
            </span>
          ))}
        </div>
        <div className="reviewDate">
          <span>·</span>
          <span>{new Date(review.REG_DATE).toLocaleDateString()}</span>
        </div>
      </div>
      <div className="reviewComment">{review.CONTENT}</div>
    </div>
  );
};

const LocationSection = ({ resultItemData }) => {
  const centerMarker = {
    latitude: resultItemData.latitude,
    longitude: resultItemData.longitude,
    content: resultItemData.title,
  };

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
  const { officeNo } = useParams();
  const navigate = useNavigate();
  const [officeData, setOfficeData] = useState(null);
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const fetchOfficeData = async () => {
      try {
        const response = await axios.get(`/office/${officeNo}`);
        setOfficeData(response.data);

        const userNo = getNo();
        if (userNo) {
          try {
            const likeResponse = await axios.get(`/member/${userNo}/liked-offices`);
            const likedOffices = new Set(likeResponse.data);
            const numericOfficeNo = Number(officeNo);
            const isOfficeLiked = likedOffices.has(numericOfficeNo);
            setIsLiked(isOfficeLiked);
          } catch (likeError) {
            console.error("Error fetching liked offices:", likeError);
          }
        } else {
          setIsLiked(false);
        }

        if (response.data.office.content) {
          const contentState = convertFromRaw(JSON.parse(response.data.office.content));
          setEditorState(EditorState.createWithContent(contentState));
        }
      } catch (err) {
        alert("오피스 정보를 불러오는 중 오류가 발생했습니다.");
      }
    };

    fetchOfficeData();
  }, [officeNo]);

  const handleLikeToggle = async () => {
    const userNo = getNo();
    if (!userNo) {
      const wantLogin = window.confirm("로그인이 필요합니다. 로그인 페이지로 이동하시겠습니까?");
      if (wantLogin) {
        navigate("/login");
      }
      return;
    }

    try {
      const response = await axios.put(`/member/${officeNo}/like`, {
        userNo: userNo,
      });
      if (response.data.success) {
        const newLikeStatus = response.data.isLiked;
        setIsLiked(newLikeStatus);
      }
    } catch (error) {
      if (error.response && error.response.status === 403) {
        const wantLogin = window.confirm(
          "인증이 만료되었습니다. 다시 로그인하시겠습니까?"
        );
        if (wantLogin) {
          localStorage.removeItem("accessToken");
          navigate("/login");
        }
      } else {
        console.error("좋아요 기능 에러:", error);
      }
    }
  };

  if (!officeData) {
    return <></>;
  }

  const {
    office,
    additionalImageUrls,
    reviews = [],
    noOfReview,
    managerName
  } = officeData;

  const averageRating = calculateAverageRating(reviews);

  const ratingsDistribution = reviews.reduce((acc, review) => {
    const rating = review.RATING;
    acc[rating] = (acc[rating] || 0) + 1;
    return acc;
  }, {});

  const LeftColumn = ({ office, averageRating, noOfReview, managerName }) => {
    return (
      <div className="left-column">
        <div className="title">
          <h2>{office.address}</h2>
        </div>
        <div className="information">
          최대 {office.capacity.toLocaleString('ko-KR')}명
        </div>
        <div className="rating">
          <div className="score">
            <FaStar />
            <div className="rate">{averageRating.toFixed(1)}</div>
          </div>
          <u>
            후기<b>({noOfReview})</b>
          </u>
        </div>
        <hr />
        <div className="content" style={{ zIndex: -10 }}>
          <Editor
            editorState={editorState}
            readOnly={true}
            toolbarHidden={true}
          />
        </div>
        <hr />
        <div className="more-information">
          <ReviewGraph
            averageRating={averageRating}
            noOfReview={noOfReview}
            ratingsDistribution={ratingsDistribution}
          />
          <div className="owner-information">
            <div className="owner">Hosted by {managerName}</div>
          </div>
        </div>
      </div>
    );
  };

  const RightColumn = ({ office }) => {
    const today = new Date();
    const [startDate, setStartDate] = useState(today);
    const [endDate, setEndDate] = useState(today);
    const [attendance, setAttendance] = useState(1);
    const [extendDateInput, setExtendDateInput] = useState(false);
    const [extendAttendInput, setExtendAttendInput] = useState(false);
    const attendanceInputRef = useRef(null);
    const navigate = useNavigate();
    const [notallowedDates, setNotallowedDates] = useState([]);

    useEffect(() => {
      const fetchNotAllowedDates = async () => {
        try {
          const response = await axios.get(`/office/${office.no}/notallowed-dates`);
          const dates = response.data.map(date => new Date(date));
          setNotallowedDates(dates);
        } catch (error) {
          console.error("Error fetching unavailable dates:", error);
        }
      };
      fetchNotAllowedDates();
    }, [office.no]);

    const isSameDay = (date1, date2) => {
      return (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate()
      );
    };

    const isDateRangeAvailable = (startDate, endDate) => {
      const datesInRange = getDatesInRange(startDate, endDate);
      return !datesInRange.some(date =>
        notallowedDates.some(notAllowedDate =>
          isSameDay(notAllowedDate, date)
        )
      );
    };

    const getDatesInRange = (startDate, endDate) => {
      let dates = [];
      let currentDate = new Date(startDate);

      while (currentDate <= endDate) {
        dates.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
      }

      return dates;
    };


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

    const renderDateInput = (label, date, onClick) => {
      const safeDate = date || new Date();

      return (
        <div className={`${label.toLowerCase()}-date input-wrapper`}>
          <label htmlFor={`reservation-${label.toLowerCase()}-day-input`} className="search-label">
            {label} 시간
          </label>
          <input
            id={`reservation-${label.toLowerCase()}-day-input`}
            type="text"
            className="search-input"
            value={`${safeDate.getFullYear()}-${safeDate.getMonth() + 1}-${safeDate.getDate()}`}
            readOnly
            onClick={onClick}
          />
        </div>
      );
    };

    const calculateTotalPrice = () => {
      const diffTime = Math.abs(endDate - startDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      return diffDays * (attendance || 1) * office.price;
    };

    const handleReservationClick = (e) => {
      e.preventDefault();
      const isAvailable = isDateRangeAvailable(startDate, endDate);

      if (isAvailable) {
        navigate("/payment", {
          state: {
            startDate: startDate,
            endDate: endDate,
            attendance,
            officeNo: office.no,
            officeData: officeData,
            notallowedDates: notallowedDates
          },
        });
      } else {
        alert("선택하신 날짜는 예약이 불가능합니다.");
      }
    };

    return (
      <>
        <button className="mobile-reservation-button">
          예약하기
        </button>
        <div className="right-column">
          <div className="background-for-input-wrapper">
            <div className="price">
              <h4>
                <b>₩{office.price.toLocaleString()}</b>/일
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
                <div className="attendance-input-wrapper-1">
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
                  }}
                >
                  +
                </button>
                <button
                  onMouseDown={(e) => {
                    e.preventDefault();
                  }}
                >
                  -
                </button>
              </div>
              <button
                className="reservation-button"
                onClick={handleReservationClick}
              >
                예약하기
              </button>
              <div
                className={`extended-input ${extendDateInput ? "extended" : ""}`}
              >
                <div className="extended-input-container">
                  <Calendar
                    settingStartDate={setStartDate}
                    settingEndDate={setEndDate}
                    startDate={startDate}
                    endDate={endDate}
                    excludeDates={notallowedDates}
                  />
                </div>
              </div>
            </div>
            <div className="reservation-information">
              예약이 확정되기 전에는 요금이 청구되지 않습니다.
            </div>
            <hr />
            <div className="total-price-line">
              <div>합계</div>
              <div>₩{calculateTotalPrice().toLocaleString()}</div>
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <>
      <MemberHeader />
      <div className="member-office-page">
        <div className="main-container">
          <div className="item-heading">
            <div className="title">
              <h1>{office.title}</h1>
            </div>
            <div className="item-utils">
              <div className="save" onClick={handleLikeToggle} style={{ cursor: "pointer" }}>
                {isLiked ? <PiHeartFill color="#ff3a33" size={24} /> : <PiHeartThin size={24} />}
                <u>좋아요</u>
              </div>
            </div>
          </div>
          <div className="office-images-wrapper">
            <div
              className="image1"
              style={{
                backgroundImage: `url(http://localhost:8080/img/${office.titleImg})`,
              }}
            ></div>

            {additionalImageUrls.map((url, index) => (
              <div
                key={index}
                className={`image${index + 2}`}
                style={{ backgroundImage: `url(http://localhost:8080/img/${url})` }}
              ></div>
            ))}
          </div>
          <div className="main-content">
            <LeftColumn
              office={office}
              averageRating={averageRating}
              noOfReview={noOfReview}
              ratingsDistribution={ratingsDistribution}
              managerName={managerName}
            />

            <RightColumn office={office} />
          </div>
          <hr />
          <ReviewList reviews={reviews} />
          <LocationSection resultItemData={office} />
        </div>
      </div>
      <MemberFooter />
    </>
  );
};

export default MemberOffice;
