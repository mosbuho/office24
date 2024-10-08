import React, { useEffect, useState } from 'react';
import axios from '../../utils/axiosConfig';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend } from 'recharts';
import ManagerSidebar from '../../components/manager/ManagerSidebar';
import ManagerHeader from '../../components/manager/ManagerHeader';
import { LuBarChart3, LuStar } from "react-icons/lu";
import { FaWonSign } from "react-icons/fa6";
import ReactPaginate from 'react-paginate';
import '../../styles/pages/manager/ManagerMain.css';
import { getNo } from '../../utils/auth';

const COLORS = ['#57C9A6', '#EEBD6F'];

const ManagerMain = () => {
  const no = getNo();
  const [stats, setStats] = useState(null);
  const [monthlyData, setMonthlyData] = useState([]);
  const [genderData, setGenderData] = useState([]);
  const [bookings, setBookings] = useState({});
  const [currentPage, setCurrentPage] = useState(0);
  const [bookingPageCount, setBookingPageCount] = useState(0);
  const [offices, setOffices] = useState({});
  const [currentOfficePage, setCurrentOfficePage] = useState(0);
  const [officePageCount, setOfficePageCount] = useState(0);

  useEffect(() => {
    document.body.classList.add('manager-main-body');
    return () => {
      document.body.classList.remove('manager-main-body');
    };
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get(`/manager/${no}/office/stats`);
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

      setOfficePageCount(Math.ceil(serverData.offices.length / 5));
      setOffices({ 0: serverData.offices.slice(0, 5) });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const fetchBookings = async (selectedPage) => {
    if (bookings[selectedPage]) {
      setCurrentPage(selectedPage);
      return;
    }

    try {
      const response = await axios.get(`/manager/${no}/booking/simple`, {
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

      setBookings(prevBookings => ({
        ...prevBookings,
        [selectedPage]: bookData,
      }));
      setCurrentPage(selectedPage);
      setBookingPageCount(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  const fetchOfficeStatus = async (selectedPage) => {
    if (offices[selectedPage]) {
      setCurrentOfficePage(selectedPage);
      return;
    }

    try {
      const response = await axios.get(`/manager/${no}/office/status`, {
        params: {
          page: selectedPage + 1,
          size: 5,
        },
      });

      setOffices(prevOffices => ({
        ...prevOffices,
        [selectedPage]: response.data.offices,
      }));
      setCurrentOfficePage(selectedPage);
      setOfficePageCount(Math.ceil(response.data.total / 5));
    } catch (error) {
      console.error("Error fetching office status:", error);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchBookings(0);
    fetchOfficeStatus(0);
  }, [no]);

  const handleBookingPageClick = (data) => {
    const selectedPage = data.selected;
    fetchBookings(selectedPage);
  };

  const handleOfficePageClick = (data) => {
    const selectedPage = data.selected;
    fetchOfficeStatus(selectedPage);
  };

  if (!stats) {
    return <div>Error loading data.</div>;
  }

  return (
    <>
      <ManagerSidebar />
      <ManagerHeader />
      <div className="managerMain-container">
        <div className="dashboard">
          <div className='mini-container'>
            <div className='mini-stats'>
              <div>
                <p>누적 수익</p>
              </div>
              <div className='statcontent'>
                <span>{stats.totalRevenue.toLocaleString()}</span>&nbsp;<FaWonSign size={12} color='#4171DD' />
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
                <BarChart data={monthlyData} margin={{ top: 0, left: 0, right: 20 }}>
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} tickLine={false} />
                  <YAxis tick={{ fontSize: 11 }} tickLine={false} tickFormatter={(value) => value.toLocaleString()} />
                  <Tooltip contentStyle={{ fontSize: 12 }} formatter={(value) => `${value.toLocaleString()}원`}
                    labelFormatter={() => '월 수익'} />
                  <Bar dataKey="revenue" fill="#4171DD" barSize={9} />
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
                    outerRadius={80}
                    innerRadius={70}
                    fill="#8884d8"
                    label
                  >
                    {genderData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={45} iconSize={1} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className='bottom-content'>
            <div className='info'>
              <h4>오피스 등록 상태</h4>
              <div className='office-status'>
                <ul>
                  {(offices[currentOfficePage] || []).map((office) => (
                    <li key={office.no} className='statusli'>
                      {office.title}
                      <span className={
                        office.availability === 1
                          ? 'approved'
                          : office.availability === 0
                            ? 'pending'
                            : 'rejected'
                      }>
                        {office.availability === 1
                          ? '승인됨'
                          : office.availability === 0
                            ? '대기 중'
                            : '거절됨'}
                      </span>
                    </li>
                  ))}
                </ul>
                <ReactPaginate
                  previousLabel={'이전'}
                  nextLabel={'다음'}
                  breakLabel={'...'}
                  breakClassName={'break-me'}
                  pageCount={officePageCount}
                  marginPagesDisplayed={2}
                  pageRangeDisplayed={3}
                  onPageChange={handleOfficePageClick}
                  containerClassName={'office-pagination'}
                  pageClassName={'pagination-item'}
                  subContainerClassName={'pages pagination'}
                  activeClassName={'active'}
                />
              </div>
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
                    {(bookings[currentPage] || []).map((booking) => (
                      <tr key={booking.BOOKING_NO}>
                        <td>{booking.BOOKING_NO}</td>
                        <td>{booking.BOOKING_DATE}</td>
                        <td>{booking.BOOKING_NAME}</td>
                        <td>{booking.BOOKING_PHONE.trim()}</td>
                        <td>{booking.START_DATE} ~ {booking.END_DATE}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <ReactPaginate
                  previousLabel={'이전'}
                  nextLabel={'다음'}
                  breakLabel={'...'}
                  breakClassName={'break-me'}
                  pageCount={bookingPageCount}
                  marginPagesDisplayed={2}
                  pageRangeDisplayed={5}
                  onPageChange={handleBookingPageClick}
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
