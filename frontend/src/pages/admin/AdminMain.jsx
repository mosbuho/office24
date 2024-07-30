import React from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, CartesianGrid, Tooltip, Legend } from 'recharts';
import { PieChart, Pie } from 'recharts';
import '../../styles/pages/admin/AdminMain.css';
import { FaRegUser } from "react-icons/fa";

const AdminMain = () => {
    const generateRandomData = (labels, total) => {
        let remaining = total;
        const data = labels.map((label, index) => {
            const value = index === labels.length - 1
                ? remaining
                : getRandomValue(1, remaining - (labels.length - index - 1));
            remaining -= value;
            return { name: label, value };
        });
        return data;
    };

    const getRandomValue = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

    const salesData = [
        { name: '1월', value: getRandomValue(2000, 6000) },
        { name: '2월', value: getRandomValue(2000, 6000) },
        { name: '3월', value: getRandomValue(2000, 6000) },
        { name: '4월', value: getRandomValue(2000, 6000) },
        { name: '5월', value: getRandomValue(2000, 6000) },
        { name: '6월', value: getRandomValue(2000, 6000) },
        { name: '7월', value: getRandomValue(2000, 6000) },
        { name: '8월', value: getRandomValue(2000, 6000) },
        { name: '9월', value: getRandomValue(2000, 6000) },
        { name: '10월', value: getRandomValue(2000, 6000) },
        { name: '11월', value: getRandomValue(2000, 6000) },
        { name: '12월', value: getRandomValue(2000, 6000) },
    ];

    const areaLabels = ['서울', '경기', '강원', '경상', '충청', '전라', '제주'];
    const ageLabels = ['10대', '20대', '30대', '40대', '50대', '60대', '70대', '80대', '90대'];
    const genderLabels = ['남성', '여성'];

    const areaData = generateRandomData(areaLabels, 100);
    const ageData = generateRandomData(ageLabels, 100);
    const genderData = generateRandomData(genderLabels, 100);

    const COLORS = [
        '#0088FE',
        '#00C49F',
        '#FFBB28',
        '#FF8042',
        '#A8D8EA',
        '#D6A4A4',
        '#6C5B7B',
        '#B4D455',
        '#C71585'
    ];

    return (
        <div className="admin-main-container">
            <div className="header">
                <div className="logo">OFFICE24</div>
                <input type="text" placeholder="Search" className="search-input" />
                <div className="user-profile">
                    <FaRegUser />
                    <span>admin</span>
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
                        <p className="stat-value">121,144명</p>
                        <span className="stat-change positive">+10%</span>
                    </div>
                    <div className="stat-card">
                        <h3>누적 매니저 수</h3>
                        <p className="stat-value">1,729명</p>
                        <span className="stat-change positive">+8%</span>
                    </div>
                    <div className="stat-card">
                        <h3>누적 오피스 수</h3>
                        <p className="stat-value">6,843개</p>
                        <span className="stat-change negative">-2%</span>
                    </div>
                    <div className="stat-card">
                        <h3>누적 거래 금액</h3>
                        <p className="stat-value">364.1M</p>
                        <span className="stat-change negative">-5%</span>
                    </div>
                    <div className="stat-card">
                        <h3>누적 예약 건수</h3>
                        <p className="stat-value">58,293건</p>
                        <span className="stat-change positive">+3%</span>
                    </div>
                    <div className="stat-card">
                        <h3>누적 리뷰 수</h3>
                        <p className="stat-value">2,584개</p>
                        <span className="stat-change positive">+12%</span>
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
                            <BarChart data={salesData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <XAxis dataKey="name" />
                                <YAxis />
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
                                    data={areaData}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                    label
                                    animationDuration={1000}
                                    animationEasing="ease-out"
                                >
                                    {areaData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="chart-card traffic-chart">
                        <h3>이용자 연령대 및 성별</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart
                                data={ageData}
                                layout="vertical"
                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" />
                                <YAxis type="category" dataKey="name" />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="value" fill="#8884d8" stackId="a" animationDuration={1000} animationEasing="ease-out">
                                    {ageData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                                <Bar dataKey="value" fill="#82ca9d" stackId="b" animationDuration={1000} animationEasing="ease-out">
                                    {genderData.map((entry, index) => (
                                        <Cell key={`cell-gender-${index}`} fill={COLORS[(index + ageData.length) % COLORS.length]} />
                                    ))}
                                </Bar>
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