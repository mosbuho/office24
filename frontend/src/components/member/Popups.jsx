import React, { useState } from "react";
import { FaStar } from "react-icons/fa6";
import { IoCloseCircle } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import Calendar from "../../components/member/Calendar";
import "../../styles/components/member/Popup.css";
import { getNo, removeTokens } from "../../utils/auth";
import axios from "../../utils/axiosConfig";

import {
  validateBirth,
  validateEmail,
  validateName,
  validatePassword,
  validatePhone,
} from "../../utils/MemberValidation";

const PopupOverlay = ({ children, onClose }) => (
  <div className="popup-overlay" onClick={onClose}>
    <div className="popup popup-form" onClick={(e) => e.stopPropagation()}>
      {children}
    </div>
  </div>
);

const PopupHeader = ({ title, onClose }) => (
  <div className="popup-header">
    <h3>{title}</h3>
    <button className="popup-close" onClick={onClose}>
      <IoCloseCircle />
    </button>
  </div>
);

const PopupButtons = ({ onCancel, onSave }) => (
  <div className="popup-buttons">
    <button onClick={onCancel}>취소</button>
    <button onClick={onSave}>저장</button>
  </div>
);

export const VerifyPopup = ({ onConfirm, onCancel, msg }) => (
  <PopupOverlay onClose={onCancel}>
    <PopupHeader title={msg} onClose={onCancel} />
    <div className="popup-content">
      <div className="popup-buttons verification">
        <button className="yes" onClick={() => onConfirm("yes")}>
          예
        </button>
        <button className="no" onClick={() => onCancel("no")}>
          아니오
        </button>
      </div>
    </div>
  </PopupOverlay>
);

export const PasswordDeletePopup = ({ onClose }) => {
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const no = getNo();
      const response = await axios.post(`/member/${no}/delete`, {
        data: { password },
      });
      if (response.status === 200) {
        removeTokens();
        alert("회원 탈퇴 되었습니다.");
        navigate("/login");
      }
    } catch (error) {
      alert("회원 탈퇴 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      onClose();
    }
  };

  return (
    <PopupOverlay onClose={onClose}>
      <PopupHeader title="계정 삭제 확인" onClose={onClose} />
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
          <PopupButtons onCancel={onClose} onSave={handleSubmit} />
        </form>
      </div>
    </PopupOverlay>
  );
};

export const UpdatePassword = ({ onClose }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("새로운 비밀번호가 일치하지 않습니다.");
      return;
    }

    const { isValid, message } = validatePassword(newPassword);
    if (!isValid) {
      setError(message);
      return;
    }

    try {
      const response = await axios.put(`/member/${getNo()}/change-pw`, {
        currentPassword,
        newPassword,
      });
      if (response.status === 200) {
        alert("비밀번호가 변경되었습니다.");
        onClose();
      }
    } catch (error) {
      setError("기존 비밀번호가 일치하지 않습니다.");
    }
  };

  const [showPassword, setShowPassword] = useState(false);

  return (
    <PopupOverlay onClose={onClose}>
      <PopupHeader title="비밀번호 변경" onClose={onClose} />
      <div className="popup-content update-password ">
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
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "비밀번호 숨김" : "비밀번호 확인"}
            </button>
            <button type="submit">저장</button>
          </div>
        </form>
      </div>
    </PopupOverlay>
  );
};

export const EditPopup = ({ reservation, onClose, onSave }) => {
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
    <PopupOverlay onClose={onClose}>
      <PopupHeader
        title={`${getDiffDays(startDate, endDate || startDate)}일`}
        onClose={onClose}
      />
      <div className="popup-content">
        <Calendar
          settingStartDate={setStartDate}
          settingEndDate={setEndDate}
          startDate={startDate}
          endDate={endDate}
        />
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
        <PopupButtons onCancel={onClose} onSave={handleSave} />
      </div>
    </PopupOverlay>
  );
};

export const PhonePopup = ({ initialValue, onSave, onClose }) => {
  const [phone, setPhone] = useState(initialValue);
  const [error, setError] = useState("");

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
    const { message } = validatePhone(formattedPhone);
    setError(message);
  };

  const handleSave = () => {
    const { isValid, message } = validatePhone(phone);
    if (isValid) {
      onSave("phone", phone.replace(/-/g, ""));
      onClose();
    } else {
      setError(message);
    }
  };

  return (
    <PopupOverlay onClose={onClose}>
      <PopupHeader title="전화번호 수정" onClose={onClose} />
      <div className="popup-content">
        <input
          type="tel"
          value={phone}
          onChange={handleChange}
          placeholder="010-1234-5678"
        />
        {error && <p className="error">{error}</p>}
        <PopupButtons onCancel={onClose} onSave={handleSave} />
      </div>
    </PopupOverlay>
  );
};

