import { useEffect, useState } from "react";
import axios from "../../utils/axiosConfig";
import ManagerHeader from "../../components/manager/ManagerHeader";
import ManagerSidebar from "../../components/manager/ManagerSidebar";
import { getNo } from "../../utils/auth";
import ReactPaginate from "react-paginate";
import '../../styles/pages/manager/ManagerRefund.css';

const ManagerRefund = () => {
  const no = getNo();
  const [refunds, setRefunds] = useState([]);
  const [pageCount, setPageCount] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);

  const formatPhoneNumber = (phoneNumber) => {
    if (phoneNumber.length === 11) {
      return phoneNumber.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
    }
    return phoneNumber;
  };

  useEffect(() => {
    const fetchRefunds = async (page) => {
      try {
        const response = await axios.get(`/manager/${no}/refund`, {
          params: {
            page: page + 1,
            size: pageSize,
          },
        });
        setRefunds(response.data.refunds);
        setPageCount(response.data.totalPages);
      } catch (error) {
        console.error("Error fetching refund data:", error);
      }
    };

    fetchRefunds(currentPage);
  }, [currentPage, no, pageSize]);

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  return (
    <>
      <ManagerSidebar />
      <ManagerHeader />
      <div className="managerRefund-container">
        <div className="headernav">
          <ul>
            <li>예약 환불 내역</li>
          </ul>
        </div>
        <div className="refundList">
          <table>
            <thead>
              <tr>
                <th>예약 No.</th>
                <th>오피스명</th>
                <th>예약자명</th>
                <th>연락처</th>
                <th>결제액</th>
                <th>환불액</th>
                <th>결제수단</th>
                <th>예약일</th>
                <th>환불일</th>
              </tr>
            </thead>
            <tbody>
              {refunds.length > 0 ? (
                refunds.map((refund) => (
                  <tr key={refund.REFUNDNO}>
                    <td>{refund.REFUNDNO}</td>
                    <td>{refund.OFFICETITLE}</td>
                    <td>{refund.MEMBERNAME}</td>
                    <td>{formatPhoneNumber(refund.MEMBERPHONE)}</td>
                    <td>{refund.PRICE.toLocaleString()} 원</td>
                    <td>{refund.REFUNDAMOUNT.toLocaleString()} 원</td>
                    <td>{refund.PAYMENT}</td>
                    <td>{new Date(refund.BOOKINGDATE).toLocaleDateString()}</td>
                    <td>{new Date(refund.REFUNDDATE).toLocaleDateString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" style={{ textAlign: "center" }}>
                    환불 내역이 없습니다
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <ReactPaginate
            previousLabel={"이전"}
            nextLabel={"다음"}
            breakLabel={"..."}
            breakClassName={"break-me"}
            pageCount={pageCount}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={handlePageClick}
            containerClassName={"pagination"}
            activeClassName={"active"}
            forcePage={currentPage}
          />
        </div>
      </div>
    </>
  );
}

export default ManagerRefund;
