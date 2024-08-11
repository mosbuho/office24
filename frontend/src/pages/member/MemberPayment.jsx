import { useEffect, useRef, useState } from "react";
import { FaStar } from "react-icons/fa6";
import { IoChevronBack, IoCloseCircle } from "react-icons/io5";
import { useLocation, useNavigate } from "react-router-dom";
import Calendar from "../../components/member/Calendar.jsx";
import MemberFooter from "../../components/member/MemberFooter.jsx";
import "../../styles/pages/member/MemberPayment.css";
import axios from "../../utils/axiosConfig";
import { getNo } from "../../utils/auth.js";


const MemberPayment = () => {
  const no = getNo();
  const location = useLocation();
  const navigate = useNavigate();

  const [showDatePopup, setShowDatePopup] = useState(false);
  const [showPhoneNumberInputPopup, setShowPhoneNumberInputPopup] = useState(false);
  const [showNameInputPopup, setShowNameInputPopup] = useState(false);
  const [startDate, setStartDate] = useState(location.state?.startDate || null);
  const [endDate, setEndDate] = useState(location.state?.endDate || null);
  const [attendance, setAttendance] = useState(location.state?.attendance || 1);
  const [officeData, setOfficeData] = useState(location.state?.officeData || null);
  const [notallowedDates] = useState(location.state?.notallowedDates || []);
  const [paymentMethod, setPaymentMethod] = useState("new-credit-card");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdn.iamport.kr/js/iamport.payment-1.2.0.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const formatDate = (date) => {
    if (!date) return "";
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  };

  const getDiffDays = (start, end) => {
    const diffTime = Math.max(end - start, 0);
    return Math.max(Math.ceil(diffTime / (1000 * 60 * 60 * 24)), 1);
  };

  const DatePopup = ({ onClose, onSave, notallowedDates }) => {
    const [localStartDate, setLocalStartDate] = useState(startDate);
    const [localEndDate, setLocalEndDate] = useState(endDate);

    const isSameDay = (date1, date2) => {
      return (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate()
      );
    };

    const getDatesInRange = (startDate, endDate) => {
      const date = new Date(startDate.getTime());
      const dates = [];

      while (date <= endDate) {
        dates.push(new Date(date));
        date.setDate(date.getDate() + 1);
      }
      return dates;
    };

    const isDateRangeAvailable = (startDate, endDate) => {
      const datesInRange = getDatesInRange(startDate, endDate);
      return !datesInRange.some(date =>
        notallowedDates.some(notAllowedDate =>
          isSameDay(notAllowedDate, date)
        )
      );
    };

    const handleSave = () => {
      const finalEndDate = localEndDate || localStartDate;

      if (!isDateRangeAvailable(localStartDate, finalEndDate)) {
        alert("선택하신 날짜 범위 내에 예약 불가능한 날짜가 포함되어 있습니다.");
      } else {
        onSave(localStartDate, finalEndDate);
        onClose();
      }
    };

    const handleClear = () => {
      const today = new Date();
      setLocalStartDate(today);
      setLocalEndDate(today);
    };

    return (
      <div className="popup-overlay" onClick={onClose}>
        <div className="popup calendar-popup" onClick={(e) => e.stopPropagation()}>
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
            excludeDates={notallowedDates}
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

  const NameInputPopup = ({ onClose, onSave }) => {
    const [localName, setLocalName] = useState("");
    const nameInputRef = useRef(null);

    const handleNameChange = (e) => {
      setLocalName(e.target.value);
    };

    const handleSave = () => {
      const nameRegex = /^[가-힣]{1,12}$/;
      if (nameRegex.test(localName)) {
        onSave(localName);
        onClose();
      } else {
        alert("이름은 12자 이하의 한글로 입력해주세요.");
      }
    };

    const handleClear = () => {
      setLocalName("");
    };

    useEffect(() => {
      if (nameInputRef.current) {
        nameInputRef.current.focus();
      }
    }, []);

    return (
      <div className="popup-overlay" onClick={onClose}>
        <div className="popup" onClick={(e) => e.stopPropagation()}>
          <h2>이름 입력</h2>
          <button className="popup-close" onClick={onClose}>
            <IoCloseCircle />
          </button>
          <div className="name-input-wrapper">
            <input
              id="name-input"
              type="text"
              className="search-input"
              value={localName}
              onChange={handleNameChange}
              placeholder="12자 이하의 한글이름"
              ref={nameInputRef}
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

  const PhoneNumberInputPopup = ({ onClose, onSave }) => {
    const [localPhoneNumber, setLocalPhoneNumber] = useState("");
    const phoneNumberInputRef = useRef(null);

    const handlePhoneChange = (e) => {
      setLocalPhoneNumber(e.target.value);

    };

    const handleSave = () => {
      const phoneRegex = /^\d{11}$/;
      if (phoneRegex.test(localPhoneNumber)) {
        onSave(localPhoneNumber);
        onClose();
      } else {
        alert("전화번호는 '-' 를 제외한 11자리 숫자로 입력해주세요.");
      }
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
              placeholder="'-' 를 제외한 숫자만 입력하세요"
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

  const {
    office,
    noOfReview,
  } = officeData || {};

  const period = getDiffDays(startDate, endDate);
  const pricePerDay = office.price * period;
  const totalPrice = office.price * period;
  const [phoneNumber, setPhoneNumber] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [postcode, setPostcode] = useState("");

  const isNameValid = /^[가-힣]{1,12}$/.test(name);
  const isPhoneNumberValid = /^\d{11}$/.test(phoneNumber);
  const isEmailValid = email.includes("@");
  const isAddressValid = address.length > 0;
  const isPostcodeValid = postcode.length > 0;
  const IMP_MERCHANT_ID = import.meta.env.VITE_IMP_MERCHANT_ID;

  const handlePayment = async () => {
    if (!isNameValid) {
      alert("이름을 12자 이하의 한글로 입력해주세요.");
      return;
    }
    if (!isPhoneNumberValid) {
      alert("전화번호는 11자리 숫자로 입력해주세요.");
      return;
    }
    if (!isEmailValid) {
      alert("유효한 이메일 주소를 입력해주세요.");
      return;
    }
    if (!isAddressValid) {
      alert("주소를 입력해주세요.");
      return;
    }
    if (!isPostcodeValid) {
      alert("우편번호를 입력해주세요.");
      return;
    }

    const { IMP } = window;
    IMP.init(IMP_MERCHANT_ID);

    const paymentData = {
      pg: paymentMethod === 'kakao-pay' ? 'kakaopay.TC0ONETIME' : 'html5_inicis.INIpayTest',
      pay_method: paymentMethod === 'kakao-pay' ? 'kakaopay' : 'card',
      merchant_uid: `merchant_${new Date().getTime()}`,
      name: 'Office Booking Payment',
      amount: totalPrice,
      buyer_email: email,
      buyer_name: name,
      buyer_tel: phoneNumber,
      buyer_addr: address,
      buyer_postcode: postcode,
      m_redirect_url: 'http://localhost:3000/payments/complete',
    };

    IMP.request_pay(paymentData, async (response) => {
      if (response.success) {
        try {
          const bookingData = {
            office_no: office?.no,
            member_no: no,
            name: name,
            phone: phoneNumber,
            price: totalPrice,
            payment: paymentMethod,
            start_date: startDate.toISOString().split('T')[0],
            end_date: endDate.toISOString().split('T')[0],
          };

          const result = await axios.post('/member/booking', bookingData);
          if (result.status === 200) {
            alert("예약이 성공적으로 완료되었습니다!");
            navigate('/');
          } else {
            alert("예약에 실패했습니다. 다시 시도해주세요.");
          }
        } catch (error) {
          console.error("결제 처리 중 오류가 발생했습니다:", error);
          alert("결제 처리 중 오류가 발생했습니다. 다시 시도해주세요.");
        }
      } else {
        alert(`결제에 실패했습니다: ${response.error_msg}`);
      }
    });
  };

  return (
    <div>
      <div
        className="member-sub-page-logo"
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
                <div className="attendance-value-option value-option">
                  <span>인원</span>
                  <p>{attendance}</p>
                </div>
              </div>
            </div>
            <hr />
            <div className="reservation-content">
              <h3>결제 수단</h3>
              <div className="dropdown-section" >
                <select
                  className="payment-dropdown"
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <option value="credit-card">신용카드</option>
                  <option value="kakao-pay">카카오페이</option>
                </select>
              </div>
            </div>
            <hr />
            <div className="reservation-content">
              <h3>필수 정보</h3>
              <div className="required-information-section">
                <div className="required-information-item">
                  <div
                    className="required-information-item-title"
                    onClick={() => setShowNameInputPopup(true)}
                  >
                    <span>이름</span>
                    {name ? (
                      <p className={isNameValid ? "" : "invalid"}>
                        {name}
                      </p>
                    ) : (
                      <p className="noValue">
                        아직 이름이 등록되지 않았습니다. 클릭하여 등록해주세요.
                      </p>
                    )}
                    {!isNameValid && (
                      <p className="error">이름은 12글자 이하의 한글로 입력해주세요.</p>
                    )}
                    <u>수정</u>
                  </div>
                </div>

                <div className="required-information-item">
                  <div
                    className="required-information-item-title"
                    onClick={() => setShowPhoneNumberInputPopup(true)}
                  >
                    <span>전화번호</span>
                    {phoneNumber ? (
                      <p className={isPhoneNumberValid ? "" : "invalid"}>
                        {phoneNumber}
                      </p>
                    ) : (
                      <p className="noValue">
                        아직 전화번호가 등록되지 않았습니다. 클릭하여
                        등록해주세요.
                      </p>
                    )}
                    {!isPhoneNumberValid && (
                      <p className="error">전화번호는 11자리 숫자로 입력해주세요.</p>
                    )}
                    <u>수정</u>
                  </div>
                </div>
                <div className="required-information-item">
                  <div className="credit-card-form">
                    <input
                      type="text"
                      placeholder="이메일"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <input
                      type="text"
                      placeholder="주소"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                    />
                    <input
                      type="text"
                      placeholder="우편번호"
                      value={postcode}
                      onChange={(e) => setPostcode(e.target.value)}
                      required
                    />
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
                  <p>• 시간 엄수</p>
                  <p>• 목적 외 사용 금지, 손상/분실 시 배상</p>
                  <p>• 사용 후 정리 정돈, 쓰레기 배출</p>
                  <p>• 금연, 화기 사용 금지, 불법 행위 금지</p>
                </div>
              </div>
            </div>
          </div>
          <div className="payment-sidebar">
            <div className="payment-display-office-content">
              <div
                className="image"
                style={{
                  backgroundImage: `url(http://localhost:8080/img/${office?.titleImg})`,
                }}
              ></div>
              <div className="office-details">
                <h4 className="office-title">{office?.title}</h4>
                <p className="office-address">{office?.address}</p>
                <div className="rating-review">
                  <FaStar />
                  <b> {office?.rating}</b>
                  <span> · (후기 {noOfReview} 개)</span>
                </div>
              </div>
            </div>
            <div className="payment-summary">
              <h3>요금 세부 정보</h3>
              <hr />
              <div className="price-row">
                <span>가격</span>
                <span>₩{office?.price.toLocaleString()}</span>
              </div>
              <div className="price-row">
                <span>이용 일수({period}일)</span>
                <span>₩{pricePerDay.toLocaleString()}</span>
              </div>
              <div className="price-row total">
                <span>총 가격</span>
                <span className="total-price">₩{totalPrice.toLocaleString()}</span>
              </div>
            </div>
            <br />
            <button className="payment-button" onClick={handlePayment}>결제하기</button>
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
          notallowedDates={notallowedDates}
        />
      )}
      {showNameInputPopup && (
        <NameInputPopup
          onClose={() => setShowNameInputPopup(false)}
          onSave={(newName) => {
            setName(newName);
            setShowNameInputPopup(false);
          }}
        />
      )}
      {showPhoneNumberInputPopup && (
        <PhoneNumberInputPopup
          onClose={() => setShowPhoneNumberInputPopup(false)}
          onSave={(newPhoneNumber) => {
            setPhoneNumber(newPhoneNumber);
            setShowPhoneNumberInputPopup(false);
          }}
        />
      )}
    </div>
  );
};

export default MemberPayment;
