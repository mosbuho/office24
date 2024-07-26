import React from 'react';
import "/src/styles/pages/member/MemberPayment.css";

const MemberPayment = () => {
    return (
        <div className="member-payment-wrapper">
            <div className="member-payment-container">
                <form className="member-payment-form">
                    <h1 className="member-payment-form-payment">결제</h1>
                    <label className="member-payment-form-start-date">
                        예약시작일
                        <input type="date" name="start-date" />
                    </label>
                    <label className="member-payment-form-end-date">
                        예약종료일
                        <input type="date" name="end-date" />
                    </label>
                    <label className="member-payment-form-people">
                        인원
                        <input type="number" name="people" />
                    </label>
                    <label className="member-payment-form-payment-method">
                        결제수단
                        <select name="payment-method">
                            <option value="credit-card">신용카드</option>
                            <option value="paypal">페이팔</option>
                            <option value="bank-transfer">은행 송금</option>
                        </select>
                    </label>
                </form>
                <div className="member-payment-photo">사진</div>
                <div className="member-payment-title">타이틀</div>
                <div className="member-payment-description">오피스 설명</div>
                <div className="member-payment-details">
                    예약 시작일<br />
                    예약 종료일<br />
                    인원<br />
                    가격<br />
                    사용가능여부<br />
                    결제수단
                </div>
            </div>
        </div>
    );
}

export default MemberPayment;
