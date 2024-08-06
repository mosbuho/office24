import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../utils/axiosConfig';
import Header from '../../components/admin/AdminHeader';
import Sidebar from '../../components/admin/AdminSidebar';
import Pagination from '../../components/admin/AdminPagination';
import AdminSearch from '../../components/admin/AdminSearch';
import '../../styles/pages/admin/AdminTable.css';


const AdminReviewList = () => {
    const [reviews, setreviews] = useState([]);
    const [pageCount, setPageCount] = useState(1);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageDataCache, setPageDataCache] = useState({});
    const [f, setF] = useState('NO');
    const [q, setQ] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        fetchreviews(1);
    }, []);

    const fetchreviews = async (page) => {
        if (pageDataCache[`${f}_${q}_${page}`]) {
            setreviews(pageDataCache[`${f}_${q}_${page}`]);
            return;
        }

        const response = await axios.get(`/admin/review`, {
            params: {
                page, size: 30, f, q
            }
        });

        const { reviews: fetchedreviews, totalCount } = response.data;
        console.log(fetchedreviews);
        setPageDataCache(prevCache => ({
            ...prevCache,
            [`${f}_${q}_${page}`]: fetchedreviews
        }));

        setreviews(fetchedreviews);
        setPageCount(Math.ceil(totalCount / 30));
    };

    const handlePageClick = (selectedItem) => {
        const newPage = selectedItem.selected + 1;
        setCurrentPage(selectedItem.selected);
        fetchreviews(newPage);
    };

    const handleSearch = () => {
        setCurrentPage(0);
        setPageDataCache({});
        fetchreviews(1);
    };

    const options = [
        { value: 'NO', label: '번호' },
        { value: 'CONTENT', label: '내용' },
        { value: 'OFFICE_NO', label: '오피스번호' },
        { value: 'MEMBER_NO', label: '작성자번호' },
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
                                <th>내용</th>
                                <th>작성자번호</th>
                                <th>오피스번호</th>
                                <th>점수</th>
                                <th>작성일</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reviews.length === 0 ? (
                                <tr>
                                    <td colSpan="6">데이터가 존재하지 않습니다.</td>
                                </tr>
                            ) : (
                                reviews.map(review => (
                                    <tr key={review.NO} onClick={() => navigate(`/admin/review/${review.NO}`, { state: { review } })}>
                                        <td>{review.NO}</td>
                                        <td>{review.CONTENT}</td>
                                        <td>{review.MEMBER_NO}</td>
                                        <td>{review.OFFICE_NO}</td>
                                        <td>{review.RATING}</td>
                                        <td>{new Date(review.REG_DATE).toISOString().split('T')[0]}</td>
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

export default AdminReviewList;
