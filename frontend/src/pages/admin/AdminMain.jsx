import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip, Legend, Line, ComposedChart } from 'recharts';
import '../../styles/pages/admin/AdminMain.css';
import { removeTokens } from '../../utils/auth';

import Header from '../../components/admin/AdminHeader';
import Sidebar from '../../components/admin/AdminSidebar';
import StatCard from '../../components/admin/AdminStatCard';
import { fetchAccumulate, fetchAgeGroup, fetchSidoGroup, fetchGroupData } from '../../services/admin/AdminMain';

const calculateChange = (current, previous) => {
    if (previous === 0) return { change: '0.00%', className: 'no-change' };
    const change = ((current - previous) / previous) * 100;
    return { change: `${change.toFixed(2)}%`, className: change === 0 ? 'no-change' : (change > 0 ? 'positive' : 'negative') };
};

const formatAmount = (amount) => {
    if (amount >= 1e9) {
        return `$${(amount / 1e9).toFixed(1)}B`;
    } else if (amount >= 1e6) {
        return `$${(amount / 1e6).toFixed(1)}M`;
    } else if (amount >= 1e4) {
        return `$${(amount / 1e4).toFixed(1)}만`;
    } else if (amount >= 1e3) {
        return `$${(amount / 1e3).toFixed(1)}천`;
    } else {
        return `$${amount}`;
    }
}

const colors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A8D8EA', '#D6A4A4', '#6C5B7B', '#B4D455', '#C71585', '#FF6347', '#4682B4', '#32CD32', '#FFD700', '#FF4500', '#D3D3D3', '#FF69B4', '#8A2BE2'];

