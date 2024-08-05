import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../utils/axiosConfig';
import Header from '../../components/admin/AdminHeader';
import Sidebar from '../../components/admin/AdminSidebar';
import Pagination from '../../components/admin/AdminPagination';
import AdminSearch from '../../components/admin/AdminSearch';
import '../../styles/pages/admin/AdminTable.css';


const AdminOffice = () => {
    const [office, setOffice] = useState([]);
    const [pageCount, setPageCount] = useState(1);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageDataCache, setPageDataCache] = useState({});
    const [f, setF] = useState('no');
    const [q, setQ] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        fetchoffice(1);
    }, []);

    const fetchoffice = async (page) => {
        if (pageDataCache[`${f}_${q}_${page}`]) {
            setOffice(pageDataCache[`${f}_${q}_${page}`]);
            return;
        }

        const response = await axios.get('/admin/office', {
            params: {
                page, size: 30, f, q
            }
        });

        const { office: fetchedoffice, totalCount } = response.data;

        setPageDataCache(prevCache => ({
            ...prevCache,
            [`${f}_${q}_${page}`]: fetchedoffice
        }));

        setOffice(fetchedoffice);
        setPageCount(Math.ceil(totalCount / 30));
    };

    const handlePageClick = (selectedItem) => {
        const newPage = selectedItem.selected + 1;
        setCurrentPage(selectedItem.selected);
        fetchoffice(newPage);
    };

    const handleSearch = () => {
        setCurrentPage(0);
        setPageDataCache({});
        fetchoffice(1);
    };

    const options = [
        { value: 'no', label: '번호' },
        { value: 'title', label: '오피스명' },
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
                                <th>오피스명</th>
                                <th>주소</th>
                                <th>매니저</th>
                                <th>연락처</th>
                                <th>가격</th>
                                <th>수용인원</th>
                                <th>승인여부</th>
                                <th>생성일</th>
                            </tr>
                        </thead>
                        <tbody>
                            {office.length === 0 ? (
                                <tr>
                                    <td colSpan="8">데이터가 존재하지 않습니다.</td>
                                </tr>
                            ) : (
                                office.map(office => (
                                    <tr key={office.NO} onClick={() => navigate(`/admin/office/${office.NO}`, { state: { office } })}>
                                        <td>{office.NO}</td>
                                        <td>{office.TITLE}</td>
                                        <td>{office.ADDRESS}</td>
                                        <td>{office.NAME}</td>
                                        <td>{office.PHONE}</td>
                                        <td>{office.PRICE.toLocaleString()}원</td>
                                        <td>{office.CAPACITY.toLocaleString()}</td>
                                        <td>{office.AVAILABILITY === 1 ? '승인' : '미승인'}</td>
                                        <td>{new Date(office.REG_DATE).toISOString().split('T')[0]}</td>
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

export default AdminOffice;
