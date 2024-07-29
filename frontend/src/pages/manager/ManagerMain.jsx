import React, { useEffect, useState } from 'react';
import axios from '../../utils/axiosConfig';
import { useParams } from 'react-router-dom';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend } from 'recharts';
import ManagerSidebar from '../../components/manager/ManagerSidebar';
import ManagerHeader from '../../components/manager/ManagerHeader';
import { LuBarChart3, LuStar } from "react-icons/lu";
import { FaWonSign } from "react-icons/fa6";
import ReactPaginate from 'react-paginate';
import '../../styles/pages/manager/ManagerMain.css';

const COLORS = ['#57C9A6', '#CB6E59'];

const ManagerMain = () => {
  const { no } = useParams();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [monthlyData, setMonthlyData] = useState([]);
  const [genderData, setGenderData] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    document.body.classList.add('manager-main-body');
    return () => {
      document.body.classList.remove('manager-main-body');
    };
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get(`/manager/office/stats/${no}`);
      const serverData = response.data;

      const monthlyRevenue = serverData.monthlyRevenue.map(item => ({
        month: `${item.MONTH}월`,
        revenue: item.MONTHLY_REVENUE,
      }));

      const genderRatio = serverData.genderRatio.map(item => ({
        name: item.GENDER === 'M' ? '남성' : '여성',
        value: item.COUNT,
      }));

      setStats(serverData);
      setMonthlyData(monthlyRevenue);
      setGenderData(genderRatio);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const fetchBookings = async (selectedPage) => {
    try {
      const response = await axios.get(`/manager/booking/${no}`, {
        params: {
          page: selectedPage + 1,
          size: 5,
        },
      });

      const bookData = response.data.bookings.map(booking => ({
        ...booking,
        BOOKING_DATE: new Date(booking.BOOKING_DATE).toLocaleDateString(),
        START_DATE: new Date(booking.START_DATE).toLocaleDateString(),
        END_DATE: new Date(booking.END_DATE).toLocaleDateString()
      }));

      setBookings(bookData);
      setPageCount(response.data.totalPages);
      setCurrentPage(selectedPage);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchBookings(0);
  }, [no]);

  const handlePageClick = (data) => {
    const selectedPage = data.selected;
    fetchBookings(selectedPage);
  };

  // if (loading) {
  //   return <div>loading...</div>;
  // }
  if (!stats) {
    return <div>Error loading data.</div>;
  }

  return (
    <>
      <ManagerSidebar title={'office24'} firstChild={'대쉬보드'} secondChild={'오피스'}
        thirdChild={'예약 관리'} fourthChild={'통계'} fifthChild={'정보수정'} />
      <ManagerHeader />
      <div className="main-content">
        <div className="dashboard">
          <div className='mini-container'>
            <div className='mini-stats'>
              <div>
                <p>누적 수익</p>
              </div>
              <div className='statcontent'>
                <span>{stats.totalRevenue}</span>&nbsp;<FaWonSign size={12} color='#4171DD' />
              </div>
            </div>
            <div className='mini-stats'>
              <div>
                <p>누적 이용자</p>
              </div>
              <div className='statcontent'>
                <span>{stats.totalUsage}</span>&nbsp;🤦
              </div>
            </div>
            <div className='mini-stats'>
              <div>
                <p>총 평점</p>
              </div>
              <div className='statcontent'>
                <span>{stats.totalRating}</span>&nbsp;<LuStar color='#57C9A6' />
              </div>
            </div>
            <div className='mini-stats'>
              <div>
                <p>이용 중</p>
              </div>
              <div className='statcontent'>
                <span>{stats.totalActive}</span>&nbsp;<LuBarChart3 color='#f1b85b' />
              </div>
            </div>
          </div>
          <div className="statistics">
            <div className="chart-container">
              <h4>매출</h4><br />
              <ResponsiveContainer width="100%" height={230}>
                <BarChart data={monthlyData} margin={{ top:10, left: 0, right: 20 }}>
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} tickLine={false} />
                  <YAxis tick={{ fontSize: 11 }} tickLine={false} />
                  <Tooltip contentStyle={{ fontSize: 12 }} />
                  <Bar dataKey="revenue" fill="#4171DD" barSize={11}
                    animationDuration={1000} animationEasing="ease-out" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className='booking'>
              <h4>이용자 성비</h4><br />
              <ResponsiveContainer width="100%" height={250} margin={{ top: 0, right: 0, bottom: 0, left: 0 }} >
                <PieChart>
                  <Pie
                    data={genderData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    innerRadius={80}
                    fill="#8884d8"
                    label
                  >
                    {genderData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className='bottom-content'>
            <div className='info'>
              <h4>내 정보</h4>
            </div>
            <div className="reserve">
            <h4>예약 내역</h4>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>예약 번호</th>
                    <th>예약일</th>
                    <th>예약자명</th>
                    <th>예약자 전화번호</th>
                    <th>예약기간</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking.BOOKING_NO}>
                      <td>{booking.BOOKING_NO}</td>
                      <td>{booking.BOOKING_DATE}</td>
                      <td>{booking.BOOKING_NAME}</td>
                      <td>{booking.BOOKING_PHONE.trim()}</td> {/* 공백 제거 */}
                      <td>{booking.START_DATE} ~ {booking.END_DATE}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <ReactPaginate
                previousLabel={'previous'}
                nextLabel={'next'}
                breakLabel={'...'}
                breakClassName={'break-me'}
                pageCount={pageCount}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={handlePageClick}
                containerClassName={'pagination'}
                subContainerClassName={'pages pagination'}
                activeClassName={'active'}
              />
            </div>
          </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ManagerMain;
