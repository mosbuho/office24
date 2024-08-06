import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../utils/axiosConfig';
import Header from '../../components/admin/AdminHeader';
import Sidebar from '../../components/admin/AdminSidebar';
import Pagination from '../../components/admin/AdminPagination';
import AdminSearch from '../../components/admin/AdminSearch';
import '../../styles/pages/admin/AdminTable.css';


const Adminmanager = () => {
    const [manager, setManager] = useState([]);
    const [pageCount, setPageCount] = useState(1);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageDataCache, setPageDataCache] = useState({});
    const [f, setF] = useState('NO');
    const [q, setQ] = useState('');

    const navigate = useNavigate();

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

    const options = [
        { value: 'NO', label: '번호' },
        { value: 'ID', label: '아이디' },
        { value: 'NAME', label: '이름' },
        { value: 'PHONE', label: '연락처' },
    ];


    return (
        <div className="admin-main">
            <Header />
            <Sidebar />
            <div className='main'>
                <AdminSearch f={f} setF={setF} q={q} setQ={setQ} onSearch={handleSearch} options={options} />
                <div className='admin-table'>
                    <table>
                        <thead>
                            <tr>
                                <th>번호</th>
                                <th>아이디</th>
                                <th>이름</th>
                                <th>핸드폰</th>
                                <th>이메일</th>
                                <th>가입일</th>
                            </tr>
                        </thead>
                        <tbody>
                            {manager.length === 0 ? (
                                <tr>
                                    <td colSpan="8">데이터가 존재하지 않습니다.</td>
                                </tr>
                            ) : (
                                manager.map(manager => (
                                    <tr key={manager.NO} onClick={() => navigate(`/admin/manager/${manager.NO}`, { state: { manager } })}>
                                        <td>{manager.NO}</td>
                                        <td>{manager.ID}</td>
                                        <td>{manager.NAME}</td>
                                        <td>{manager.PHONE}</td>
                                        <td>{manager.EMAIL}</td>
                                        <td>{new Date(manager.REG_DATE).toISOString().split('T')[0]}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                <Pagination pageCount={pageCount} handlePageClick={handlePageClick} currentPage={currentPage}
                />
            </div>
        </div>
    );
};

export default Adminmanager;
