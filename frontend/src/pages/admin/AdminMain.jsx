import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../utils/axiosConfig';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip, Legend } from 'recharts';
import { PieChart, Pie } from 'recharts';
import '../../styles/pages/admin/AdminMain.css';
import { FaAngleUp, FaAngleDown } from "react-icons/fa";
import { LuLogOut } from "react-icons/lu";
import { removeTokens } from '../../utils/auth';

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
};

const formatNumber = (number) => {
    return number.toLocaleString('ko-KR');
};

const AdminMain = () => {
    const [accumulate, setAccumulate] = useState(null);
    const [ageGroup, setAgeGroup] = useState([]);
    const [sidoGroup, setSidoGroup] = useState(null);
    const navigate = useNavigate();

    const handleLogout = () => {
        removeTokens();
        navigate('/admin/login', { replace: true });
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const resAccumulate = await axios.get('http://localhost:8080/admin/accumulate');
                setAccumulate(resAccumulate.data);

                const resAgeGroup = await axios.get('http://localhost:8080/admin/agegroup');
                const ageOrder = ['-10대', '20대', '30대', '40대', '50대', '60대', '70대+'];
                const initialData = ageOrder.map(ageGroup => ({
                    ageGroup,
                    M: '0.00',
                    W: '0.00'
                }));
                const ageGroupMap = resAgeGroup.data.reduce((sum, item) => sum + item.COUNT, 0);
                const formattedAgeGroup = resAgeGroup.data.reduce((acc, item) => {
                    const ageGroup = item.AGEGROUP;
                    const gender = item.GENDER;
                    const percentage = (item.COUNT / ageGroupMap * 100).toFixed(2);
                    const existing = acc.find(data => data.ageGroup === ageGroup);
                    if (existing) {
                        existing[gender] = percentage;
                    }
                    return acc;
                }, initialData);
                formattedAgeGroup.sort((a, b) => ageOrder.indexOf(a.ageGroup) - ageOrder.indexOf(b.ageGroup));
                setAgeGroup(formattedAgeGroup);

                const resSidoGroup = await axios.get("http://localhost:8080/admin/sidogroup");
                const totalOffices = resSidoGroup.data.reduce((sum, item) => sum + item.OFFICE_COUNT, 0);
                const formattedSidoGroup = resSidoGroup.data.map(item => ({
                    name: item.SIDO,
                    value: parseFloat((item.OFFICE_COUNT / totalOffices * 100).toFixed(2)),
                }));
                setSidoGroup(formattedSidoGroup);
                console.log(formattedSidoGroup);
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    }, []);

    if (!accumulate || !ageGroup || !sidoGroup) return <>test</>;

    const salesData = [
        { name: '1월', value: 5984 },
        { name: '2월', value: 7894 },
        { name: '3월', value: 4185 },
        { name: '4월', value: 1514 },
        { name: '5월', value: 5194 },
        { name: '6월', value: 9519 },
        { name: '7월', value: 7997 },
        { name: '8월', value: 6198 },
        { name: '9월', value: 8464 },
        { name: '10월', value: 8974 },
        { name: '11월', value: 9484 },
        { name: '12월', value: 7881 },
    ];

    const COLORS = [
        '#0088FE',
        '#00C49F',
        '#FFBB28',
        '#FF8042',
        '#A8D8EA',
        '#D6A4A4',
        '#6C5B7B',
        '#B4D455',
        '#C71585',
        '#FF6347',
        '#4682B4',
        '#32CD32',
        '#FFD700',
        '#FF4500',
        '#D3D3D3',
        '#FF69B4',
        '#8A2BE2'
    ];

    return (
        <div className="admin-main-container">
            <div className="header">
                <div className="logo">OFFICE24</div>
                <input type="text" placeholder="Search" className="search-input" />
                <div className="logout" onClick={handleLogout}>
                    <LuLogOut />
                    <span>로그아웃</span>
                </div>
            </div>
            <nav className="sidebar">
                <ul>
                    <li className="active">대시보드</li>
                    <li>멤버</li>
                    <li>매니저</li>
                    <li>오피스</li>
                    <li>리뷰</li>
                    <li>신고</li>
                </ul>
            </nav>
            <div className="main">
                <div className="stats-grid">
                    <div className="stat-card">
                        <h3>누적 이용자 수</h3>
                        <p className="stat-value">{formatNumber(accumulate.TODAY_MEMBER_CREATE)}명</p>
                        <span className={`stat-change ${calculateChange(accumulate.TODAY_MEMBER_CREATE, accumulate.YESTERDAY_MEMBER_CREATE).className}`}>
                            {calculateChange(accumulate.TODAY_MEMBER_CREATE, accumulate.YESTERDAY_MEMBER_CREATE).className === 'positive' ? <FaAngleUp /> :
                                (calculateChange(accumulate.TODAY_MEMBER_CREATE, accumulate.YESTERDAY_MEMBER_CREATE).className === 'negative' ? <FaAngleDown /> : null)}
                            {calculateChange(accumulate.TODAY_MEMBER_CREATE, accumulate.YESTERDAY_MEMBER_CREATE).change}
                        </span>
                    </div>
                    <div className="stat-card">
                        <h3>누적 매니저 수</h3>
                        <p className="stat-value">{formatNumber(accumulate.TODAY_MANAGER_CREATE)}명</p>
                        <span className={`stat-change ${calculateChange(accumulate.TODAY_MANAGER_CREATE, accumulate.YESTERDAY_MANAGER_CREATE).className}`}>
                            {calculateChange(accumulate.TODAY_MANAGER_CREATE, accumulate.YESTERDAY_MANAGER_CREATE).className === 'positive' ? <FaAngleUp /> :
                                (calculateChange(accumulate.TODAY_MANAGER_CREATE, accumulate.YESTERDAY_MANAGER_CREATE).className === 'negative' ? <FaAngleDown /> : null)}
                            {calculateChange(accumulate.TODAY_MANAGER_CREATE, accumulate.YESTERDAY_MANAGER_CREATE).change}
                        </span>
                    </div>
                    <div className="stat-card">
                        <h3>누적 오피스 수</h3>
                        <p className="stat-value">{formatNumber(accumulate.TODAY_OFFICE_CREATE)}개</p>
                        <span className={`stat-change ${calculateChange(accumulate.TODAY_OFFICE_CREATE, accumulate.YESTERDAY_OFFICE_CREATE).className}`}>
                            {calculateChange(accumulate.TODAY_OFFICE_CREATE, accumulate.YESTERDAY_OFFICE_CREATE).className === 'positive' ? <FaAngleUp /> :
                                (calculateChange(accumulate.TODAY_OFFICE_CREATE, accumulate.YESTERDAY_OFFICE_CREATE).className === 'negative' ? <FaAngleDown /> : null)}
                            {calculateChange(accumulate.TODAY_OFFICE_CREATE, accumulate.YESTERDAY_OFFICE_CREATE).change}
                        </span>
                    </div>
                    <div className="stat-card">
                        <h3>누적 거래 금액</h3>
                        <p className="stat-value">{formatAmount(accumulate.TODAY_TOTAL_AMOUNT)}</p>
                        <span className={`stat-change ${calculateChange(accumulate.TODAY_TOTAL_AMOUNT, accumulate.YESTERDAY_TOTAL_AMOUNT).className}`}>
                            {calculateChange(accumulate.TODAY_TOTAL_AMOUNT, accumulate.YESTERDAY_TOTAL_AMOUNT).className === 'positive' ? <FaAngleUp /> :
                                (calculateChange(accumulate.TODAY_TOTAL_AMOUNT, accumulate.YESTERDAY_TOTAL_AMOUNT).className === 'negative' ? <FaAngleDown /> : null)}
                            {calculateChange(accumulate.TODAY_TOTAL_AMOUNT, accumulate.YESTERDAY_TOTAL_AMOUNT).change}
                        </span>
                    </div>
                    <div className="stat-card">
                        <h3>누적 예약 건수</h3>
                        <p className="stat-value">{formatNumber(accumulate.TODAY_BOOKING_CREATE)}건</p>
                        <span className={`stat-change ${calculateChange(accumulate.TODAY_BOOKING_CREATE, accumulate.YESTERDAY_BOOKING_CREATE).className}`}>
                            {calculateChange(accumulate.TODAY_BOOKING_CREATE, accumulate.YESTERDAY_BOOKING_CREATE).className === 'positive' ? <FaAngleUp /> :
                                (calculateChange(accumulate.TODAY_BOOKING_CREATE, accumulate.YESTERDAY_BOOKING_CREATE).className === 'negative' ? <FaAngleDown /> : null)}
                            {calculateChange(accumulate.TODAY_BOOKING_CREATE, accumulate.YESTERDAY_BOOKING_CREATE).change}
                        </span>
                    </div>
                    <div className="stat-card">
                        <h3>누적 리뷰 수</h3>
                        <p className="stat-value">{formatNumber(accumulate.TODAY_REVIEW_CREATE)}개</p>
                        <span className={`stat-change ${calculateChange(accumulate.TODAY_REVIEW_CREATE, accumulate.YESTERDAY_REVIEW_CREATE).className}`}>
                            {calculateChange(accumulate.TODAY_REVIEW_CREATE, accumulate.YESTERDAY_REVIEW_CREATE).className === 'positive' ? <FaAngleUp /> :
                                (calculateChange(accumulate.TODAY_REVIEW_CREATE, accumulate.YESTERDAY_REVIEW_CREATE).className === 'negative' ? <FaAngleDown /> : null)}
                            {calculateChange(accumulate.TODAY_REVIEW_CREATE, accumulate.YESTERDAY_REVIEW_CREATE).change}
                        </span>
                    </div>
                </div>
                <div className="charts-container">
                    <div className="chart-card sales-chart">
                        <div className="chart-header">
                            <h3>추이</h3>
                            <select>
                                <option>이용자</option>
                                <option>오피스</option>
                                <option>예약</option>
                                <option>매출</option>
                                <option>리뷰</option>
                            </select>
                        </div>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={salesData} margin={{ top: 20, right: 20, left: 20, bottom: 5 }}>
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar
                                    dataKey="value"
                                    fill="#8884d8"
                                    animationDuration={1000}
                                    animationEasing="ease-out"
                                    barSize={30}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="chart-card traffic-chart">
                        <h3>오피스 지역 분포</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={sidoGroup}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={90}
                                    innerRadius={70}
                                    fill="#8884d8"
                                    dataKey="value"
                                    label={({ value }) => `${value}%`}
                                    animationDuration={1000}
                                    animationEasing="ease-out"
                                >
                                    {sidoGroup.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
                                <XAxis type="number" domain={[0, 'dataMax' > 50 ? 100 : 50]} />
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
                            <li><span>4,252건</span></li>
                            <li><span>3,481건</span></li>
                            <li><span>3,172건</span></li>
                            <li><span>2,791건</span></li>
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