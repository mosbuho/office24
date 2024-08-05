import { useEffect, useRef, useState } from "react";
import { FaStar } from "react-icons/fa6";
import { IoChevronBack, IoCloseCircle } from "react-icons/io5";
import { useLocation, useNavigate } from "react-router-dom";
import Calendar from "../../components/member/Calendar.jsx";
import MemberFooter from "../../components/member/MemberFooter.jsx";
import "../../styles/pages/member/MemberPayment.css";
//mockdata

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

const MemberPayment = () => {
  // State variables for date and attendance

  const location = useLocation();
  const navigate = useNavigate();

  const [showDatePopup, setShowDatePopup] = useState(false);
  const [showAttendancePopup, setShowAttendancePopup] = useState(false);
  const [showPhoneNumberPopup, setShowPhoneNumberPopup] = useState(false);

  const [startDate, setStartDate] = useState(location.state?.startDate || null);
  const [endDate, setEndDate] = useState(location.state?.endDate || null);
  const [attendance, setAttendance] = useState(location.state?.attendance || 1);
  const [officeNo, setOfficeNo] = useState(location.state?.officeNo || null);
  const attendanceInputRef = useRef(null);
  const [officeData, setOfficeData] = useState(
    location.state?.officeData || null
  );
  const [paymentMethod, setPaymentMethod] = useState("new-credit-card");

  const diffTime = Math.abs(endDate - startDate);
  // Function reset scroll position
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  // Function formateDate
  const formatDate = (date) => {
    if (!date) return "";
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  };

  // Function formateNumber
  function formatPhoneNumber(phoneNumber) {
    const cleaned = phoneNumber.replace(/\D/g, "");

    if (cleaned.length <= 8) {
      // xxxx-xxxx
      return cleaned.replace(/(\d{4})(\d{0,4})/, "$1-$2").trim();
    } else if (cleaned.length <= 10) {
      // xx-xxxx-xxxx
      return cleaned.replace(/(\d{2})(\d{4})(\d{0,4})/, "$1-$2-$3").trim();
    } else {
      // xxx-xxxx-xxxx
      return cleaned.replace(/(\d{3})(\d{4})(\d{0,4})/, "$1-$2-$3").trim();
    }
  }

  //function getDiffDays
  const getDiffDays = (start, end) => {
    const diffTime = Math.max(end - start, 0);
    return Math.max(Math.ceil(diffTime / (1000 * 60 * 60 * 24)), 1);
  };

  // component DatePopup
  const DatePopup = ({ onClose, onSave }) => {
    const [localStartDate, setLocalStartDate] = useState(startDate);
    const [localEndDate, setLocalEndDate] = useState(endDate);

    //function handleSave
    const handleSave = () => {
      const finalEndDate = localEndDate || localStartDate;
      onSave(localStartDate, finalEndDate);
      onClose();
    };

    //function handleClear
    const handleClear = () => {
      const today = new Date();
      setLocalStartDate(today);
      setLocalEndDate(today);
    };

    //render DatePopUp
    return (
      <div className="popup-overlay" onClick={onClose}>
        <div
          className="popup calendar-popup"
          onClick={(e) => e.stopPropagation()}
        >
          <h2>{`${getDiffDays(
            localStartDate,
            localEndDate || localStartDate
          )}일`}</h2>
          <button className="popup-close" onClick={onClose}>
            <IoCloseCircle />
          </button>
          <div className="show-date-value">
            <div className="wrap-right">
              <span>시작일</span>
              <div>{formatDate(localStartDate)}</div>
            </div>
            <div className="wrap-left">
              <span>종료일</span>
              <div>{formatDate(localEndDate || localStartDate)}</div>
            </div>
          </div>
          <Calendar
            settingStartDate={setLocalStartDate}
            settingEndDate={setLocalEndDate}
            startDate={localStartDate}
            endDate={localEndDate}
          />
          <div className="popup-buttons">
            <button onClick={handleClear}>
              <u>날짜 지우기</u>
            </button>{" "}
            <button onClick={handleSave}>저장</button>
          </div>
        </div>
      </div>
    );
  };

  // Component AttendancePopup
  const AttendancePopup = ({ onClose, onSave }) => {
    const [localAttendance, setLocalAttendance] = useState(attendance);
    const [extendAttendInput, setExtendAttendInput] = useState(false);
    //function toggleExtendAttendInput
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

    //function handleSave
    const handleSave = () => {
      onSave(localAttendance);
      onClose();
    };
    //function handleClear
    const handleClear = () => {
      setLocalAttendance(1);
    };
    //render AttendancePopup
    return (
      <div className="popup-overlay" onClick={onClose}>
        <div className="popup" onClick={(e) => e.stopPropagation()}>
          <h2>인원 선택</h2>
          <button className="popup-close" onClick={onClose}>
            <IoCloseCircle />
          </button>
          <div className="attendance-value">
            <div
              className={`attend-count ${extendAttendInput ? "extend" : ""}`}
              onClick={(e) => {
                if (!e.target.closest("button") && !e.target.closest("input")) {
                  toggleExtendAttendInput();
                }
              }}
            >
              <div className="attendance-input-wrapper">
                <button
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setLocalAttendance((prev) =>
                      Math.min(100, (prev || 0) + 1)
                    );
                  }}
                >
                  +
                </button>
                <input
                  id="reservation-attendance-input"
                  type="number"
                  className="search-input custom-number-input"
                  value={localAttendance}
                  onChange={(e) => {
                    const value = parseInt(e.target.value, 10);
                    if (!isNaN(value)) {
                      setLocalAttendance(value);
                    }
                  }}
                  onBlur={() => {
                    setLocalAttendance((prev) => prev || 1);
                    setExtendAttendInput(false);
                  }}
                  min="1"
                  max="100"
                  step="1"
                  ref={attendanceInputRef}
                />

                <button
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setLocalAttendance((prev) => Math.max(1, (prev || 1) - 1));
                  }}
                >
                  -
                </button>
              </div>
            </div>
          </div>
          <div className="popup-buttons">
            <button onClick={handleClear}>
              <u>1명 으로</u>
            </button>
            <button onClick={handleSave}>저장</button>
          </div>
        </div>
      </div>
    );
  };

  // Component PhoneNumberPopup
  const PhoneNumberPopup = ({ onClose, onSave }) => {
    const [localPhoneNumber, setLocalPhoneNumber] = useState("");
    const phoneNumberInputRef = useRef(null);

    const handlePhoneChange = (event) => {
      const formattedNumber = formatPhoneNumber(event.target.value);
      setLocalPhoneNumber(formattedNumber);
    };

    const handleSave = () => {
      onSave(localPhoneNumber);
      onClose();
    };

    const handleClear = () => {
      setLocalPhoneNumber("");
    };

    useEffect(() => {
      if (phoneNumberInputRef.current) {
        phoneNumberInputRef.current.focus();
      }
    }, []);

    return (
      <div className="popup-overlay" onClick={onClose}>
        <div className="popup" onClick={(e) => e.stopPropagation()}>
          <h2>전화번호 입력</h2>
          <button className="popup-close" onClick={onClose}>
            <IoCloseCircle />
          </button>
          <div className="phone-number-input-wrapper">
            <input
              id="phone-number-input"
              type="text"
              className="search-input"
              value={localPhoneNumber}
              onChange={handlePhoneChange}
              placeholder="숫자만 입력하세요"
              ref={phoneNumberInputRef}
              maxLength="13"
            />
          </div>
          <div className="popup-buttons">
            <button onClick={handleClear}>
              <u>지우기</u>
            </button>
            <button onClick={handleSave}>저장</button>
          </div>
        </div>
      </div>
    );
  };

  const period = getDiffDays(startDate, endDate);
  const pricePerDay = resultItemMockData.price * period;
  const pricePerAttendance = resultItemMockData.price * attendance;
  const totalPrice = resultItemMockData.price * period * attendance;
  const [phoneNumber, setPhoneNumber] = useState("");
  //render MemberPayment
  return (
    <div>
      <div
        className="member-payment-page-logo"
        onClick={() => navigate("/")}
        style={{ cursor: "pointer" }}
      >
        OFFICE24
      </div>

      <div className="member-payment-page">
        <div className="sub-header">
          <IoChevronBack onClick={() => navigate(-1)} />
          <h2 className="sub-header-title">예약 확정</h2>
        </div>
        <div className="payment-content-wrapper">
          <div className="payment-details">
            <div className="reservation-content">
              <h3>예약정보</h3>
              <div className="value-section">
                <div
                  className="date-value-option value-option"
                  onClick={() => setShowDatePopup(true)}
                >
                  <span>날짜</span>
                  {startDate && endDate && (
                    <p>
                      {formatDate(startDate)} ~ {formatDate(endDate)}
                    </p>
                  )}

                  <u>수정</u>
                </div>
                <div
                  className="attendance-value-option value-option"
                  onClick={() => setShowAttendancePopup(true)}
                >
                  <span>인원</span>
                  <p>{attendance}</p>
                  <u>수정</u>
                </div>
              </div>
              {/* end of value section */}
            </div>
            <hr />
            <div className="reservation-content">
              <h3>결제 수단</h3>
              <div className="dropdown-section" style={{ display: "none" }}>
                <select
                  className="payment-dropdown"
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <option value="new-credit-card">신용카드 추가</option>
                  <option value="credit-card-1">신용카드1</option>
                  <option value="naver-pay">네이버페이</option>
                  <option value="kakao-pay">카카오페이</option>
                </select>
              </div>
              {paymentMethod === "new-credit-card" && (
                <form>
                  <div className="credit-card-form">
                    <input type="text" placeholder="우편번호" />
                    <input type="text" placeholder="카드 만료일 (MM/YY)" />
                    <input type="text" placeholder="CVV" />
                  </div>
                  <input
                    className="one-line-input"
                    type="text"
                    placeholder="우편번호"
                  />
                </form>
              )}
              {/* end of choice section */}
            </div>
            <hr />
            <div className="reservation-content">
              <h3>필수 정보</h3>
              <div className="required-information-section">
                <div className="required-information-item">
                  <div
                    className="required-information-item-title"
                    onClick={() => setShowPhoneNumberPopup(true)}
                  >
                    <span>전화번호</span>
                    {phoneNumber ? (
                      <p>{phoneNumber}</p>
                    ) : (
                      <p className="noPhoneNumber">
                        아직 전화번호가 등록되지 않았습니다. 클릭하여
                        등록해주세요
                      </p>
                    )}
                    <u>수정</u>
                  </div>
                </div>
              </div>

              <hr />

              <div className="reservation-content">
                <h3>환불정책</h3>
                <div className="inform">
                  <p>• 예약 7일 전: 전액 환불</p>
                  <p>• 예약 3일 전: 50% 환불</p>
                  <p>• 예약 3일 이내: 환불 불가</p>
                  <p>
                    • 환불 요청은 고객센터를 통해 접수되며, 7일 이내 처리됩니다.
                  </p>
                </div>
              </div>

              <hr />
              <div className="reservation-content last">
                <h3>기본 규칙</h3>
                <div className="inform">
                  <p>• 대여 시간 엄수</p>
                  <p>• 대여 목적 외 사용 금지, 손상/분실 시 배상</p>
                  <p>• 사용 후 정리 정돈, 쓰레기 배출</p>
                  <p>• 입실 시 신분증 확인, 비밀번호 외부 유출 금지</p>
                  <p>• 금연, 화기 사용 금지, 불법 행위 금지</p>
                </div>
              </div>
            </div>
            {/* end of reservation content */}
          </div>
          {/* end of payment details */}
          <div className="payment-sidebar">
            <div className="payment-display-office-content">
              <div
                className="image"
                style={{
                  backgroundImage: `url(${resultItemMockData.officeImgURL1})`,
                }}
              ></div>
              <div className="office-details">
                <h4 className="office-title">{resultItemMockData.title}</h4>
                <p className="office-address">{resultItemMockData.address}</p>
                <div className="rating-review">
                  <FaStar />
                  <b> {resultItemMockData.rating}</b>
                  <span> · (후기 {resultItemMockData.noOfReview} 개)</span>
                </div>
              </div>
            </div>
            <div className="payment-summary">
              <h3>요금 세부 정보</h3>
              <hr />
              <div className="price-row">
                <span>가격 /1석& 1인</span>
                <span>₩{resultItemMockData.price}</span>
              </div>
              <div className="price-row">
                <span>가격 × 이용 일수({period}일)</span>
                <span>₩{pricePerDay}</span>
              </div>
              <div className="price-row">
                <span>가격 × 출석({attendance}일)</span>
                <span className="price-attendance">₩{pricePerAttendance}</span>
              </div>
              <div className="price-row total">
                <span>총 가격</span>
                <span className="total-price">₩{totalPrice}</span>
              </div>
            </div>

            <button className="payment-button">결제하기</button>
          </div>
        </div>
      </div>
      <MemberFooter />
      {showDatePopup && (
        <DatePopup
          onClose={() => setShowDatePopup(false)}
          onSave={(newStartDate, newEndDate) => {
            setStartDate(newStartDate);
            setEndDate(newEndDate);
            setShowDatePopup(false);
          }}
        />
      )}
      {showAttendancePopup && (
        <AttendancePopup
          onClose={() => setShowAttendancePopup(false)}
          onSave={(newAttendance) => {
            setAttendance(newAttendance);
            setShowAttendancePopup(false);
          }}
        />
      )}
      {showPhoneNumberPopup && (
        <PhoneNumberPopup
          onClose={() => setShowPhoneNumberPopup(false)}
          onSave={(newPhoneNumber) => {
            setPhoneNumber(newPhoneNumber);
            setShowPhoneNumberPopup(false);
          }}
        />
      )}
    </div>
  );
};

export default MemberPayment;