const AdminMain = () => {
    const [accumulate, setAccumulate] = useState(null);
    const [ageGroup, setAgeGroup] = useState(null);
    const [sidoGroup, setSidoGroup] = useState(null);
    const [memberGroup, setMemberGroup] = useState(null);
    const [managerGroup, setManagerGroup] = useState(null);
    const [officeGroup, setOfficeGroup] = useState(null);
    const [bookingGroup, setBookingGroup] = useState(null);
    const [salesGroup, setSalesGroup] = useState(null);
    const [reviewGroup, setReviewGroup] = useState(null);
    const [selectGroup, setSelectGroup] = useState('membergroup');
    const navigate = useNavigate();

    const handleLogout = () => {
        removeTokens();
        navigate('/admin/login', { replace: true });
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                await fetchAccumulate(setAccumulate);
                await fetchAgeGroup(setAgeGroup);
                await fetchSidoGroup(setSidoGroup);
                await fetchGroupData(memberGroup, setMemberGroup, 'membergroup');
            } catch {
                console.log("통계 불러오는 중 에러 발생");
            }
        };
        fetchData();
    }, []);

    if (!accumulate || !ageGroup || !sidoGroup || !selectGroup) return <></>;

    const selectChart = async (e) => {
        const selectedGroup = e.target.value;
        setSelectGroup(selectedGroup);
        switch (selectedGroup) {
            case 'membergroup':
                await fetchGroupData(memberGroup, setMemberGroup, 'membergroup');
                break;
            case 'managergroup':
                await fetchGroupData(managerGroup, setManagerGroup, 'managergroup');
                break;
            case 'officegroup':
                await fetchGroupData(officeGroup, setOfficeGroup, 'officegroup');
                break;
            case 'bookinggroup':
                await fetchGroupData(bookingGroup, setBookingGroup, 'bookinggroup');
                break;
            case 'salesgroup':
                await fetchGroupData(salesGroup, setSalesGroup, 'salesgroup');
                break;
            case 'reviewgroup':
                await fetchGroupData(reviewGroup, setReviewGroup, 'reviewgroup');
                break;
        }
    };

    const getChartData = () => {
        let currentGroupData;
        let chartLabels;
        let groupName;

        switch (selectGroup) {
            case 'membergroup':
                currentGroupData = memberGroup;
                chartLabels = { label1: '가입', label2: '탈퇴', label3: '이용자' };
                groupName = '이용자';
                break;
            case 'managergroup':
                currentGroupData = managerGroup;
                chartLabels = { label1: '가입', label2: '탈퇴', label3: '매니저' };
                groupName = '매니저';
                break;
            case 'officegroup':
                currentGroupData = officeGroup;
                chartLabels = { label1: '신규', label2: '삭제', label3: '오피스' };
                groupName = '오피스';
                break;
            case 'bookinggroup':
                currentGroupData = bookingGroup;
                chartLabels = { label1: '예약', label2: '취소', label3: '예약' };
                groupName = '예약';
                break;
            case 'salesgroup':
                currentGroupData = salesGroup;
                chartLabels = { label1: '결제액', label2: '환불액', label3: '총액' };
                groupName = '결제액';
                break;
            case 'reviewgroup':
                currentGroupData = reviewGroup;
                chartLabels = { label1: '신규', label2: '삭제', label3: '리뷰' };
                groupName = '리뷰';
                break;
        }
        return { currentGroupData, chartLabels, groupName };
    };

    const { currentGroupData, chartLabels, groupName } = getChartData();

    return (
        <div className="admin-main-container">
            <Header onLogout={handleLogout} />
            <Sidebar />
            <div className="main">
                <div className="stats-grid">
                    <StatCard
                        title="누적 이용자 수"
                        value={`${accumulate.TODAY_MEMBER_CREATE.toLocaleString('ko-KR')}명`}
                        change={calculateChange(accumulate.TODAY_MEMBER_CREATE, accumulate.YESTERDAY_MEMBER_CREATE)}
                    />
                    <StatCard
                        title="누적 매니저 수"
                        value={`${accumulate.TODAY_MANAGER_CREATE.toLocaleString('ko-KR')}명`}
                        change={calculateChange(accumulate.TODAY_MANAGER_CREATE, accumulate.YESTERDAY_MANAGER_CREATE)}
                    />
                    <StatCard
                        title="누적 오피스 수"
                        value={`${accumulate.TODAY_OFFICE_CREATE.toLocaleString('ko-KR')}개`}
                        change={calculateChange(accumulate.TODAY_OFFICE_CREATE, accumulate.YESTERDAY_OFFICE_CREATE)}
                    />
                    <StatCard
                        title="누적 거래 금액"
                        value={formatAmount(accumulate.TODAY_SALES_CREATE)}
                        change={calculateChange(accumulate.TODAY_SALES_CREATE, accumulate.YESTERDAY_SALES_CREATE)}
                    />
                    <StatCard
                        title="누적 예약 건수"
                        value={`${accumulate.TODAY_BOOKING_CREATE.toLocaleString('ko-KR')}건`}
                        change={calculateChange(accumulate.TODAY_BOOKING_CREATE, accumulate.YESTERDAY_BOOKING_CREATE)}
                    />
                    <StatCard
                        title="누적 리뷰 수"
                        value={`${accumulate.TODAY_REVIEW_CREATE.toLocaleString('ko-KR')}개`}
                        change={calculateChange(accumulate.TODAY_REVIEW_CREATE, accumulate.YESTERDAY_REVIEW_CREATE)}
                    />
                </div>
                <div className="charts-container">
                    <div className="chart-card sales-chart">
                        <div className="chart-header">
                            <h3>{groupName}</h3>
                            <select onChange={selectChart}>
                                <option value="membergroup">이용자</option>
                                <option value="managergroup">매니저</option>
                                <option value="officegroup">오피스</option>
                                <option value="bookinggroup">예약</option>
                                <option value="salesgroup">매출</option>
                                <option value="reviewgroup">리뷰</option>
                            </select>
                        </div>
                        <ResponsiveContainer width="100%" height={300}>
                            <ComposedChart data={currentGroupData} margin={{ top: 20, right: 20, left: 20, bottom: 5 }}>
                                <XAxis dataKey="name" tickFormatter={(value) => value.toLocaleString('ko-KR')} />
                                <YAxis yAxisId="left" tickFormatter={(value) => value.toLocaleString('ko-KR')} />
                                <Tooltip formatter={(value) => value.toLocaleString('ko-KR')} />
                                <Legend />
                                <Bar dataKey={chartLabels.label1} fill="#3cb371" barSize={20} yAxisId="left" />
                                <Bar dataKey={chartLabels.label2} fill="#db4455" barSize={20} yAxisId="left" />
                                <Line type="monotone" dataKey={chartLabels.label3} stroke="#ffa550" strokeWidth={2} dot={false} yAxisId="left" />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="chart-card traffic-chart">
                        <h3>오피스 지역 분포</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={sidoGroup} cx="50%" cy="50%" outerRadius={80} innerRadius={60} dataKey="value" label={({ value }) => `${value}%`} animationDuration={1000} animationEasing="ease-out">
                                    {sidoGroup.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value, name, props) => [`${value}%`, name]} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="chart-card traffic-chart">
                        <h3>이용자 연령대 및 성별</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart
                                data={ageGroup}
                                layout="vertical"
                                margin={{ top: 5, bottom: 5 }}
                            >
                                <XAxis type="number" />
                                <YAxis type="category" dataKey="ageGroup" />
                                <Tooltip formatter={(value) => `${value}%`} />
                                <Legend />
                                <Bar dataKey="M" fill="#4b89dc" stackId="a" name="남성" animationDuration={1000} animationEasing="ease-out" />
                                <Bar dataKey="W" fill="#db4455" stackId="b" name="여성" animationDuration={1000} animationEasing="ease-out" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="bottom-section">
                    <div className="referrals">
                        <h3>신고 내역</h3>
                        <ul>
                            <li>경<span>4,518건</span></li>
                            <li>125<span>4,252건</span></li>
                            <li>1235<span>3,481건</span></li>
                            <li>2153<span>3,172건</span></li>
                            <li>1235<span>2,791건</span></li>
                        </ul>
                    </div>
                    <div className="latest-projects">
                        <h3>승인 대기 오피스</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th>오피스명</th>
                                    <th>주소</th>
                                    <th>매니저 이름</th>
                                    <th>매니저 연락처</th>
                                    <th>신청일</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>김건우네 집</td>
                                    <td>우리집 경기도 남양주 481-7</td>
                                    <td>김건우</td>
                                    <td>010-7126-8047</td>
                                    <td>2024-07-30</td>
                                </tr>
                                <tr>
                                    <td>석진이형 롯데캐슬 72번째 방</td>
                                    <td>우리집은 엄청 크고 으리으리하다 347-1</td>
                                    <td>이석진</td>
                                    <td>010-4491-6181</td>
                                    <td>2024-07-27</td>
                                </tr>
                                <tr>
                                    <td>건우집 2</td>
                                    <td>우리집 경기도 서울 보다 집값 낮음 181-12</td>
                                    <td>김건우</td>
                                    <td>010-7126-8047</td>
                                    <td>2024-07-25</td>
                                </tr>
                                <tr>
                                    <td>석진이형 Room-3</td>
                                    <td>주소 할거 떨어졌다 석진이형 집 롯데캐슬 80-1</td>
                                    <td>김건우</td>
                                    <td>010-7126-8047</td>
                                    <td>2024-06-07</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminMain;