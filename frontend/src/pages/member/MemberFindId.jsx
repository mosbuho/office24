import React, { useState } from 'react';
import axios from 'axios';
import '../../styles/pages/member/MemberFindId.css';

const MemberFindId = () => {
    const [searchType, setSearchType] = useState('email');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const handleSearchTypeChange = (e) => {
        setSearchType(e.target.value);
        setEmail('');
        setPhone('');
        setResult(null);
        setError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/member/findId', {
                type: searchType,
                email: searchType === 'email' ? email : null,
                phone: searchType === 'phone' ? phone : null,
            });
            setResult(response.data.id);
            setError(null);
        } catch (error) {
            setError(error.response.data || '아이디를 찾을 수 없습니다.');
            setResult(null);
        }
    };

    return (
        <div className="find-id-form">
            <div className="logo">로고</div>
            <h2>아이디 찾기</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>
                        <input type="radio" value="email" checked={searchType === 'email'} onChange={handleSearchTypeChange}/>
                        이메일로 찾기
                    </label>
                    <label>
                        <input type="radio" value="phone" checked={searchType === 'phone'} onChange={handleSearchTypeChange}/>
                        핸드폰 번호로 찾기
                    </label>
                </div>
                {searchType === 'email' && (
                    <div>
                        <label htmlFor="email">이메일</label><input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
                    </div>
                )}
                {searchType === 'phone' && (
                    <div>
                        <label htmlFor="phone">핸드폰 번호</label>
                        <input type="text" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} required/>
                    </div>
                )}
                <button type="submit">아이디 찾기</button>
            </form>
            {result && <div className="result">아이디: {result}</div>}
            {error && <div className="error">{error}</div>}
        </div>
    );
};

export default MemberFindId;
