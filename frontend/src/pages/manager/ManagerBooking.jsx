import ManagerHeader from "../../components/manager/ManagerHeader";
import ManagerSidebar from "../../components/manager/ManagerSidebar";
import { useParams } from 'react-router-dom';
import { useEffect, useState, useCallback } from 'react';
import axios from '../../utils/axiosConfig';
import ReactPaginate from 'react-paginate';
import '../../styles/pages/manager/ManagerBooking.css'

const ManagerBooking = () => {
  const { no } = useParams();
  const [bookings, setBookings] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [filter, setFilter] = useState('recent');

  // 서버에서 받은 데이터를 변환하는 함수
  const normalizeBookingData = (data) => {
    return data.map(booking => ({
      bookingNo: booking.BOOKING_NO,
      officeName: booking.OFFICE_NAME,
      customerName: booking.CUSTOMER_NAME,
      paymentAmount: booking.PAYMENT_AMOUNT,
      paymentMethod: booking.PAYMENT_METHOD,
      startDate: booking.START_DATE,
      endDate: booking.END_DATE
    }));
  };

  const fetchBookings = useCallback(async (page) => {
    try {
      const response = await axios.get(`/manager/booking/${no}`, {
        params: {
          page: page,
          size: 10,
          filter: filter,
          searchText: searchText
        },
        withCredentials: true
      });
      setBookings(normalizeBookingData(response.data.bookings));
      setPageCount(Math.ceil(response.data.totalPages));
      setCurrentPage(page - 1);
    } catch (error) {
      console.error("예약 정보를 가져오는 중 오류 발생:", error);
    }
  }, [no, filter, searchText]);

  useEffect(() => {
    fetchBookings(1);
  }, [no, filter, searchText, fetchBookings]);

  useEffect(() => {
    document.body.classList.add('manager-booking-body');
    return () => {
      document.body.classList.remove('manager-booking-body');
    };
  }, []);

  const handlePageClick = (data) => {
    const selectedPage = data.selected + 1;
    fetchBookings(selectedPage);
  };

  const handleTabClick = (filterStatus) => {
    setFilter(filterStatus);
  };

  const handleSearchInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleSearch = () => {
    setSearchText(searchInput);
  };

  const handleDeleteClick = async (bookingNo) => {
    const confirmed = window.confirm("정말 이 예약을 삭제하시겠습니까?");

    if (!confirmed) {
      return;
    }

    try {
      await axios.delete(`/manager/booking/delete/${bookingNo}`, { withCredentials: true });
      alert("예약이 성공적으로 삭제되었습니다.");
      fetchBookings(currentPage + 1);
    } catch (error) {
      console.error("예약 삭제 중 오류 발생:", error);
      alert("예약 삭제 중 오류가 발생했습니다.");
    }
  };

  return (
    <>
      <ManagerSidebar />
      <ManagerHeader />
      <div className='managerBooking-container'>
        <div className='headernav'>
          <ul>
            <li className={filter === 'recent' ? 'active' : ''} onClick={() => handleTabClick('recent')}>최근 예약</li>
            <li className={filter === 'past' ? 'active' : ''} onClick={() => handleTabClick('past')}>지난 예약</li>
          </ul>
        </div>
        <div className='headersearch'>
          <div className='search'>
            <input
              type="text"
              value={searchInput}
              onChange={handleSearchInputChange}
              placeholder="오피스명 또는 예약자명으로 검색"
            />
            <button onClick={handleSearch}>검색</button>
          </div>
        </div>
        <div className='bookingList'>
          <table>
            <thead>
              <tr>
                <th>No.</th>
                <th>오피스명</th>
                <th>예약자명</th>
                <th>결제금액</th>
                <th>지불방법</th>
                <th>예약기간</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {bookings.length > 0 ? (
                bookings.map((booking) => (
                  <tr key={booking.bookingNo}>
                    <td>{booking.bookingNo}</td>
                    <td>{booking.officeName}</td>
                    <td>{booking.customerName}</td>
                    <td>{booking.paymentAmount.toLocaleString()}원</td>
                    <td>{booking.paymentMethod}</td>
                    <td>{new Date(booking.startDate).toLocaleDateString()} ~ {new Date(booking.endDate).toLocaleDateString()}</td>
                    <td>
                      <button onClick={() => handleDeleteClick(booking.bookingNo)}>삭제</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center' }}>검색 결과가 없습니다</td>
                </tr>
              )}
            </tbody>
          </table>
          <ReactPaginate
            previousLabel={'이전'}
            nextLabel={'다음'}
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
    </>
  );
}
export default ManagerBooking;
