import React, { useState } from "react";
import { FaStar } from "react-icons/fa6";
import { IoCloseCircle } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import Calendar from "../../components/member/Calendar";
import MemberFooter from "../../components/member/MemberFooter";
import MemberHeader from "../../components/member/MemberHeader";
import OfficeItem from "../../components/member/OfficeItem";
import "../../styles/pages/member/MemberMyPage.css";

//mock data
const OfficeMockData = [
  {
    id: 1,
    title: "강남역 사무실",
    rating: "4.5",
    noOfRating: "40",
    description: "강남역 사무실",
    location: "강남역",
    pricePerDay: "10000",
    officeImgURL: "/demooffice1.webp",
    longitude: 127.058392,
    latitude: 37.500454,
  },
  {
    id: 2,
    title: "홍대입구 코워킹스페이스",
    rating: "4.8",
    noOfRating: "55",
    description: "홍대입구 코워킹스페이스",
    location: "홍대입구",
    pricePerDay: "12000",
    officeImgURL: "/demooffice2.webp",
    longitude: 126.9237741555385,
    latitude: 37.5575341555385,
  },
  {
    id: 3,
    title: "판교 스타트업 오피스",
    rating: "4.2",
    noOfRating: "28",
    description: "판교 스타트업 오피스",
    location: "판교",
    pricePerDay: "15000",
    officeImgURL: "/demooffice3.webp",
    longitude: 127.108641555385,
    latitude: 37.4021111555385,
  },
  {
    id: 4,
    title: "역삼동 비즈니스 센터",
    rating: "4.6",
    noOfRating: "62",
    description: "역삼동 비즈니스 센터",
    location: "역삼동",
    pricePerDay: "13000",
    officeImgURL: "/demooffice2.webp",
    longitude: 127.0363461555385,
    latitude: 37.5013621555385,
  },
  {
    id: 5,
    title: "신촌 스터디룸",
    rating: "4.3",
    noOfRating: "33",
    description: "신촌 스터디룸",
    location: "신촌",
    pricePerDay: "8000",
    officeImgURL: "/demooffice1.webp",
    longitude: 126.9368931555385,
    latitude: 37.5559761555385,
  },
  {
    id: 6,
    title: "종로 공유 오피스",
    rating: "4.7",
    noOfRating: "48",
    description: "종로 공유 오피스",
    location: "종로",
    pricePerDay: "11000",
    officeImgURL: "/demooffice3.webp",
    longitude: 126.9816111555385,
    latitude: 37.5720251555385,
  },
  {
    id: 7,
    title: "성수동 창업 공간",
    rating: "4.4",
    noOfRating: "37",
    description: "성수동 창업 공간",
    location: "성수동",
    pricePerDay: "9000",
    officeImgURL: "/demooffice1.webp",
    longitude: 127.0557231555385,
    latitude: 37.5443231555385,
  },
  {
    id: 8,
    title: "여의도 비즈니스 센터",
    rating: "4.9",
    noOfRating: "72",
    description: "여의도 비즈니스 센터",
    location: "여의도",
    pricePerDay: "18000",
    officeImgURL: "/demooffice2.webp",
    longitude: 126.9253811555385,
    latitude: 37.5216241555385,
  },
  {
    id: 9,
    title: "강남 디자인 스튜디오",
    rating: "4.6",
    noOfRating: "51",
    description: "강남 디자인 스튜디오",
    location: "강남",
    pricePerDay: "14000",
    officeImgURL: "/demooffice3.webp",
    longitude: 127.028461,
    latitude: 37.497175,
  },
  {
    id: 10,
    title: "서초 법률 사무소",
    rating: "4.5",
    noOfRating: "43",
    description: "서초 법률 사무소",
    location: "서초",
    pricePerDay: "16000",
    officeImgURL: "/demooffice1.webp",
    longitude: 127.0076951555385,
    latitude: 37.4835771555385,
  },
  {
    id: 11,
    title: "광화문 비즈니스 라운지",
    rating: "4.8",
    noOfRating: "59",
    description: "광화문 비즈니스 라운지",
    location: "광화문",
    pricePerDay: "17000",
    officeImgURL: "/demooffice1.webp",
    longitude: 126.9768821555385,
    latitude: 37.5727681555385,
  },
  {
    id: 12,
    title: "이태원 글로벌 오피스",
    rating: "4.3",
    noOfRating: "31",
    description: "이태원 글로벌 오피스",
    location: "이태원",
    pricePerDay: "11000",
    officeImgURL: "/demooffice2.webp",
    longitude: 126.9944441555385,
    latitude: 37.5347221555385,
  },
  {
    id: 13,
    title: "명동 비즈니스 센터",
    rating: "4.7",
    noOfRating: "64",
    description: "명동 비즈니스 센터",
    location: "명동",
    pricePerDay: "15000",
    officeImgURL: "/demooffice2.webp",
    longitude: 126.9858331555385,
    latitude: 37.5638891555385,
  },
  {
    id: 14,
    title: "압구정 프리미엄 오피스",
    rating: "4.9",
    noOfRating: "78",
    description: "압구정 프리미엄 오피스",
    location: "압구정",
    pricePerDay: "20000",
    officeImgURL: "/demooffice2.webp",
    longitude: 127.0286111555385,
    latitude: 37.5272221555385,
  },
  {
    id: 15,
    title: "신사동 코워킹스페이스",
    rating: "4.5",
    noOfRating: "45",
    description: "신사동 코워킹스페이스",
    location: "신사동",
    pricePerDay: "13000",
    officeImgURL: "/demooffice1.webp",
    longitude: 127.0208331555385,
    latitude: 37.5163891555385,
  },
  {
    id: 16,
    title: "잠실 스타트업 허브",
    rating: "4.4",
    noOfRating: "39",
    description: "잠실 스타트업 허브",
    location: "잠실",
    pricePerDay: "12000",
    officeImgURL: "/demooffice2.webp",
    longitude: 127.1002781555385,
    latitude: 37.5138891555385,
  },
  {
    id: 17,
    title: "상암동 미디어 센터",
    rating: "4.6",
    noOfRating: "52",
    description: "상암동 미디어 센터",
    location: "상암동",
    pricePerDay: "14000",
    officeImgURL: "/demooffice3.webp",
    longitude: 126.8894441555385,
    latitude: 37.5794441555385,
  },
  {
    id: 18,
    title: "을지로 비즈니스 타워",
    rating: "4.7",
    noOfRating: "57",
    description: "을지로 비즈니스 타워",
    location: "을지로",
    pricePerDay: "16000",
    officeImgURL: "/demooffice2.webp",
    longitude: 126.9927781555385,
    latitude: 37.5663891555385,
  },
  {
    id: 19,
    title: "청담동 럭셔리 오피스",
    rating: "4.8",
    noOfRating: "68",
    description: "청담동 럭셔리 오피스",
    location: "청담동",
    pricePerDay: "22000",
    officeImgURL: "/demooffice1.webp",
    longitude: 127.0536111555385,
    latitude: 37.5252781555385,
  },
  {
    id: 20,
    title: "구로 디지털단지 오피스",
    rating: "4.3",
    noOfRating: "35",
    description: "구로 디지털단지 오피스",
    location: "구로",
    pricePerDay: "10000",
    officeImgURL: "/demooffice2.webp",
    longitude: 126.8977781555385,
    latitude: 37.4855561555385,
  },
  {
    id: 21,
    title: "마포 창업지원센터",
    rating: "4.5",
    noOfRating: "42",
    description: "마포 창업지원센터",
    location: "마포",
    pricePerDay: "9000",
    officeImgURL: "/demooffice3.webp",
    longitude: 126.9455561555385,
    latitude: 37.5561111555385,
  },
  {
    id: 22,
    title: "용산 IT 밸리 오피스",
    rating: "4.6",
    noOfRating: "49",
    description: "용산 IT 밸리 오피스",
    location: "용산",
    pricePerDay: "13000",
    officeImgURL: "/demooffice3.webp",
    longitude: 126.9652781555385,
    latitude: 37.5327781555385,
  },
  {
    id: 23,
    title: "송파 비즈니스 센터",
    rating: "4.4",
    noOfRating: "38",
    description: "송파 비즈니스 센터",
    location: "송파",
    pricePerDay: "11000",
    officeImgURL: "/demooffice2.webp",
    longitude: 127.1063891555385,
    latitude: 37.5147221555385,
  },
  {
    id: 24,
    title: "노원 스터디카페",
    rating: "4.2",
    noOfRating: "29",
    description: "노원 스터디카페",
    location: "노원",
    pricePerDay: "7000",
    officeImgURL: "/demooffice1.webp",
    longitude: 127.0613891555385,
    latitude: 37.6555561555385,
  },
];

