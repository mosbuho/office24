import React from 'react';
import "/src/styles/pages/member/MemberPaymentList.css";

const MemberPaymentList = () => {
    return (
        <div className="member-payment-list-wrapper">
            <div className="member-payment-list-container">
                <h2>예약 목록</h2>
                <table className="member-payment-list-table">
                    <thead>
                    <tr>
                        <th>결제번호</th>
                        <th>오피스번호</th>
                        <th>결제인번호</th>
                        <th>결제인이름</th>
                        <th>결제수단</th>
                        <th>예약시작일</th>
                        <th>예약종료일</th>
                        <th>가격</th>
                        <th>결제일</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>001</td>
                        <td>101</td>
                        <td>P001</td>
                        <td>홍길동</td>
                        <td>신용카드</td>
                        <td>2024-07-01</td>
                        <td>2024-07-10</td>
                        <td>100,000원</td>
                        <td>2024-06-25</td>
                    </tr>
                    <tr>
                        <td>002</td>
                        <td>102</td>
                        <td>P002</td>
                        <td>김철수</td>
                        <td>페이팔</td>
                        <td>2024-07-15</td>
                        <td>2024-07-20</td>
                        <td>200,000원</td>
                        <td>2024-07-01</td>
                    </tr>
                    <tr>
                        <td>003</td>
                        <td>103</td>
                        <td>P003</td>
                        <td>박영희</td>
                        <td>은행 송금</td>
                        <td>2024-08-01</td>
                        <td>2024-08-10</td>
                        <td>150,000원</td>
                        <td>2024-07-20</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default MemberPaymentList;
