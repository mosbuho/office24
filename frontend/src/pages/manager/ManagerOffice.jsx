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
  const [pageCount, setPageCount] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageDataCache, setPageDataCache] = useState({});
  const [searchInput, setSearchInput] = useState('');
  const [availability, setAvailability] = useState('all');

  const fetchOffices = async (page) => {
    const cacheKey = `${availability}_${searchInput}_${page}`;

    if (pageDataCache[cacheKey]) {
      setOffices(pageDataCache[cacheKey].offices);
      setPageCount(pageDataCache[cacheKey].pageCount);
      setCurrentPage(page - 1);
      return;
    }

    try {
      const response = await axios.get(`/manager/office/${no}`, {
        params: {
          page,
          size: 10,
          availability: availability === 'all' ? null : availability,
          searchText: searchInput 
        },
        withCredentials: true
      });

      const fetchedOffices = response.data.offices;
      const totalPages = Math.ceil(response.data.total / 10);

      setPageDataCache(prevCache => ({
        ...prevCache,
        [cacheKey]: { offices: fetchedOffices, pageCount: totalPages }
      }));

      setOffices(fetchedOffices);
      setPageCount(totalPages);
      setCurrentPage(page - 1);
    } catch (error) {
      console.error("오피스 정보를 가져오는 중 오류 발생:", error);
    }
  };

  useEffect(() => {
    fetchOffices(1);
  }, [availability]);

  const handlePageClick = (data) => {
    const selectedPage = data.selected + 1;
    setCurrentPage(selectedPage - 1);
    fetchOffices(selectedPage);
  };

  const handleSearch = () => {
    setCurrentPage(0);
    setPageDataCache({});
    fetchOffices(1);
  };

  const handleTabClick = (availabilityStatus) => {
    setAvailability(availabilityStatus);
    setCurrentPage(0);
    setPageDataCache({});
    fetchOffices(1);
  };

  const handleSearchInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleRegisterClick = () => {
    navigate(`/manager/office/register/${no}`);
  };

  const handleUpdateClick = (officeNo) => {
    navigate(`/manager/office/update/${no}/${officeNo}`);
  };

  const handleDeleteClick = async (officeNo) => {
    const confirmed = window.confirm("정말 이 오피스를 삭제하시겠습니까?");

    if (!confirmed) {
      return;
    }

    try {
      await axios.delete(`/manager/office/${officeNo}`, { withCredentials: true });
      alert("오피스가 성공적으로 삭제되었습니다.");
      setPageDataCache({});
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
            <li className={availability === '2' ? 'active' : ''} onClick={() => handleTabClick('2')}>미승인</li>
          </ul>
        </div>
        <div className='headersearch'>
          <div className='search'>
            <input
              type="text"
              value={searchInput}
              onChange={handleSearchInputChange}
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
                <th>수용인원</th>
                <th>가격(일)</th>
                <th>상태</th>
                <th>등록일</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {offices.length > 0 ? (
                offices.map((office) => (
                  <tr key={office.no}>
                    <td>{office.no}</td>
                    <td>{office.title}</td>
                    <td>{office.address}</td>
                    <td>{office.capacity}</td>
                    <td>{office.price.toLocaleString()}원</td>
                    <td>
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
                            : '거절됨'
                        }
                      </span>
                    </td>
                    <td>{new Date(office.reg_date).toLocaleDateString()}</td>
                    <td>
                      <button onClick={() => handleUpdateClick(office.no)}>수정</button>
                      <button onClick={() => handleDeleteClick(office.no)}>삭제</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center' }}>검색 결과가 없습니다</td>
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
            forcePage={currentPage}
          />
        </div>
      </div>
    </>
  );
};

export default ManagerOffice;
