import { useState, useEffect } from 'react';
import axios from '../../utils/axiosConfig';
import Header from '../../components/admin/AdminHeader';
import Sidebar from '../../components/admin/AdminSidebar';
import Pagination from '../../components/admin/AdminPagination';
import AdminSearch from '../../components/admin/AdminSearch';
import AdminTable from '../../components/admin/AdminTable';

const AdminReundList = () => {
    const [refund, setRefund] = useState([]);
    const [pageCount, setPageCount] = useState(1);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageDataCache, setPageDataCache] = useState({});
    const [f, setF] = useState('NO');
    const [q, setQ] = useState('');

    useEffect(() => {
        fetchrefund(1);
    }, []);

    const fetchrefund = async (page) => {
        if (pageDataCache[`${f}_${q}_${page}`]) {
            setRefund(pageDataCache[`${f}_${q}_${page}`]);
            return;
        }

        const response = await axios.get(`/admin/refund`, {
            params: {
                page, size: 30, f, q
            }
        });

        const { refunds: fetchedrefund, totalCount } = response.data;

        setPageDataCache(prevCache => ({
            ...prevCache,
            [`${f}_${q}_${page}`]: fetchedrefund
        }));

        setRefund(fetchedrefund);
        setPageCount(Math.ceil(totalCount / 30));
    };

    const handlePageClick = (selectedItem) => {
        const newPage = selectedItem.selected + 1;
        setCurrentPage(selectedItem.selected);
        fetchrefund(newPage);
    };

    const handleSearch = () => {
        setCurrentPage(0);
        setPageDataCache({});
        fetchrefund(1);
    };

    const columns = [
        { header: '번호', accessor: 'NO' },
        { header: '오피스번호', accessor: 'OFFICE_NO' },
        { header: '이용자번호', accessor: 'MEMBER_NO' },
        { header: '예약자', accessor: 'NAME' },
        { header: '예약자연락처', accessor: 'PHONE' },
        { header: '결제금액', accessor: 'PRICE' },
        { header: '환불액', accessor: 'REFUND_AMOUNT' },
        { header: '결제수단', accessor: 'PAYMENT' },
        { header: '예약 시작일', accessor: 'START_DATE' },
        { header: '예약 종료일', accessor: 'END_DATE' },
        { header: '결제일', accessor: 'BOOKING_DATE' },
        { header: '결제취소일', accessor: 'REG_DATE' }
    ];

    const options = [
        { value: 'NO', label: '번호' },
        { value: 'NAME', label: '예약자명' },
        { value: 'OFFICE_NO', label: '오피스번호' },
        { value: 'MEMBER_NO', label: '이용자번호' },
    ];

    const formattedrefunds = refund.map(item => ({
        ...item,
        PRICE: `${item.PRICE.toLocaleString('ko-KR')}원`,
        REFUND_AMOUNT: `${item.REFUND_AMOUNT.toLocaleString('ko-KR')}원`,
        START_DATE: new Date(item.START_DATE).toISOString().split('T')[0],
        END_DATE: new Date(item.END_DATE).toISOString().split('T')[0],
        BOOKING_DATE: new Date(item.BOOKING_DATE).toISOString().split('T')[0],
        REG_DATE: new Date(item.REG_DATE).toISOString().split('T')[0]
    }));

    return (
        <div className="admin-main">
            <Header />
            <Sidebar />
            <div className='main'>
                <AdminSearch f={f} setF={setF} q={q} setQ={setQ} onSearch={handleSearch} options={options} />
                <AdminTable columns={columns} data={formattedrefunds} onRowClick={() => { }} />
                <Pagination pageCount={pageCount} handlePageClick={handlePageClick} currentPage={currentPage} />
            </div>
        </div>
    );
};

export default AdminReundList;
