import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../styles/pages/manager/ManagerRegister.css';

const ManagerRegister = () => {
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const [pwConfirm, setPwConfirm] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const [idError, setIdError] = useState('');
  const [pwError, setPwError] = useState('');
  const [pwConfirmError, setPwConfirmError] = useState('');
  const [nameError, setNameError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [emailError, setEmailError] = useState('');

  const [isPhoneVerified, setIsPhoneVerified] = useState(false); // 전화번호 인증 상태
  const [codeSent, setCodeSent] = useState(false); // 인증 코드 전송 상태
  const [codeInput, setCodeInput] = useState(''); // 입력받은 인증 코드
  const [isIdAvailable, setIsIdAvailable] = useState(null); // 아이디 중복 확인 상태
  const navigate = useNavigate();

  const idRef = useRef();
  const pwRef = useRef();
  const pwConfirmRef = useRef();
  const nameRef = useRef();
  const phoneRef = useRef();
  const emailRef = useRef();

  // 유효성 검사
  const validateId = (id) => {
    const idRegex = /^[a-zA-Z0-9]{6,12}$/;
    if (!idRegex.test(id)) {
      setIdError('6자 이상 12자 이하의 영문자와 숫자만 가능합니다.');
      idRef.current.focus();
      return false;
    }
    setIdError('');
    return true;
  };

  const validatePw = (pw) => {
    const pwRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/;
    if (!pwRegex.test(pw)) {
      setPwError('8자 이상 16자 이하의 영문, 숫자, 특수문자를 각각 1개 이상 포함해야 합니다.');
      pwRef.current.focus();
      return false;
    }
    setPwError('');
    return true;
  };

  const validatePwConfirm = (pw, pwConfirm) => {
    if (pw !== pwConfirm) {
      setPwConfirmError('비밀번호가 일치하지 않습니다.');
      pwConfirmRef.current.focus();
      return false;
    }
    setPwConfirmError('');
    return true;
  };

  const validateName = (name) => {
    const nameRegex = /^[가-힣]{2,12}$/;
    if (!nameRegex.test(name)) {
      setNameError('2자 이상 12자 이하의 한글만 가능합니다.');
      nameRef.current.focus();
      return false;
    }
    setNameError('');
    return true;
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^\d{11}$/;
    if (!phoneRegex.test(phone)) {
      setPhoneError("'-'를 제외한 11자리 숫자만 가능합니다.");
      phoneRef.current.focus();
      return false;
    }
    setPhoneError('');
    return true;
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
      setEmailError('이메일 형식이 올바르지 않습니다.');
      emailRef.current.focus();
      return false;
    }
    setEmailError('');
    return true;
  };

  const validateForm = () => {
    const isValidId = validateId(id);
    const isValidPw = validatePw(pw);
    const isValidPwConfirm = validatePwConfirm(pw, pwConfirm);
    const isValidName = validateName(name);
    const isValidPhone = validatePhone(phone);
    const isValidEmail = validateEmail(email);

    return isValidId && isValidPw && isValidPwConfirm && isValidName && isValidPhone && isValidEmail;
  };

  // [가입] 버튼
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) {
      return;
    }
    if (!isPhoneVerified) {
      alert('전화번호 인증을 완료해주세요.');
      return;
    }
    if (isIdAvailable === false) {
      alert('아이디 중복 확인을 해주세요.');
      return;
    }
    try {
      const response = await axios.post('http://localhost:8080/manager/register', {
        id,
        pw,
        name,
        phone,
        email,
      }, { withCredentials: true });
      if (response.status === 200) {
        navigate('/manager/login');
        alert('회원가입이 완료되었습니다.');
      } else {
        alert('회원가입 중 오류가 발생했습니다.');
      }
    } catch (error) {
      alert(`요청을 설정하는 중 오류가 발생했습니다: ${error.message}`);
      console.error('요청 설정 오류:', error.message);
    }
  };

  // [중복 확인] 버튼
  const handleIdCheck = async () => {
    try {
      const response = await axios.get('http://localhost:8080/manager/idCheck', {
        params: { id }
      });
      if (response.status === 200) {
        alert('사용 가능한 아이디입니다.');
        setIsIdAvailable(true);
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        alert('이미 사용 중인 아이디입니다.');
        setIsIdAvailable(false);
      } else {
        alert('아이디 중복 확인 중 오류가 발생했습니다.');
        console.error('아이디 중복 확인 오류:', error.message);
      }
    }
  };

  // [번호인증] 버튼
  const sendCode = async () => {
    try {
      const response = await axios.post('http://localhost:8080/message/send-one', {
        to: phone,
      }, { withCredentials: true });

      if (response.status === 200) {
        setCodeSent(true);
        alert('인증 코드가 전송되었습니다.');
      } else {
        alert('인증 코드 전송에 실패했습니다.');
      }
    } catch (error) {
      alert('인증 코드 전송 중 오류가 발생했습니다.');
    }
  };

  // [인증] 버튼
  const verifyCode = async () => {
    try {
      const response = await axios.post('http://localhost:8080/message/verify-code', {
        text: codeInput,
      }, { withCredentials: true });

      if (response.status === 200) {
        const isValid = response.data;
        setIsPhoneVerified(isValid);
        if (isValid) {
          alert('인증 코드가 확인되었습니다.');
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
    <>
      <div className="managerRegister-container">
        <div className='reg-container'>
          <div className="logo">office24</div>
          <div className="signup-tabs">
            <div className="active">관리자 회원가입</div>
          </div>
          <form className="signup-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="id">아이디</label>
              <input type="text" id="id" placeholder="6~12자, 영문자와 숫자만" value={id}
                onChange={(e) => {
                  setId(e.target.value);
                  validateId(e.target.value);
                }} ref={idRef} required />
              <button type="button" onClick={handleIdCheck}>중복확인</button>
            </div>
            {idError && <div className="error">{idError}</div>}
            {isIdAvailable === false && <div className="error">이미 사용 중인 아이디입니다.</div>}
            <div className="input-group">
              <label htmlFor="pw">비밀번호</label>
              <input type="password" id="pw" placeholder="8~16자, 영문, 숫자, 특수문자 포함" value={pw} 
                onChange={(e) => {
                  setPw(e.target.value);
                  validatePw(e.target.value);
                }} ref={pwRef} required />
            </div>
            {pwError && <div className="error">{pwError}</div>}
            <div className="input-group">
              <label htmlFor="pwConfirm">비밀번호 재입력</label>
              <input type="password" id="pwConfirm" placeholder="비밀번호를 다시 입력하세요" value={pwConfirm}
                onChange={(e) => {
                  setPwConfirm(e.target.value);
                  validatePwConfirm(pw, e.target.value);
                }} ref={pwConfirmRef} required />
            </div>
            {pwConfirmError && <div className="error">{pwConfirmError}</div>}
            <div className="input-group">
              <label htmlFor="name">이름</label>
              <input type="text" id="name" placeholder="2~12자, 한글만" value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  validateName(e.target.value);
                }} ref={nameRef} required />
            </div>
            {nameError && <div className="error">{nameError}</div>}
            <div className="input-group">
              <label htmlFor="phone">전화번호</label>
              <input type="text" id="phone" placeholder="'-' 를 제외한 11자리 숫자" value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  validatePhone(e.target.value);
                }} ref={phoneRef} required />
              <button type="button" onClick={sendCode}>번호 인증</button>
            </div>
            {phoneError && <div className="error">{phoneError}</div>}
            {codeSent && !isPhoneVerified && (
              <div className="input-group">
                <label htmlFor="codeInput">인증코드</label>
                <input type="text" id="codeInput" placeholder="전송된 6자리 코드를 입력하세요." value={codeInput}
                  onChange={(e) => setCodeInput(e.target.value)} required />
                <button type="button" onClick={verifyCode}>인증</button>
              </div>
            )}
            {isPhoneVerified && <div className="verification-success">번호 인증이 완료되었습니다.</div>}
            <div className="input-group">
              <label htmlFor="email">이메일</label>
              <input type="email" id="email" placeholder="(선택 항목)" value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  validateEmail(e.target.value);
                }} ref={emailRef} />
            </div>
            {emailError && <div className="error">{emailError}</div>}
            <button type="submit" className="signup-btn">회원가입</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ManagerRegister;
