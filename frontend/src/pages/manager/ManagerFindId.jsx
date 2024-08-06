import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../styles/pages/manager/ManagerFindId.css';

const ManagerFindId = () => {
  const navigate = useNavigate();
  const [id, setId] = useState('');
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const phoneRef = useRef();

  const validatePhone = (phone) => {
    const phoneRegex = /^\d{11}$/;
    if (!phoneRegex.test(phone)) {
      setPhoneError("'-' 를 제외한 11자리 숫자만 가능합니다.");
      return false;
    }
    setPhoneError('');
    return true;
  };

  const handlePhoneChange = (e) => {
    const inputPhone = e.target.value;
    setPhone(inputPhone);
    validatePhone(inputPhone);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validatePhone(phone)) {
      return;
    }

    try {
      const response = await axios.post('http://localhost:8080/manager/find-id', { phone });
      setId(response.data);
      alert(`아이디: ${response.data}`);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setPhoneError(error.response.data);
        phoneRef.current.focus(); // 에러 발생 시 포커스를 전화번호 입력 필드로 이동
      } else {
        alert('아이디 찾기 중 오류가 발생했습니다.');
      }
    }
  };

  return (
    <>
      <div className="managerSearchId-container">
        <div className='searchId'>
          <div className="logo">OFFICE24</div>
          <div className="tabs">
            <span className="active"><strong>아이디 찾기&nbsp;&nbsp;</strong></span>
            <span className='none'> &gt; &nbsp;비밀번호 재설정</span>
          </div>
          <form className="find-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <input
                type="text"
                placeholder="가입 시 등록한 전화번호를 입력해 주세요."
                value={phone}
                onChange={handlePhoneChange}
                ref={phoneRef}
                required
              />
              {phoneError && <p className="error-message">{phoneError}</p>}
            </div>
            <button type="submit" className="find-btn">가입한 번호로 아이디 찾기</button>
          </form>
          {id && <p>아이디 : {id}</p>}
          <div className="options">
            <button onClick={() => navigate('/manager')}>로그인</button>
            {id && (
              <button onClick={() => navigate('/manager/reset-pw', { state: { id: id, phone } })}>
                비밀번호 재설정
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default ManagerFindId;
