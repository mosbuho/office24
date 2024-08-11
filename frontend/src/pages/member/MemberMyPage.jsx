import { default as React, useEffect, useState } from "react";
import { FaStar } from "react-icons/fa6";
import { IoCloseCircle } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import Calendar from "../../components/member/Calendar";
import MemberFooter from "../../components/member/MemberFooter";
import MemberHeader from "../../components/member/MemberHeader";
import OfficeItem from "../../components/member/OfficeItem";
import "../../styles/pages/member/MemberMyPage.css";
import { getNo, removeTokens } from "../../utils/auth";
import axios from "../../utils/axiosConfig";

// Function formateDate
const formatDate = (date) => {
  if (!date) return "";
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
};
const preprocessDate = (dateString) => {
  if (!dateString) return "";
  return dateString.split("T")[0]; // This will extract the date part: YYYY-MM-DD
};

//Component VerifyPopup
function VerifyPopup({ onConfirm, onCancel, msg }) {
  return (
    <div className="popup-overlay" onClick={onCancel}>
      <div className="popup" onClick={(e) => e.stopPropagation()}>
        <div className="popup-header">
          <h3>{msg}</h3>
          <button className="popup-close" onClick={onCancel}>
            <IoCloseCircle />
          </button>
        </div>
        <div className="popup-content">
          <div className="popup-form">
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

//Component PasswordConfirmPopupForDeleteUser
function PasswordDeletePopup({ onClose }) {
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const no = getNo();
      const response = await axios.delete("/member/delete", {
        data: { no, password },
      });
      if (response.status === 200) {
        removeTokens();
        alert("회원 탈퇴 되었습니다.");
        navigate("/login");
      }
    } catch (error) {
      alert("탈퇴 실패");
    } finally {
      onClose();
    }
  };

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup" onClick={(e) => e.stopPropagation()}>
        <div className="popup-header">
          <h3>계정 삭제 확인</h3>
          <button className="popup-close" onClick={onClose}>
            <IoCloseCircle />
          </button>
        </div>
        <div className="popup-content">
          <p>계정을 삭제하려면 비밀번호를 입력하세요.</p>
          <form className="popup-form" onSubmit={handleSubmit}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호"
              required
            />
            <div className="popup-buttons">
              <button type="button" onClick={onClose}>
                취소
              </button>
              <button type="submit">삭제</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

//Component Update Password
function UpdatePassword({ onClose }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }
    try {
      const response = await axios.put(`/member/password/${getNo()}`, {
        currentPassword,
        newPassword,
      });
      if (response.status === 200) {
        alert("비밀번호 변경");
        onClose();
      }
    } catch (error) {
      console.error("Password update error:", error.response?.data);
      setError(error.response?.data || "비밀번호 변경 실패");
    }
  };
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="popup-overlay update-password" onClick={onClose}>
      <div className="popup" onClick={(e) => e.stopPropagation()}>
        <div className="popup-header">
          <h3>비밀번호 변경</h3>
          <button className="popup-close" onClick={onClose}>
            <IoCloseCircle />
          </button>
        </div>
        <div className="popup-content">
          <div className="popup-form">
            <form onSubmit={handleSubmit}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="현재 비밀번호"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="새 비밀번호"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="새 비밀번호 확인"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              {error && <p className="error">{error}</p>}

              <div className="popup-buttons">
                <button type="button" onClick={toggleShowPassword}>
                  {showPassword ? "비밀번호 숨김" : "비밀번호 확인"}
                </button>
                <button type="submit">저장</button>
              </div>
            </form>
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
      onSave("email", email || null);
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
    const namePattern = /^[가-힣]{2,6}$/;
    return namePattern.test(value);
  };

  const handleSave = () => {
    if (validateName(name)) {
      onSave("name", name);
      onClose();
    } else {
      setError("2자 이상 6자 이하의 한글만 가능합니다.");
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

//component viewInfo
function ViewInfo() {
  //view info states

  const navigate = useNavigate();
  const [activePopup, setActivePopup] = useState(null);
  const [modifiedFields, setModifiedFields] = useState({});

  const [memberData, setMemberData] = useState({
    no: "",
    id: "",
    name: "",
    phone: "",
    email: "",
    birth: "",
    gender: "",
    reg_date: "",
  });

  useEffect(() => {
    const fetchMemberData = async () => {
      try {
        const no = getNo();
        const response = await axios.get(`/member/${no}`);
        const formattedData = {
          ...response.data,
          birth: response.data.birth ? response.data.birth.split("T")[0] : "",
          reg_date: response.data.reg_date
            ? response.data.reg_date.split("T")[0]
            : "",
        };
        setMemberData(formattedData);
      } catch (error) {
        console.error("Error fetching member data:", error);
      }
    };

    fetchMemberData();
  }, []);

  //function updateLocalMemberData(field, value) {
  const updateLocalMemberData = (field, value) => {
    setMemberData((prevData) => ({
      ...prevData,
      [field]: value === "" ? null : value,
    }));
    setModifiedFields((prevFields) => ({
      ...prevFields,
      [field]: true,
    }));
  };
  //function edit handler
  const handleEdit = (field) => {
    setActivePopup(field);
  };

  //function save handler
  const handleSave = (field, value) => {
    updateLocalMemberData(field, value);
    setActivePopup(null);
  };

  //function close handler
  const handleClose = () => {
    setActivePopup(null);
  };

  //function put updatemember
  const submitMemberDataToServer = async () => {
    const no = getNo();
    console.log("Data being sent to server:", memberData);
    try {
      const response = await axios.put(`/member/${no}`, memberData);
      console.log("Server response:", response.data);
      alert("회원 정보가 성공적으로 업데이트되었습니다.");
    } catch (error) {
      console.error("Error updating member data:", error);
      console.log("Error response from server:", error.response?.data);
      alert("회원 정보 업데이트에 실패했습니다.");
    }
  };

  //render ViewInfo
  return (
    <div className="info-container">
      <h2>내 정보</h2>
      <div className="info-row">
        <label>아이디:</label>
        <span>{memberData.id}</span>
      </div>
      <div className="info-row bt" onClick={() => handleEdit("updatePassword")}>
        <label>비밀번호 변경</label>
      </div>
      <div
        className={`info-row ${modifiedFields.name ? "modified" : ""}`}
        onClick={() => handleEdit("name")}
      >
        <label>이름:</label>
        <span>{memberData.name}</span>
        <u>수정</u>
      </div>
      <div
        className={`info-row ${modifiedFields.phone ? "modified" : ""}`}
        onClick={() => handleEdit("phone")}
      >
        <label>전화번호:</label>
        <span>{memberData.phone}</span>
        <u>수정</u>
      </div>
      <div
        className={`info-row ${modifiedFields.email ? "modified" : ""}`}
        onClick={() => handleEdit("email")}
      >
        <label>이메일:</label>
        <span>{memberData.email}</span>
        <u>수정</u>
      </div>
      <div
        className={`info-row ${modifiedFields.birth ? "modified" : ""}`}
        onClick={() => handleEdit("birth")}
      >
        <label>생년월일:</label>
        <span>{memberData.birth}</span>
        <u>수정</u>
      </div>
      {Object.keys(modifiedFields).length > 0 && (
        <div className="info-row bt">
          <label onClick={submitMemberDataToServer}>변경사항 적용</label>
        </div>
      )}
      <div className="info-row">
        <label>성별:</label>
        <span>{memberData.gender === "M" ? "남성" : "여성"}</span>
      </div>
      <div className="info-row">
        <label>가입일:</label>
        <span>{memberData.reg_date}</span>
      </div>
      <div className="info-row bt" onClick={() => handleEdit("deleteUser")}>
        <label>회원 탈퇴</label>
      </div>
      {activePopup === "phone" && (
        <PhonePopup
          initialValue={memberData.phone}
          onSave={handleSave}
          onClose={handleClose}
        />
      )}
      {activePopup === "email" && (
        <EmailPopup
          initialValue={memberData.email}
          onSave={handleSave}
          onClose={handleClose}
        />
      )}
      {activePopup === "name" && (
        <NamePopup
          initialValue={memberData.name}
          onSave={handleSave}
          onClose={handleClose}
        />
      )}
      {activePopup === "birth" && (
        <BirthPopup
          initialValue={memberData.birth}
          onSave={handleSave}
          onClose={handleClose}
        />
      )}
      {activePopup === "updatePassword" && (
        <UpdatePassword onClose={handleClose} />
      )}
      {activePopup === "deleteUser" && (
        <PasswordDeletePopup onClose={handleClose} />
      )}
    </div>
  );
}

//component favorites tab

function Favorites() {
  const [favoriteOffices, setFavoriteOffices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const userNo = getNo();

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`member/${userNo}/favorites`);
      setFavoriteOffices(
        response.data.map((office) => ({ ...office, isLiked: true }))
      );
    } catch (error) {
      console.error(error);
      setError("에러 발생.... 문의 주세요....");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLikeChange = (officeNo, newLikeStatus) => {
    if (!newLikeStatus) {
      setFavoriteOffices((prevFavorites) =>
        prevFavorites.filter((office) => office.NO !== officeNo)
      );
    }
  };

  if (isLoading) {
    return <div>로딩중......</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="favorites-tab">
      <h2>찜 목록</h2>
      {favoriteOffices.length === 0 ? (
        <p>목록이 비어있습니다.</p>
      ) : (
        <TransitionGroup className="office-item-list-sub">
          {favoriteOffices.map((item) => (
            <CSSTransition key={item.NO} timeout={300} classNames="fade">
              <OfficeItem
                {...item}
                initialLikeStatus={true}
                onLikeChange={handleLikeChange}
              />
            </CSSTransition>
          ))}
        </TransitionGroup>
      )}
    </div>
  );
}

//component Reservations tab
function Reservations() {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [isReviewPopupOpen, setIsReviewPopupOpen] = useState(false);

  const [selectedReservation, setSelectedReservation] = useState(null);
  const [isVerifyPopupOpen, setIsVerifyPopupOpen] = useState(false);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [memberData, setMemberData] = useState(null);

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
      no: 1,
      title: "신촌 스타트업 허브",
      content:
        "Solid performance and reasonable price. Satisfied with my purchase.",
      rating: 4,
      date: "2023-05-18",
    },
    {
      no: 1,
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

  const handleVerifyPopup = (item) => {
    setSelectedReservation(item);
    setIsVerifyPopupOpen(true);
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
                    onClick={() => handleVerifyPopup(item)}
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

          {isVerifyPopupOpen && (
            <VerifyPopup
              onConfirm={(result) => {
                setIsVerifyPopupOpen(false);
                // Handle
                if (result === "yes") {
                  // cancellation
                }
              }}
              onCancel={(result) => {
                setIsVerifyPopupOpen(false);
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
        return <ViewInfo />;
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
        <>
          <section className="tab-container">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`tab ${activeTab === tab.id ? "active" : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </section>
          <section className="tab-content">{renderTabContent()}</section>
        </>
      </main>
      <MemberFooter />
    </div>
  );
}

export default MemberMyPage;