//Component CancelPopup
function CancelPopup({ onConfirm, onCancel, msg }) {
  return (
    <div className="popup-overlay" onClick={onCancel}>
      <div className="popup" onClick={(e) => e.stopPropagation()}>
        <div className="popup-header">
          <h3>예약 취소</h3>
          <button className="popup-close" onClick={onCancel}>
            <IoCloseCircle />
          </button>
        </div>
        <div className="popup-content">
          <div className="popup-form">
            <p>{msg}</p>
            <div className="popup-buttons verification">
              <button className="yes" onClick={() => onConfirm("yes")}>
                예
              </button>
              <button className="no" onClick={() => onCancel("no")}>
                아니오
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

//Component EditPopup
function EditPopup({ reservation, onClose, onSave }) {
  const [startDate, setStartDate] = useState(new Date(reservation.startDate));
  const [endDate, setEndDate] = useState(new Date(reservation.endDate));
  const [attendance, setAttendance] = useState(reservation.attendance || 1);

  const handleSave = () => {
    onSave({
      ...reservation,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      attendance,
    });
  };
  //function getDiffDays
  const getDiffDays = (start, end) => {
    const diffTime = Math.max(end - start, 0);
    return Math.max(Math.ceil(diffTime / (1000 * 60 * 60 * 24)), 1);
  };
  // Function formateDate
  const formatDate = (date) => {
    if (!date) return "";
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  };

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup" onClick={(e) => e.stopPropagation()}>
        <div className="popup-header  calendar-popup">
          <h2>{`${getDiffDays(startDate, endDate || startDate)}일`}</h2>
          <button className="popup-close" onClick={onClose}>
            <IoCloseCircle />
          </button>
          <div className="show-date-value">
            <div className="wrap-right">
              <span>시작일</span>
              <div>{formatDate(startDate)}</div>
            </div>
            <div className="wrap-left">
              <span>종료일</span>
              <div>{formatDate(endDate || startDate)}</div>
            </div>
          </div>
        </div>
        <div className="calendar-container">
          <div>
            <Calendar
              settingStartDate={setStartDate}
              settingEndDate={setEndDate}
              startDate={startDate}
              endDate={endDate}
            />
          </div>
        </div>
        <div className="attendance-container">
          <label htmlFor="attendance">인원:</label>
          <input
            type="number"
            id="attendance"
            placeholder="인원을 입력하세요"
            value={attendance}
            onChange={(e) => setAttendance(parseInt(e.target.value))}
            min="1"
          />
        </div>
        <div className="popup-buttons">
          <button onClick={onClose}>취소</button>
          <button onClick={handleSave}>저장</button>
        </div>
      </div>
    </div>
  );
}

//Component Phone input Popup
function PhonePopup({ initialValue, onSave, onClose }) {
  const [phone, setPhone] = useState(initialValue);
  const [error, setError] = useState("");

  const validatePhone = (value) => {
    const phonePattern = /^01[016789]\d{7,8}$/;
    return phonePattern.test(value.replace(/-/g, ""));
  };

  const formatPhone = (value) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length <= 3) {
      return cleaned;
    } else if (cleaned.length <= 7) {
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
    } else {
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(
        7,
        11
      )}`;
    }
  };

  const handleChange = (e) => {
    const formattedPhone = formatPhone(e.target.value);
    setPhone(formattedPhone);
    setError(
      validatePhone(formattedPhone) ? "" : "올바른 전화번호 형식이 아닙니다."
    );
  };

  const handleSave = () => {
    if (validatePhone(phone)) {
      onSave("phone", phone.replace(/-/g, ""));
      onClose();
    } else {
      setError("올바른 전화번호 형식이 아닙니다.");
    }
  };

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup" onClick={(e) => e.stopPropagation()}>
        <div className="popup-header">
          <h3>전화번호 수정</h3>
          <button className="popup-close" onClick={onClose}>
            <IoCloseCircle />
          </button>
        </div>
        <div className="popup-content">
          <div className="popup-form">
            <input
              type="tel"
              value={phone}
              onChange={handleChange}
              placeholder="010-1234-5678"
            />
            {error && <p className="error">{error}</p>}
            <div className="popup-buttons">
              <button onClick={onClose}>취소</button>
              <button onClick={handleSave}>저장</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

//Component Email input Popup
function EmailPopup({ initialValue, onSave, onClose }) {
  const [email, setEmail] = useState(initialValue);
  const [error, setError] = useState("");
  //function validate email
  const validateEmail = (value) => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(value);
  };
  //function handle email save
  const handleSave = () => {
    if (validateEmail(email)) {
      onSave("email", email);
      onClose();
    } else {
      setError("올바른 이메일 주소를 입력해주세요.");
    }
  };
  //render email popup
  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup" onClick={(e) => e.stopPropagation()}>
        <div className="popup-header">
          <h3>이메일 수정</h3>
          <button className="popup-close" onClick={onClose}>
            <IoCloseCircle />
          </button>
        </div>
        <div className="popup-content">
          <div className="popup-form">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {error && <p className="error">{error}</p>}
            <div className="popup-buttons">
              <button onClick={onClose}>취소</button>
              <button onClick={handleSave}>저장</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

//Component POPUP name input
function NamePopup({ initialValue, onSave, onClose }) {
  const [name, setName] = useState(initialValue);
  const [error, setError] = useState("");

  const validateName = (value) => {
    const namePattern = /^[가-힣]{2,12}$/;
    return namePattern.test(value);
  };

  const handleSave = () => {
    if (validateName(name)) {
      onSave("name", name);
      onClose();
    } else {
      setError("2자 이상 12자 이하의 한글만 가능합니다.");
    }
  };

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup" onClick={(e) => e.stopPropagation()}>
        <div className="popup-header">
          <h3>이름 수정</h3>
          <button className="popup-close" onClick={onClose}>
            <IoCloseCircle />
          </button>
        </div>
        <div className="popup-content">
          <div className="popup-form">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {error && <p className="error">{error}</p>}
            <div className="popup-buttons">
              <button onClick={onClose}>취소</button>
              <button onClick={handleSave}>저장</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

//component POPUP birthday input
function BirthPopup({ initialValue, onSave, onClose }) {
  const [birth, setBirth] = useState(initialValue);
  const [error, setError] = useState("");

  const validateBirth = (value) => {
    const birthPattern = /^\d{4}-\d{2}-\d{2}$/;
    return birthPattern.test(value);
  };

  const handleSave = () => {
    if (validateBirth(birth)) {
      onSave("birth", birth);
      onClose();
    } else {
      setError("올바른 생년월일 형식(YYYY-MM-DD)으로 입력해주세요.");
    }
  };

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup" onClick={(e) => e.stopPropagation()}>
        <div className="popup-header">
          <h3>생년월일 수정</h3>
          <button className="popup-close" onClick={onClose}>
            <IoCloseCircle />
          </button>
        </div>
        <div className="popup-content">
          <div className="popup-form">
            <input
              type="text"
              value={birth}
              onChange={(e) => setBirth(e.target.value)}
            />
            {error && <p className="error">{error}</p>}
            <div className="popup-buttons">
              <button onClick={onClose}>취소</button>
              <button onClick={handleSave}>저장</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

//component New Review Popup
function NewReviewPopup({ newInitialValue, onClose }) {
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);
  const [error, setError] = useState("");

  const handleSave = () => {
    if (review.trim() !== "") {
      onClose();
    } else {
      setError("리뷰를 입력해주세요.");
    }
  };

  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup" onClick={(e) => e.stopPropagation()}>
        <div className="popup-header">
          <h3>{`${newInitialValue.title} 새 리뷰 작성`}</h3>
          <button className="popup-close" onClick={onClose}>
            <IoCloseCircle />
          </button>
        </div>
        <div className="popup-content">
          <div className="popup-form">
            <div className="rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar
                  key={star}
                  className={star <= rating ? "star active" : "star"}
                  onClick={() => handleRatingChange(star)}
                />
              ))}
            </div>
            <textarea
              placeholder="내용"
              value={review}
              onChange={(e) => setReview(e.target.value)}
              rows={5}
            />
            {error && <p className="error">{error}</p>}
            <div className="popup-buttons">
              <button onClick={onClose}>취소</button>
              <button onClick={handleSave}>저장</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

//component Edit Review Popup
function EditReviewPopup({ initialValue, onClose }) {
  const [review, setReview] = useState(initialValue.content);
  const [rating, setRating] = useState(initialValue.rating);
  const [error, setError] = useState("");

  const handleSave = () => {
    if (review.trim() !== "") {
      onClose();
    } else {
      setError("리뷰를 입력해주세요.");
    }
  };

  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup" onClick={(e) => e.stopPropagation()}>
        <div className="popup-header">
          <h3>{`${initialValue.title} 리뷰 수정`}</h3>
          <button className="popup-close" onClick={onClose}>
            <IoCloseCircle />
          </button>
        </div>
        <div className="popup-content">
          <div className="popup-form">
            <div className="rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar
                  key={star}
                  className={star <= rating ? "star active" : "star"}
                  onClick={() => handleRatingChange(star)}
                />
              ))}
            </div>
            <textarea
              placeholder={initialValue.content}
              value={review}
              onChange={(e) => setReview(e.target.value)}
              rows={5}
            />
            {error && <p className="error">{error}</p>}
            <div className="popup-buttons">
              <button onClick={onClose}>취소</button>
              <button onClick={handleSave}>저장</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

//component reviewItem
function ReviewItem({ customTitle, ...review }) {
  const [isReviewPopupOpen, setIsReviewPopupOpen] = useState(false);

  const handleEdit = (review) => {
    setIsReviewPopupOpen(true);
  };

  const renderStars = (rating) => {
    const filledStars = "★".repeat(rating);
    const emptyStars = "☆".repeat(5 - rating);
    return filledStars + emptyStars;
  };
  //render reviewItem
  return (
    <div className="review-item">
      <div className="review-header">
        <div className="text-container">
          <h4>{customTitle ? customTitle : review.title}</h4>

          <h4>{renderStars(review.rating)}</h4>
          <p>{review.content}</p>
        </div>
        <div className="edit-button" onClick={handleEdit}>
          <p>수정</p>
        </div>
      </div>
      {isReviewPopupOpen && (
        <EditReviewPopup
          initialValue={review}
          onClose={() => setIsReviewPopupOpen(false)}
        />
      )}
    </div>
  );
}

//component viewInfor
function ViewInfo({ mockMemberData, updateMemberData }) {
  //view info states
  const [activePopup, setActivePopup] = useState(null);

  //function edit handler
  const handleEdit = (field) => {
    setActivePopup(field);
  };

  //function save handler
  const handleSave = (field, value) => {
    updateMemberData(field, value);
    setActivePopup(null);
  };

  //function close handler
  const handleClose = () => {
    setActivePopup(null);
  };

  //render ViewInfo
  return (
    <div className="info-container">
      <h2>내 정보</h2>
      <div className="info-row">
        <label>아이디:</label>
        <span>{mockMemberData.id}</span>
      </div>
      <div className="info-row bt">
        <label>비밀번호 변경</label>
      </div>
      <div className="info-row" onClick={() => handleEdit("name")}>
        <label>이름:</label>
        <span>{mockMemberData.name}</span>
        <u>수정</u>
      </div>
      <div className="info-row" onClick={() => handleEdit("phone")}>
        <label>전화번호:</label>
        <span>{mockMemberData.phone}</span>
        <u>수정</u>
      </div>
      <div className="info-row" onClick={() => handleEdit("email")}>
        <label>이메일:</label>
        <span>{mockMemberData.email}</span>
        <u>수정</u>
      </div>
      <div className="info-row" onClick={() => handleEdit("birth")}>
        <label>생년월일:</label>
        <span>{mockMemberData.birth}</span>
        <u>수정</u>
      </div>

      <div className="info-row bt">
        <label>변경사항 적용</label>
      </div>

      <div className="info-row">
        <label>성별:</label>
        <span>{mockMemberData.gender === "M" ? "남성" : "여성"}</span>
      </div>
      <div className="info-row">
        <label>가입일:</label>
        <span>{mockMemberData.reg_date}</span>
      </div>
      <div className="info-row bt">
        <label>변경사항 적용</label>
      </div>
      {activePopup === "phone" && (
        <PhonePopup
          initialValue={mockMemberData.phone}
          onSave={handleSave}
          onClose={handleClose}
        />
      )}
      {activePopup === "email" && (
        <EmailPopup
          initialValue={mockMemberData.email}
          onSave={handleSave}
          onClose={handleClose}
        />
      )}
      {activePopup === "name" && (
        <NamePopup
          initialValue={mockMemberData.name}
          onSave={handleSave}
          onClose={handleClose}
        />
      )}
      {activePopup === "birth" && (
        <BirthPopup
          initialValue={mockMemberData.birth}
          onSave={handleSave}
          onClose={handleClose}
        />
      )}
    </div>
  );
}

//component favorites tab
function Favorites() {
  return (
    <div className="favorites-tab">
      <h2>찜 목록</h2>
      <div className="office-item-list-sub">
        {OfficeMockData.map((item) => (
          <OfficeItem key={item.id} {...item} />
        ))}
      </div>
    </div>
  );
}

//component Reservations tab
function Reservations() {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [isReviewPopupOpen, setIsReviewPopupOpen] = useState(false);

  const [selectedReservation, setSelectedReservation] = useState(null);
  const [isCancelPopupOpen, setIsCancelPopupOpen] = useState(false);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);

  const mockReservations = [
    {
      no: 1,
      title: "강남역 사무실",
      rating: "4.5",
      noOfRating: "40",
      description: "강남역 사무실",
      location: "강남역",
      pricePerDay: "10000",
      officeImgURL: "/demooffice1.webp",
      longitude: 127.058392,
      latitude: 37.500454,
      regdate: "2024-05-15T10:05:00",
      startDate: "2024-07-15T10:05:00",
      endDate: "2024-10-18T10:05:00",
      attendance: 1,
    },
    {
      no: 2,
      title: "홍대입구 코워킹스페이스",
      rating: "4.8",
      noOfRating: "55",
      description: "홍대입구 코워킹스페이스",
      location: "홍대입구",
      pricePerDay: "12000",
      officeImgURL: "/demooffice2.webp",
      longitude: 126.9237741555385,
      latitude: 37.5575341555385,
      regdate: "2024-05-16T10:05:00",
      startDate: "2024-05-16T10:00:00",
      endDate: "2024-12-19T10:00:00",
      attendance: 1,
    },
    {
      no: 3,
      title: "역삼동 비즈니스 센터",
      rating: "4.6",
      noOfRating: "32",
      description: "역삼동 비즈니스 센터",
      location: "역삼동",
      pricePerDay: "15000",
      officeImgURL: "/demooffice3.webp",
      longitude: 127.036346,
      latitude: 37.501362,
      regdate: "2024-05-15T09:30:00",
      startDate: "2024-01-15T09:00:00",
      endDate: "2024-12-18T09:00:00",
      attendance: 2,
    },
    {
      no: 4,
      title: "신촌 스타트업 허브",
      rating: "4.3",
      noOfRating: "28",
      description: "신촌 스타트업 허브",
      location: "신촌",
      pricePerDay: "11000",
      officeImgURL: "/demooffice1.webp",
      longitude: 126.936893,
      latitude: 37.555348,
      regdate: "2024-05-17T11:15:00",
      startDate: "2024-05-17T11:00:00",
      endDate: "2024-05-20T11:00:00",

      attendance: 4,
    },
    {
      no: 5,
      title: "판교 테크노밸리 오피스",
      rating: "4.7",
      noOfRating: "45",
      description: "판교 테크노밸리 오피스",
      location: "판교",
      pricePerDay: "13000",
      officeImgURL: "/demooffice2.webp",
      longitude: 127.108705,
      latitude: 37.402111,
      regdate: "2024-06-01T09:00:00",
      startDate: "2024-03-01T09:00:00",
      endDate: "2024-08-31T18:00:00",
      attendance: 3,
    },
    {
      no: 6,
      title: "여의도 금융 센터",
      rating: "4.9",
      noOfRating: "60",
      description: "여의도 금융 센터",
      location: "여의도",
      pricePerDay: "18000",
      officeImgURL: "/demooffice3.webp",
      longitude: 126.925381,
      latitude: 37.525732,
      regdate: "2023-06-15T10:30:00",
      startDate: "2023-09-01T09:00:00",
      endDate: "2023-09-30T18:00:00",
      attendance: 1,
    },
    {
      no: 7,
      title: "성수동 창업 공간",
      rating: "4.4",
      noOfRating: "35",
      description: "성수동 창업 공간",
      location: "성수동",
      pricePerDay: "9000",
      officeImgURL: "/demooffice1.webp",
      longitude: 127.055723,
      latitude: 37.544323,
      regdate: "2022-07-01T11:00:00",
      startDate: "2022-10-01T09:00:00",
      endDate: "2022-10-07T18:00:00",
      attendance: 2,
    },
    {
      no: 8,
      title: "광화문 비즈니스 라운지",
      rating: "4.8",
      noOfRating: "50",
      description: "광화문 비즈니스 라운지",
      location: "광화문",
      pricePerDay: "16000",
      officeImgURL: "/demooffice2.webp",
      longitude: 126.976882,
      latitude: 37.572736,
      regdate: "2021-07-15T14:00:00",
      startDate: "2021-11-01T09:00:00",
      endDate: "2021-11-30T18:00:00",
      attendance: 1,
    },
    {
      no: 9,
      title: "송파 공유 오피스",
      rating: "4.5",
      noOfRating: "38",
      description: "송파 공유 오피스",
      location: "송파",
      pricePerDay: "11000",
      officeImgURL: "/demooffice3.webp",
      longitude: 127.112585,
      latitude: 37.514322,
      regdate: "2024-08-01T09:30:00",
      startDate: "2025-01-02T09:00:00",
      endDate: "2025-01-31T18:00:00",
      attendance: 2,
    },
  ];

  const reviews = [
    {
      no: 4,
      title: "신촌 스타트업 허브",
      content:
        "Solid performance and reasonable price. Satisfied with my purchase.",
      rating: 4,
      date: "2023-05-18",
    },
    {
      no: 5,
      title: "판교 테크노밸리 오피스",
      content:
        "Decent product overall, but there are a few minor issues that could be addressed.",
      rating: 3,
      date: "2023-05-20",
    },
  ];

  //render tabs
  const TabNavigation = () => (
    <div className="tab-navigation">
      {activeTab === "upcoming" && (
        <button className="active" onClick={() => setActiveTab("upcoming")}>
          예약 목록
        </button>
      )}
      {activeTab === "inUse" && (
        <button className="active" onClick={() => setActiveTab("inUse")}>
          사용 중
        </button>
      )}
      {activeTab === "past" && (
        <button className="active" onClick={() => setActiveTab("past")}>
          기간 만료
        </button>
      )}
      {activeTab !== "upcoming" && (
        <button onClick={() => setActiveTab("upcoming")}>예약 목록</button>
      )}
      {activeTab !== "inUse" && (
        <button onClick={() => setActiveTab("inUse")}>사용 중</button>
      )}
      {activeTab !== "past" && (
        <button onClick={() => setActiveTab("past")}>기간 만료</button>
      )}
    </div>
  );

  const currentDateTime = new Date();

  const upcomingReservations = mockReservations.filter((reservation) => {
    const startDate = new Date(reservation.startDate);
    return startDate > currentDateTime;
  });

  const inUseReservations = mockReservations.filter((reservation) => {
    const startDate = new Date(reservation.startDate);
    const endDate = new Date(reservation.endDate);
    return currentDateTime >= startDate && currentDateTime <= endDate;
  });

  const pastReservations = mockReservations.filter((reservation) => {
    const endDate = new Date(reservation.endDate);
    return endDate < currentDateTime;
  });

  const handleEditPopup = (item) => {
    setSelectedReservation(item);
    setIsEditPopupOpen(true);
  };

  const handleCancelPopup = (item) => {
    setSelectedReservation(item);
    setIsCancelPopupOpen(true);
  };

  return (
    <>
      <TabNavigation />
      {activeTab === "upcoming" && (
        <>
          {upcomingReservations.map((item) => (
            <div className="office-item-option-wrap " key={item.no}>
              <OfficeItem {...item} />
              <div className="office-item-reservation-info">
                <p>시작일: {new Date(item.startDate).toLocaleDateString()}</p>
                <p>~</p>
                <p>종료일: {new Date(item.endDate).toLocaleDateString()}</p>
                <p>사용 인원: {item.attendance}명 </p>
              </div>
              <div className="extra-info">
                <div className="btns-wrap">
                  <div
                    className="btn-edit"
                    onClick={() => handleEditPopup(item)}
                  >
                    수정
                  </div>
                  <div
                    className="btn-cancel"
                    onClick={() => handleCancelPopup(item)}
                  >
                    취소
                  </div>
                </div>
              </div>
            </div>
          ))}
          {isEditPopupOpen && (
            <EditPopup
              reservation={selectedReservation}
              onClose={() => setIsEditPopupOpen(false)}
              onSave={(updatedReservation) => {
                setIsEditPopupOpen(false);
                // Handle the updated reservation
              }}
            />
          )}

          {isCancelPopupOpen && (
            <CancelPopup
              onConfirm={(result) => {
                setIsCancelPopupOpen(false);
                // Handle
                if (result === "yes") {
                  // cancellation
                }
              }}
              onCancel={(result) => {
                setIsCancelPopupOpen(false);
                // Handle 'no'
              }}
              msg="예약을 취소하시겠습니까?"
            />
          )}
        </>
      )}

      {activeTab === "inUse" && (
        <>
          {inUseReservations.map((item) => (
            <div className="office-item-option-wrap " key={item.no}>
              <OfficeItem {...item} />
              <div className="office-item-reservation-info">
                <p>시작일: {new Date(item.startDate).toLocaleDateString()}</p>
                <p>~</p>
                <p>종료일: {new Date(item.endDate).toLocaleDateString()}</p>
                <p>사용 인원: {item.attendance}명 </p>
              </div>
              <div className="extra-info">
                <div className="btn-review">
                  {reviews.find((review) => review.no === item.no) ? (
                    <ReviewItem
                      customTitle="리뷰"
                      {...reviews.find((review) => review.no === item.no)}
                    />
                  ) : (
                    <div className="no-review review-item">
                      <div className="review-header">
                        <div className="title-container">
                          <h4>작성한 리뷰가 없습니다</h4>
                        </div>
                        <div
                          className="edit-button"
                          onClick={() => setIsReviewPopupOpen(true)}
                        >
                          <p>작성</p>
                        </div>
                      </div>
                      {isReviewPopupOpen && (
                        <NewReviewPopup
                          newInitialValue={item}
                          onClose={() => setIsReviewPopupOpen(false)}
                        />
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </>
      )}

      {activeTab === "past" && (
        <>
          {pastReservations.map((item) => (
            <div className="office-item-option-wrap " key={item.no}>
              <OfficeItem {...item} />
              <div className="office-item-reservation-info">
                <p>시작일: {new Date(item.startDate).toLocaleDateString()}</p>
                <p>~</p>
                <p>종료일: {new Date(item.endDate).toLocaleDateString()}</p>
                <p>사용 인원: {item.attendance}명 </p>
              </div>
              <div className="extra-info">
                <div className="btn-review">
                  {reviews.find((review) => review.no === item.no) ? (
                    <ReviewItem
                      customTitle="리뷰"
                      {...reviews.find((review) => review.no === item.no)}
                    />
                  ) : (
                    <div className="no-review review-item">
                      <div className="review-header">
                        <div className="title-container">
                          <h4>작성한 리뷰가 없습니다</h4>
                        </div>
                        <div
                          className="edit-button"
                          onClick={() => setIsReviewPopupOpen(true)}
                        >
                          <p>작성</p>
                        </div>
                      </div>

                      {isReviewPopupOpen && (
                        <NewReviewPopup
                          newInitialValue={item}
                          onClose={() => setIsReviewPopupOpen(false)}
                          type="new"
                        />
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </>
      )}
    </>
  );
}

//component reviews tab
function Reviews() {
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

//component member mypage
function MemberMyPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("viewInfo");
  const [mockMemberData, setMockMemberData] = useState({
    no: 1,
    id: "user123",
    name: "홍길동",
    phone: "010-1234-5678",
    email: "user123@example.com",
    birth: "1990-01-01",
    gender: "M",
    reg_date: "2023-05-01",
  });

  //function updateMemberData(field, value) {
  const updateMemberData = (field, value) => {
    setMockMemberData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  // interface tabs
  const tabs = [
    { id: "viewInfo", label: "내 정보" },
    { id: "favorites", label: "찜 목록" },
    { id: "reservations", label: "결제 내역" },
    { id: "reviews", label: "내가 쓴 리뷰" },
  ];

  // render tabcontent
  const renderTabContent = () => {
    switch (activeTab) {
      case "viewInfo":
        return (
          <ViewInfo
            mockMemberData={mockMemberData}
            updateMemberData={updateMemberData}
          />
        );
      case "reservations":
        return <Reservations />;
      case "reviews":
        return <Reviews />;
      case "favorites":
        return <Favorites />;
      default:
        return null;
    }
  };
  //render my page
  return (
    <div className="member-my-page">
      <MemberHeader />
      <main className="member-content-wrapper">
        <section className="tab-container">
          <div className="tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`tab ${activeTab === tab.id ? "active" : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </section>
        <section className="tab-content">{renderTabContent()}</section>
      </main>
      <MemberFooter />
    </div>
  );
}

export default MemberMyPage;
