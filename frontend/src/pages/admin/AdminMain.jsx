import React, { useEffect, useState } from 'react';
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip, Legend, Line, ComposedChart } from 'recharts';
import '../../styles/pages/admin/AdminMain.css';

import Header from '../../components/admin/AdminHeader';
import Sidebar from '../../components/admin/AdminSidebar';
import StatCard from '../../components/admin/AdminStatCard';
import { fetchAccumulate, fetchAgeGroup, fetchSidoGroup, fetchGroupData, fetchNotAvailabilityOffice, fetchNotices } from '../../services/admin/AdminMain';

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

    const [notAvailabilityOffices, setNotAvailabilityOffices] = useState({});
    const [fetchedOfficePages, setfetchedOfficePages] = useState(new Set());
    const [officePage, setOfficePage] = useState(1);

    const [notices, setNotices] = useState([]);
    const [fetchedNoticePages, setfetchedNoticePages] = useState(new Set());
    const [noticePage, setNoticePage] = useState(1);



    useEffect(() => {
        const fetchData = async () => {
            await fetchAccumulate(setAccumulate);
            await fetchAgeGroup(setAgeGroup);
            await fetchSidoGroup(setSidoGroup);
            await fetchGroupData(memberGroup, setMemberGroup, 'membergroup');
        };
        fetchData();
    }, []);

    useEffect(() => {
        const fetchOfficePageData = async () => {
            await fetchNotAvailabilityOffice(officePage, setNotAvailabilityOffices, fetchedOfficePages, setfetchedOfficePages);
        };
        fetchOfficePageData();
    }, [officePage, fetchedOfficePages]);

    useEffect(() => {
        const fetchNoticePageData = async () => {
            await fetchNotices(noticePage, setNotices, fetchedNoticePages, setfetchedNoticePages);
        };
        fetchNoticePageData();
    }, [noticePage, fetchedNoticePages]);

    const currentOffices = notAvailabilityOffices[officePage] || [];
    const officeHasMore = currentOffices.length === 5;

    const currentNotices = notices[noticePage] || [];
    const noticeHasMore = currentNotices.length === 5;

    const handleofficePageChange = (newOfficePage) => {
        setOfficePage(newOfficePage);
    };

    const handleNoticePageChange = (newNoticePage) => {
        setNoticePage(newNoticePage);
    };

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
        <div className="admin-main">
            <Header />
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
                <div className="charts">
                    <div className="chart-card sales-chart">
                        <div className="chart-header">
                            <h3>{groupName}</h3>
                            <select className='chart-change' onChange={selectChart}>
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
                                <YAxis yAxisId="right" orientation="right" tickFormatter={(value) => value.toLocaleString('ko-KR')} />
                                <Tooltip formatter={(value) => value.toLocaleString('ko-KR')} />
                                <Legend />
                                <Bar yAxisId="left" dataKey={chartLabels.label1} fill="#3cb371" barSize={20} />
                                <Bar yAxisId="left" dataKey={chartLabels.label2} fill="#db4455" barSize={20} />
                                <Line yAxisId="right" type="monotone" dataKey={chartLabels.label3} stroke="#ffa550" dot={false} />
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
                                <Legend />
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
                    <div className="notices">
                        <h3>공지사항</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th>제목</th>
                                    <th>게시일</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentNotices.length > 0 ? (
                                    currentNotices.map((notice, index) => (
                                        <tr key={notice.NO || `${noticePage}-${index}`}>
                                            <td>{notice.TITLE}</td>
                                            <td>{new Date(notice.REG_DATE).toISOString().split('T')[0]}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="2" className="nodata">데이터가 존재하지 않습니다.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        <div className='page-buttons'>
                            <button onClick={() => handleNoticePageChange(noticePage - 1)} disabled={noticePage === 1}>이전</button>
                            <button onClick={() => handleNoticePageChange(noticePage + 1)} disabled={!noticeHasMore}>다음</button>
                        </div>
                    </div>
                    <div className="offices">
                        <h3>승인 대기 오피스</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th>오피스 이름</th>
                                    <th>신청인</th>
                                    <th>주소</th>
                                    <th>가격</th>
                                    <th>등록일</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentOffices.length > 0 ? (
                                    currentOffices.map((office, index) => (
                                        <tr key={office.no || `${officePage}-${index}`}>
                                            <td>{office.title}</td>
                                            <td>{office.managerName}</td>
                                            <td>{office.address}</td>
                                            <td>{office.price.toLocaleString()}원</td>
                                            <td>{new Date(office.reg_date).toISOString().split('T')[0]}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="nodata">데이터가 존재하지 않습니다.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        <div className='page-buttons'>
                            <button onClick={() => handleofficePageChange(officePage - 1)} disabled={officePage === 1}>이전</button>
                            <button onClick={() => handleofficePageChange(officePage + 1)} disabled={!officeHasMore}>다음</button>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default AdminMain;