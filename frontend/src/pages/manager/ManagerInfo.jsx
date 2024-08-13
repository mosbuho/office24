import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../utils/axiosConfig';
import ManagerHeader from "../../components/manager/ManagerHeader";
import ManagerSidebar from "../../components/manager/ManagerSidebar";
import '../../styles/pages/manager/ManagerInfo.css';
import { getNo } from '../../utils/auth';

const ManagerInfo = () => {
  const no = getNo();
  const [originalData, setOriginalData] = useState({});
  const [formData, setFormData] = useState({
    id: '',
    pw: '',
    pwConfirm: '',
    name: '',
    phone: '',
    email: ''
  });

  const [pwError, setPwError] = useState('');
  const [pwConfirmError, setPwConfirmError] = useState('');
  const [nameError, setNameError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [emailError, setEmailError] = useState('');

  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [codeInput, setCodeInput] = useState('');
  const navigate = useNavigate();

  const pwRef = useRef();
  const pwConfirmRef = useRef();
  const nameRef = useRef();
  const phoneRef = useRef();
  const emailRef = useRef();

  useEffect(() => {
    const fetchManagerInfo = async () => {
      try {
        const response = await axios.get(`/manager/info/${no}`, { withCredentials: true });
        console.log(response.data);
        setOriginalData(response.data);
        setFormData({
          id: response.data.id,
          pw: '',
          pwConfirm: '',
          name: response.data.name,
          phone: response.data.phone,
          email: response.data.email
        });
      } catch (error) {
        alert('정보를 불러오는 중 오류가 발생했습니다.');
      }
    };

    fetchManagerInfo();
  }, [no]);

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
    let isValid = true;

    if (formData.pw) {
      isValid = validatePw(formData.pw) && isValid;
      isValid = validatePwConfirm(formData.pw, formData.pwConfirm) && isValid;
    }

    isValid = validateName(formData.name) && isValid;
    isValid = validatePhone(formData.phone) && isValid;

    if (formData.email) {
      isValid = validateEmail(formData.email) && isValid;
    }

    return isValid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) {
      return;
    }
    if (!isPhoneVerified) {
      alert('전화번호 인증을 완료해주세요.');
      return;
    }

    const updatedData = {
      no: no,
      pw: formData.pw || originalData.pw,
      name: formData.name || originalData.name,
      phone: formData.phone || originalData.phone,
      email: formData.email || originalData.email
    };

    if (formData.pw && formData.pw !== originalData.pw) updatedData.pw = formData.pw;
    if (formData.name !== originalData.name) updatedData.name = formData.name;
    if (formData.phone !== originalData.phone) updatedData.phone = formData.phone;
    if (formData.email !== originalData.email) updatedData.email = formData.email;

    console.log('Updated data being sent:', JSON.stringify(updatedData, null, 2));
    try {
      const response = await axios.post(`/manager/update/${no}`, updatedData, { withCredentials: true });
      console.log(response.data);
      alert('정보가 성공적으로 수정되었습니다.');
      navigate('/manager');
    } catch (error) {
      console.error("정보 수정 중 오류 : " + error.response ? error.response.data : error.message);
      alert('정보 수정 중 오류가 발생했습니다.');
    }
  };

  const sendCode = async () => {
    if (!validatePhone(formData.phone)) {
      alert('번호를 제대로 입력해주세요.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8080/message/send-one', {
        to: formData.phone,
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
      <ManagerSidebar />
      <div className="managerInfo-container">
        <div className="headernav">
          <ul>
            <li>개인 정보 수정</li>
          </ul>
        </div>
        <div className='reg-container'>
          <div className="signup-tabs">
            <div className="active">Manager</div>
          </div>
          <form className="signup-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="id">아이디</label>
              <input type="text" id="id" value={formData.id || ''} disabled />
            </div>
            <div className="input-group">
              <label htmlFor="pw">비밀번호</label>
              <input type="password" id="pw" value={formData.pw || ''}
                onChange={(e) => {
                  setFormData({ ...formData, pw: e.target.value });
                  validatePw(e.target.value);
                }} ref={pwRef} required/>
            </div>
            {pwError && <div className="error">{pwError}</div>}
            <div className="input-group">
              <label htmlFor="pwConfirm">비밀번호 확인</label>
              <input type="password" id="pwConfirm" placeholder="비밀번호를 다시 입력하세요" value={formData.pwConfirm || ''}
                onChange={(e) => {
                  setFormData({ ...formData, pwConfirm: e.target.value });
                  validatePwConfirm(formData.pw, e.target.value);
                }} ref={pwConfirmRef} required />
            </div>
            {pwConfirmError && <div className="error">{pwConfirmError}</div>}
            <div className="input-group">
              <label htmlFor="name">이름</label>
              <input type="text" id="name" value={formData.name || ''}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                  validateName(e.target.value);
                }} ref={nameRef} required />
            </div>
            {nameError && <div className="error">{nameError}</div>}
            <div className="input-group">
              <label htmlFor="phone">전화번호</label>
              <input type="text" id="phone" value={formData.phone || ''}
                onChange={(e) => {
                  setFormData({ ...formData, phone: e.target.value });
                  validatePhone(e.target.value);
                }} ref={phoneRef} required />
              <button type="button" onClick={sendCode}>번호 인증</button>
            </div>
            {phoneError && <div className="error">{phoneError}</div>}
            {codeSent && !isPhoneVerified && (
              <>
                <div className="input-group">
                  <label htmlFor="codeInput">인증코드</label>
                  <input type="text" id="codeInput" placeholder="전송된 6자리 코드를 입력하세요." value={codeInput}
                    onChange={(e) => setCodeInput(e.target.value)} required />
                  <button type="button" onClick={verifyCode}>인증</button>
                </div>
                {isPhoneVerified && <div className="verification-success">번호 인증이 완료되었습니다.</div>}
              </>
            )}
            <div className="input-group">
              <label htmlFor="email">이메일</label>
              <input type="email" id="email" value={formData.email || ''}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value });
                  validateEmail(e.target.value);
                }} ref={emailRef} />
            </div>
            {emailError && <div className="error">{emailError}</div>}
            <button type="submit" className="signup-btn">수정</button>
          </form>
        </div>
      </div>
      <ManagerHeader />
    </>
  );
}

export default ManagerInfo;
