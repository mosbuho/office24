import ManagerSidebar from '../../components/manager/ManagerSidebar';
import ManagerHeader from "../../components/manager/ManagerHeader";
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState, useCallback } from 'react';
import axios from '../../utils/axiosConfig';
import ReactPaginate from 'react-paginate';
import '../../styles/pages/manager/ManagerOffice.css';

const ManagerOffice = () => {
  const { no } = useParams();
  const navigate = useNavigate();
  const [offices, setOffices] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [availability, setAvailability] = useState('all');

  const fetchOffices = useCallback(async (page) => {
    try {
      const response = await axios.get(`/manager/office/${no}`, {
        params: {
          page: page,
          size: 10,
          availability: availability === 'all' ? null : availability,
          searchText: searchText
        },
        withCredentials: true
      });
      setOffices(response.data.offices);
      setPageCount(Math.ceil(response.data.total / 10));
      setCurrentPage(page - 1);
    } catch (error) {
      console.error("오피스 정보를 가져오는 중 오류 발생:", error);
    }
  }, [no, availability, searchText]);

  useEffect(() => {
    fetchOffices(1);
  }, [no, availability, fetchOffices]);

  useEffect(() => {
    document.body.classList.add('manager-office-body');
    return () => {
      document.body.classList.remove('manager-office-body');
    };
  }, []);

  const handlePageClick = (data) => {
    const selectedPage = data.selected + 1;
    fetchOffices(selectedPage);
  };

  const handleTabClick = (availabilityStatus) => {
    setAvailability(availabilityStatus);
  };

  useEffect(() => {
    fetchOffices(1);
  }, [availability]);

  const handleSearch = () => {
    fetchOffices(1);
  };

  const handleRegisterClick = () => {
    navigate(`/manager/office/register/${no}`);
  };

  const handleDeleteClick = async (officeNo) => {
    try {
      await axios.delete(`/manager/office/delete/${officeNo}`, { withCredentials: true });
      alert("오피스가 성공적으로 삭제되었습니다.");
      fetchOffices(currentPage + 1);
    } catch (error) {
      console.error("오피스 삭제 중 오류 발생:", error);
      alert("오피스 삭제 중 오류가 발생했습니다.");
    }
  };

  return (
    <>
      <ManagerSidebar />
      <ManagerHeader />
      <div className='managerOffice-container'>
        <div className='headernav'>
          <ul>
            <li className={availability === 'all' ? 'active' : ''} onClick={() => handleTabClick('all')}>전체</li>
            <li className={availability === '1' ? 'active' : ''} onClick={() => handleTabClick('1')}>서비스 중</li>
            <li className={availability === '0' ? 'active' : ''} onClick={() => handleTabClick('0')}>대기 중</li>
          </ul>
        </div>
        <div className='headersearch'>
          <div className='search'>
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="오피스 이름으로 검색"
            />
            <button onClick={handleSearch}>검색</button>
          </div>
          <button onClick={handleRegisterClick}>신규 등록</button>
        </div>
        <div className='officeList'>
          <table>
            <thead>
              <tr>
                <th>번호</th>
                <th>이름</th>
                <th>주소</th>
                <th>우편번호</th>
                <th>가격</th>
                <th>수용인원</th>
                <th>상태</th>
                <th>등록일</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {offices.map((office) => (
                <tr key={office.no}>
                  <td>{office.no}</td>
                  <td>{office.title}</td>
                  <td>{office.address}</td>
                  <td>{office.zipCode}</td>
                  <td>{office.price}</td>
                  <td>{office.capacity}</td>
                  <td>{office.availability === 1 ? '승인됨' : '대기 중'}</td>
                  <td>{new Date(office.regDate).toLocaleDateString()}</td>
                  <td>
                    <button>수정</button>
                    <button onClick={() => handleDeleteClick(office.no)}>삭제</button>
                  </td>
                </tr>
              ))}
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

export default ManagerOffice;
