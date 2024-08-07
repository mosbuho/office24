import { useState, useEffect } from 'react';
import axios from '../../utils/axiosConfig';
import Header from '../../components/admin/AdminHeader';
import Sidebar from '../../components/admin/AdminSidebar';
import Pagination from '../../components/admin/AdminPagination';
import AdminSearch from '../../components/admin/AdminSearch';
import AdminTable from '../../components/admin/AdminTable';
import '../../styles/pages/admin/AdminNoticeList.css';
import { useNavigate } from 'react-router-dom';

const AdminNoticeList = () => {
    const [notice, setNotice] = useState([]);
    const [pageCount, setPageCount] = useState(1);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageDataCache, setPageDataCache] = useState({});
    const [f, setF] = useState('NO');
    const [q, setQ] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        fetchNotice(1);
    }, []);

    const fetchNotice = async (page) => {
        const cacheKey = `${f}_${q}_${page}`;
        if (pageDataCache[cacheKey]) {
            setNotice(pageDataCache[cacheKey]);
            return;
        }

        const response = await axios.get('/admin/notice', {
            params: {
                page, size: 30, f, q
            }
        });

        const { notices: fetchedNotice, totalCount } = response.data;

        setPageDataCache(prevCache => ({
            ...prevCache,
            [cacheKey]: fetchedNotice
        }));

        setNotice(fetchedNotice);
        setPageCount(Math.ceil(totalCount / 30));
    };

    const handlePageClick = (selectedItem) => {
        const newPage = selectedItem.selected + 1;
        setCurrentPage(selectedItem.selected);
        fetchNotice(newPage);
    };

    const handleSearch = () => {
        setCurrentPage(0);
        setPageDataCache({});
        fetchNotice(1);
    };

    const handleRowClick = (notice, navigate) => {
        navigate(`/admin/notice/${notice.NO}`, { state: { notice } });
    };

    const columns = [
        { header: '번호', accessor: 'NO' },
        { header: '제목', accessor: 'TITLE' },
        { header: '작성일', accessor: 'REG_DATE' },
    ];

    const options = [
        { value: 'no', label: '번호' },
        { value: 'title', label: '제목' },
    ];

    const formattedOffice = notice.map(item => ({
        ...item,
        REG_DATE: new Date(item.REG_DATE).toISOString().split('T')[0]
    }));

    return (
        <div className="admin-main">
            <Header />
            <Sidebar />
            <div className='main'>
                <div className="admin-notice-header">
                    <AdminSearch f={f} setF={setF} q={q} setQ={setQ} onSearch={handleSearch} options={options} />
                    <button className='admin-notice-button' onClick={() => { navigate('/admin/notice/create') }}>작성</button>
                </div>
                <AdminTable columns={columns} data={formattedOffice} onRowClick={handleRowClick} />
                <Pagination pageCount={pageCount} handlePageClick={handlePageClick} currentPage={currentPage} />
            </div>
        </div>
    );
};

export default AdminNoticeList;
