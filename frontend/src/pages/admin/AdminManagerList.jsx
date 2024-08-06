import { useState, useEffect } from 'react';
import axios from '../../utils/axiosConfig';
import Header from '../../components/admin/AdminHeader';
import Sidebar from '../../components/admin/AdminSidebar';
import Pagination from '../../components/admin/AdminPagination';
import AdminSearch from '../../components/admin/AdminSearch';
import AdminTable from '../../components/admin/AdminTable';

const AdminManagerList = () => {
    const [manager, setManager] = useState([]);
    const [pageCount, setPageCount] = useState(1);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageDataCache, setPageDataCache] = useState({});
    const [f, setF] = useState('NO');
    const [q, setQ] = useState('');

    const options = [
        { value: 'NO', label: '번호' },
        { value: 'ID', label: '아이디' },
        { value: 'NAME', label: '이름' },
        { value: 'PHONE', label: '연락처' },
    ];

    useEffect(() => {
        fetchManager(1);
    }, []);

    const fetchManager = async (page) => {
        if (pageDataCache[`${f}_${q}_${page}`]) {
            setManager(pageDataCache[`${f}_${q}_${page}`]);
            return;
        }

        const response = await axios.get(`/admin/manager`, {
            params: {
                page, size: 30, f, q
            }
        });

        const { manager: fetchedManager, totalCount } = response.data;

        setPageDataCache(prevCache => ({
            ...prevCache,
            [`${f}_${q}_${page}`]: fetchedManager
        }));

        setManager(fetchedManager);
        setPageCount(Math.ceil(totalCount / 30));
    };

    const handlePageClick = (selectedItem) => {
        const newPage = selectedItem.selected + 1;
        setCurrentPage(selectedItem.selected);
        fetchManager(newPage);
    };

    const handleSearch = () => {
        setCurrentPage(0);
        setPageDataCache({});
        fetchManager(1);
    };

    const columns = [
        { header: '번호', accessor: 'NO' },
        { header: '아이디', accessor: 'ID' },
        { header: '이름', accessor: 'NAME' },
        { header: '핸드폰', accessor: 'PHONE' },
        { header: '이메일', accessor: 'EMAIL' },
        { header: '가입일', accessor: 'REG_DATE' }
    ];

    const formattedManager = manager.map(item => ({
        ...item,
        REG_DATE: new Date(item.REG_DATE).toISOString().split('T')[0]
    }));

    return (
        <div className="admin-main">
            <Header />
            <Sidebar />
            <div className='main'>
                <AdminSearch f={f} setF={setF} q={q} setQ={setQ} onSearch={handleSearch} options={options} />
                <AdminTable columns={columns} data={formattedManager} onRowClick={(manager, navigate) => navigate(`/admin/manager/${manager.NO}`, { state: { manager } })} />
                <Pagination pageCount={pageCount} handlePageClick={handlePageClick} currentPage={currentPage} />
            </div>
        </div>
    );
};

export default AdminManagerList;
