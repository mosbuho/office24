import React, { useState } from 'react';
import axios from 'axios';
import '../../styles/pages/member/MemberFindPw.css';

const MemberFindPw = () => {
    const [formData, setFormData] = useState({
        id: '',
        phone: '',
        verificationCode: '',
    });
    const [message, setMessage] = useState('');
    const [isCodeSent, setIsCodeSent] = useState(false);
    const [isVerified, setIsVerified] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleIdCheck = () => {
        axios.post('http://localhost:8080/member/checkId', {id: formData.id})
            .then(response => {
                if (response.status === 200) {
                    alert('아이디 확인 완료')
                    setMessage('아이디 확인 완료');
                } else {
                    alert('존재하지 않는 아이디입니다.')
                    setMessage('존재하지 않는 아이디입니다.');
                }
            })
            .catch(error => {
                alert('존재하지 않는 아이디입니다.')
                setMessage('존재하지 않는 아이디입니다.');
            });
    };

    const sendVerificationCode = () => {
        axios.post('http://localhost:8080/member/sendCode', { phone: formData.phone })
            .then(response => {
                setIsCodeSent(true);
                setMessage('인증 코드가 전송되었습니다.');
            })
            .catch(error => {
                setMessage('인증 코드 전송 중 오류가 발생했습니다.');
            });
    };

    const verifyCode = () => {
        axios.post('http://localhost:8080/member/verifyCode', { phone: formData.phone, code: formData.verificationCode })
            .then(response => {
                if (response.data.verified) {
                    setIsVerified(true);
                    setMessage('휴대폰 번호 인증 완료.');
                } else {
                    setMessage('인증 코드가 일치하지 않습니다.');
                }
            })
            .catch(error => {
                setMessage('인증 중 오류가 발생했습니다.');
                console.error(error);
            });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isVerified) {
            axios.post('http://localhost:8080/member/findPw', { id: formData.id, phone: formData.phone })
                .then(response => {
                    setMessage('비밀번호 재설정 링크가 휴대폰으로 전송되었습니다.');
                })
                .catch(error => {
                    setMessage('비밀번호 재설정 링크 전송에 실패했습니다. 다시 시도해 주세요.');
                    console.error(error);
                });
        } else {
            setMessage('휴대폰 번호 인증을 완료해 주세요.');
        }
    };

    return (
        <div className="find-pw-form">
            <div className="logo">로고</div>
            <h2>비밀번호 찾기</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="id">아이디</label>
                    <div className="input-group">
                        <input
                            type="text"
                            id="id"
                            name="id"
                            value={formData.id}
                            onChange={handleChange}
                            required
                            placeholder="아이디를 입력하세요"
                        />
                        <button type="button" className="check-btn" onClick={handleIdCheck}>
                            아이디 확인
                        </button>
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="phone">휴대폰 번호</label>
                    <div className="input-group">
                        <input
                            type="text"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            placeholder="휴대폰 번호를 입력하세요"
                        />
                        <button type="button" className="check-btn" onClick={sendVerificationCode}>
                            번호 인증
                        </button>
                    </div>
                </div>
                {isCodeSent && (
                    <div className="form-group">
                        <label htmlFor="verificationCode">인증 코드</label>
                        <div className="input-group">
                            <input
                                type="text"
                                id="verificationCode"
                                name="verificationCode"
                                value={formData.verificationCode}
                                onChange={handleChange}
                                required
                                placeholder="인증 코드를 입력하세요"
                            />
                            <button type="button" className="check-btn" onClick={verifyCode}>
                                인증 코드 확인
                            </button>
                        </div>
                    </div>
                )}
                <button type="submit" className="submit-btn">로그인 화면으로</button>
            </form>
            {message && <p className="message">{message}</p>}
        </div>
    );
};

export default MemberFindPw;