export const EmailPopup = ({ initialValue, onSave, onClose }) => {
  const [email, setEmail] = useState(initialValue);
  const [error, setError] = useState("");

  const handleSave = () => {
    const { isValid, message } = validateEmail(email);
    if (isValid) {
      onSave("email", email || null);
      onClose();
    } else {
      setError(message);
    }
  };

  return (
    <PopupOverlay onClose={onClose}>
      <PopupHeader title="이메일 수정" onClose={onClose} />
      <div className="popup-content">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {error && <p className="error">{error}</p>}
        <PopupButtons onCancel={onClose} onSave={handleSave} />
      </div>
    </PopupOverlay>
  );
};

export const NamePopup = ({ initialValue, onSave, onClose }) => {
  const [name, setName] = useState(initialValue);
  const [error, setError] = useState("");

  const handleSave = () => {
    const { isValid, message } = validateName(name);
    if (isValid) {
      onSave("name", name);
      onClose();
    } else {
      setError(message);
    }
  };

  return (
    <PopupOverlay onClose={onClose}>
      <PopupHeader title="이름 수정" onClose={onClose} />
      <div className="popup-content">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        {error && <p className="error">{error}</p>}
        <PopupButtons onCancel={onClose} onSave={handleSave} />
      </div>
    </PopupOverlay>
  );
};

export const BirthPopup = ({ initialValue, onSave, onClose }) => {
  const [birth, setBirth] = useState(initialValue);
  const [error, setError] = useState("");

  const handleSave = () => {
    const { isValid, message } = validateBirth(birth);
    if (isValid) {
      onSave("birth", birth);
      onClose();
    } else {
      setError(message);
    }
  };

  return (
    <PopupOverlay onClose={onClose}>
      <PopupHeader title="생년월일 수정" onClose={onClose} />
      <div className="popup-content">
        <input
          type="text"
          value={birth}
          onChange={(e) => setBirth(e.target.value)}
        />
        {error && <p className="error">{error}</p>}
        <PopupButtons onCancel={onClose} onSave={handleSave} />
      </div>
    </PopupOverlay>
  );
};

export const NewReviewPopup = ({ newInitialValue, onClose }) => {
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

  return (
    <PopupOverlay onClose={onClose}>
      <PopupHeader
        title={`${newInitialValue.title} 새 리뷰 작성`}
        onClose={onClose}
      />
      <div className="popup-content">
        <div className="rating">
          {[1, 2, 3, 4, 5].map((star) => (
            <FaStar
              key={star}
              className={star <= rating ? "star active" : "star"}
              onClick={() => setRating(star)}
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
        <PopupButtons onCancel={onClose} onSave={handleSave} />
      </div>
    </PopupOverlay>
  );
};

export const EditReviewPopup = ({ initialValue, onClose, onUpdate }) => {
  const [review, setReview] = useState(initialValue.content);
  const [rating, setRating] = useState(initialValue.rating);
  const [error, setError] = useState("");

  const handleSave = async () => {
    if (review.trim() !== "") {
      try {
        const response = await axios.put(`member/review/${initialValue.no}`, {
          content: review,
          rating: rating,
        });

        if (response.status === 200) {
          onUpdate(response.data);
          alert("리뷰가 성공적으로 수정되었습니다.");
          onClose();
        } else {
          setError("리뷰 수정에 실패했습니다.");
        }
      } catch (err) {
        console.error("리뷰 수정 중 오류 발생:", err);
        setError("리뷰 수정 중 오류가 발생했습니다.");
      }
    } else {
      setError("리뷰를 입력해주세요.");
    }
  };

  return (
    <PopupOverlay onClose={onClose}>
      <PopupHeader
        title={`${initialValue.title} 리뷰 수정`}
        onClose={onClose}
      />
      <div className="popup-content">
        <div className="rating">
          {[1, 2, 3, 4, 5].map((star) => (
            <FaStar
              key={star}
              className={star <= rating ? "star active" : "star"}
              onClick={() => setRating(star)}
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
        <PopupButtons onCancel={onClose} onSave={handleSave} />
      </div>
    </PopupOverlay>
  );
};
