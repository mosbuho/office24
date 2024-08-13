import { EditorState, convertFromRaw } from 'draft-js';
import React, { useEffect, useState } from "react";
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { FaStar } from "react-icons/fa6";
import { IoCloseCircle } from "react-icons/io5";
import ReactPaginate from 'react-paginate';
import { useNavigate } from "react-router-dom";
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


export const PhonePopup = ({ initialValue, onSave, onClose }) => {
  const [phone, setPhone] = useState(initialValue);
  const [error, setError] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);

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
      if (isPhoneVerified) {
        onSave("phone", phone.replace(/-/g, ""));
        onClose();
      } else {
        alert("전화번호 인증이 필요합니다.");
      }
    } else {
      setError(isValid ? "전화번호 인증이 필요합니다." : message);
    }
  };

  const handleSendVerificationCode = async () => {
    try {
      const response = await axios.post('http://localhost:8080/message/send-one', {
        to: phone.replace(/-/g, ""),
      }, { withCredentials: true });

      if (response.status === 200) {
        setIsCodeSent(true);
        setIsVerifying(true);
        alert('인증 코드가 전송되었습니다.');
      } else {
        alert('인증 코드 전송에 실패했습니다.');
      }
    } catch (error) {
      alert('인증 코드 전송 중 오류가 발생했습니다.');
    }
  };

  const handleVerificationCodeChange = (e) => {
    setVerificationCode(e.target.value);
  };

  const handleVerifyCode = async () => {
    try {
      const response = await axios.post('http://localhost:8080/message/verify-code', {
        text: verificationCode,
      }, { withCredentials: true });

      if (response.status === 200) {
        const isValid = response.data;
        setIsPhoneVerified(isValid);
        if (isValid) {
          alert('인증 코드가 확인되었습니다.');
          setIsVerifying(false);
        } else {
          alert('인증 코드가 유효하지 않습니다.');
        }
      } else {
        alert('인증 코드 확인에 실패했습니다.');
      }
    } catch (error) {
      alert('인증 코드 확인 중 오류가 발생했습니다.');
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
        <button className="popup-verifycode" onClick={handleSendVerificationCode}>번호인증</button>
        {isVerifying && (
          <>
            <input
              type="text"
              value={verificationCode}
              onChange={handleVerificationCodeChange}
              placeholder="인증코드 입력"
            />
            <button onClick={handleVerifyCode} className="popup-verifycode">인증코드확인</button>
          </>
        )}
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

export const NewReviewPopup = ({ newInitialValue, onClose, onUpdate }) => {
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);
  const [error, setError] = useState("");

  const handleSave = async () => {
    if (review.trim() !== "" && rating > 0) {
      try {
        const no = getNo();
        const response = await axios.post(`/member/${no}/review`, {
          memberNo: no,
          officeNo: newInitialValue.OFFICE_NO,
          content: review,
          rating: rating,
        });

        if (response.status === 200) {
          onUpdate(response.data);
          alert("리뷰가 성공적으로 작성되었습니다.");
          onClose();
        } else {
          setError("리뷰 작성에 실패했습니다.");
        }
      } catch (err) {
        console.error("리뷰 작성 중 오류 발생:", err);
        setError("리뷰 작성 중 오류가 발생했습니다.");
      }
    } else {
      setError("리뷰 내용과 별점을 모두 입력해주세요.");
    }
  };

  return (
    <PopupOverlay onClose={onClose}>
      <PopupHeader
        title={`${newInitialValue.OFFICE_TITLE} 새 리뷰 작성`}
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
  const userNo = getNo();
  const [review, setReview] = useState(initialValue.content);
  const [rating, setRating] = useState(initialValue.rating);
  const [error, setError] = useState("");

  const handleSave = async () => {
    if (review.trim() !== "") {
      try {
        const response = await axios.put(`member/${userNo}/review/${initialValue.no}`, {
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

const NoticePopup = ({ onClose }) => {
  const [notices, setNotices] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [pageCount, setPageCount] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);
  const [openIndex, setOpenIndex] = useState(null);
  const [pageDataCache, setPageDataCache] = useState({});

  const noticesPerPage = 10;

  useEffect(() => {
    fetchNotices(1);
  }, []);

  const fetchNotices = async (page) => {
    if (pageDataCache[page]) {
      setNotices(pageDataCache[page]);
      return;
    }

    const response = await axios.get('/notice', {
      params: {
        page, size: noticesPerPage
      }
    });

    const { notices: fetchedNotices, totalCount } = response.data;

    setPageDataCache(prevCache => ({
      ...prevCache,
      [page]: fetchedNotices
    }));

    setNotices(fetchedNotices);
    setTotalCount(totalCount);
    setPageCount(Math.ceil(totalCount / noticesPerPage));
  };

  const handlePageClick = (selectedItem) => {
    const newPage = selectedItem.selected + 1;
    setCurrentPage(selectedItem.selected);
    fetchNotices(newPage);
  };

  const handleClick = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const getEditorStateFromRaw = (rawContent) => {
    const contentState = convertFromRaw(JSON.parse(rawContent));
    return EditorState.createWithContent(contentState);
  };

  return (
    <div className="notice-popup-overlay">
      <div className="notice-popup-container">
        <div className="notice-popup-header">
          <h2>공지사항</h2>
          <button className="notice-popup-close-button" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="notice-popup-content">
          {notices.length > 0 ? (
            <>
              <ul>
                {notices.map((notice, index) => (
                  <li key={index} className="notice-item">
                    <h4 onClick={() => handleClick(index)}>{notice.TITLE}</h4>
                    <div className={`notice-details ${openIndex === index ? 'open' : ''}`}>
                      <Editor
                        editorState={getEditorStateFromRaw(notice.CONTENT)}
                        readOnly={true}
                        toolbarHidden={true}
                      />
                    </div>
                  </li>
                ))}
              </ul>
              <ReactPaginate
                previousLabel={"이전"}
                nextLabel={"다음"}
                breakLabel={"..."}
                pageCount={pageCount}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={handlePageClick}
                containerClassName={"admin-pagination"}
                activeClassName={"active"}
                disabledClassName={"disabled"}
                previousClassName={"previous"}
                nextClassName={"next"}
                forcePage={currentPage}
              />
            </>
          ) : (
            <p>공지사항이 없습니다.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default NoticePopup;