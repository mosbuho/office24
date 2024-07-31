import React, {useEffect, useState} from 'react';
import '/src/styles/pages/member/MemberOffice.css';
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";

const MemberOffice = () => {
    const {no} = useParams();
    const navigate = useNavigate();
    const [office, setOffice] = useState(null);

    const logoClick = () => {
        navigate('/');
    }

    const goBack = () => {
        navigate(-1); // 이전 페이지로 이동
    }

    useEffect(() => {
        axios.get(`http://localhost:8080/member/office/${no}`)
            .then(response => {
                setOffice(response.data);
            })
            .catch(error => {
                alert("로딩 실패");
            });
    }, [no]);

    if (!office) return <p>Loading...</p>;

    return (
        <div className="office-detail-page-container">
            <div className="office-detail-content">
                <div className="office-logo-container">
                    <div className="back-button" onClick={goBack}>
                        &lt;&lt; 뒤로가기
                    </div>
                    <div className="office-logo" onClick={logoClick}>
                        OFFICE24
                    </div>
                </div>
                <div className="office-image-container">
                    <img src="/images/logo.jpg" alt="Office" className="office-image" />
                </div>
                <div className="office-info">
                    <h2 className="office-name">{office.title}</h2>
                    <p className="office-address">주소: {office.address}</p>
                    <p className="office-zipcode">우편번호: {office.zipCode}</p>
                    <p className="office-description">상세설명: {office.content}</p>
                    <p className="office-price">가격: {office.price}원</p>
                    <p className="office-max-capacity">수용인원: {office.capacity}명</p>
                    <button className="office-reserve-button">예약하기</button>
                </div>
            </div>
        </div>
    );
};

export default MemberOffice;
