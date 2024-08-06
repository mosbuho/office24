import React, { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import '../../styles/pages/manager/ManagerResetPw.css';

const ManagerResetPw = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id: initialId, phone: initialPhone } = location.state || {};
  const [id, setId] = useState('');
  const [codeInput, setCodeInput] = useState('');
  const [newPw, setNewPw] = useState('');
  const [pwConfirm, setPwConfirm] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [pwError, setPwError] = useState('');
  const [pwConfirmError, setPwConfirmError] = useState('');
  const pwConfirmRef = useRef(null);

  const validatePw = (pw) => {
    const pwRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/;
    if (!pwRegex.test(pw)) {
      setPwError('8자 이상 16자 이하의 영문, 숫자, 특수문자를 각각 1개 이상 포함해야 합니다.');
      return false;
    }
    setPwError('');
    return true;
  };

  const validatePwConfirm = (pw, pwConfirm) => {
    if (pw !== pwConfirm) {
      setPwConfirmError('비밀번호가 일치하지 않습니다.');
      return false;
    }
    setPwConfirmError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isPhoneVerified) {
      alert('전화번호 인증을 완료해주세요.');
      return;
    }

    if (id !== initialId) {
      alert('아이디가 일치하지 않습니다.');
      return;
    }

    if (!validatePw(newPw) || !validatePwConfirm(newPw, pwConfirm)) {
      return;
    }

    try {
      await axios.post('http://localhost:8080/manager/reset-pw', {
        id,
        pw: newPw
      });

      alert('새 비밀번호가 성공적으로 설정되었습니다.');
      navigate('/manager');
    } catch (error) {
      alert(error.response.data || '비밀번호 재설정 중 오류가 발생했습니다.');
    }
  };

  // [번호인증] 버튼
  const sendCode = async () => {
    try {
      const response = await axios.post('http://localhost:8080/message/send-one', {
        to: initialPhone,
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
      <div className="managerSearchPw-container">
        <div className='searchPw'>
          <div className="logo">OFFICE24</div>
          <div className="tabs">
            <span className="active">아이디 찾기&nbsp;&nbsp;</span>
            <span className='none'><strong> &gt; &nbsp;비밀번호 재설정</strong></span>
          </div>
          <form className="find-form" onSubmit={handleSubmit}>
            <div className='input-group'>
              <input
                type="text"
                placeholder="아이디를 입력하세요."
                value={id}
                onChange={(e) => setId(e.target.value)}
                required
              />
            </div>
            <div className='input-group'>
              <input
                type="text"
                placeholder="가입 시 등록한 전화번호를 입력해 주세요."
                value={initialPhone}
                readOnly
                required
              />
              <button type="button" className="find-btn" onClick={sendCode}>번호 인증</button>
            </div>
            {codeSent && !isPhoneVerified && (
              <div className="input-group">
                <input
                  type="text"
                  placeholder="전송된 임시 비밀번호를 입력하세요."
                  value={codeInput}
                  onChange={(e) => setCodeInput(e.target.value)}
                  required
                />
                <button type="button" className="find-btn" onClick={verifyCode}>인증</button>
              </div>
            )}
            {isPhoneVerified && (
              <>
                <div className="input-group">
                  <input
                    type="password"
                    placeholder="새 비밀번호를 입력하세요."
                    value={newPw}
                    onChange={(e) => { setNewPw(e.target.value); validatePw(e.target.value); }}
                    required
                  />
                </div>
                {pwError && <p className="error-message">{pwError}</p>}
                <div className="input-group">
                  <input type="password" id="pwConfirm" placeholder="비밀번호를 다시 입력하세요" value={pwConfirm}
                    onChange={(e) => {
                      setPwConfirm(e.target.value);
                      validatePwConfirm(newPw, e.target.value);
                    }} ref={pwConfirmRef} required />
                </div>
                {pwConfirmError && <p className="error-message">{pwConfirmError}</p>}
                <button type="submit" className="find-btn">비밀번호 재설정</button>
              </>
            )}
          </form>
          <div className="options">
            <button onClick={() => navigate('/manager')}>로그인</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default ManagerResetPw;
