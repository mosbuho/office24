import { useState, useEffect } from 'react';
import axios from '../../utils/axiosConfig';
import Header from '../../components/admin/AdminHeader';
import Sidebar from '../../components/admin/AdminSidebar';
import Pagination from '../../components/admin/AdminPagination';
import AdminSearch from '../../components/admin/AdminSearch';
import AdminTable from '../../components/admin/AdminTable';
import '../../styles/pages/admin/AdminReviewList.css';

const AdminReviewList = () => {
    const [reviews, setReviews] = useState([]);
    const [pageCount, setPageCount] = useState(1);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageDataCache, setPageDataCache] = useState({});
    const [f, setF] = useState('NO');
    const [q, setQ] = useState('');

    useEffect(() => {
        fetchReviews(1);
    }, []);

    const fetchReviews = async (page) => {
        if (pageDataCache[`${f}_${q}_${page}`]) {
            setReviews(pageDataCache[`${f}_${q}_${page}`]);
            return;
        }

        const response = await axios.get(`/admin/review`, {
            params: {
                page, size: 30, f, q
            }
        });

        const { reviews: fetchedReviews, totalCount } = response.data;
        setPageDataCache(prevCache => ({
            ...prevCache,
            [`${f}_${q}_${page}`]: fetchedReviews
        }));

        setReviews(fetchedReviews);
        setPageCount(Math.ceil(totalCount / 30));
    };

    const handlePageClick = (selectedItem) => {
        const newPage = selectedItem.selected + 1;
        setCurrentPage(selectedItem.selected);
        fetchReviews(newPage);
    };

    const handleSearch = () => {
        setCurrentPage(0);
        setPageDataCache({});
        fetchReviews(1);
    };

    const handleDelete = async (reviewNo) => {
        if (confirm("리뷰를 삭제하시겠습니까?")) {
            await axios.delete(`/admin/review/${reviewNo}`);
            setReviews(prevReviews => prevReviews.filter(review => review.NO !== reviewNo));
            setPageDataCache(prevCache => {
                const updatedCache = { ...prevCache };
                for (let key in updatedCache) {
                    updatedCache[key] = updatedCache[key].filter(review => review.NO !== reviewNo);
                }
                return updatedCache;
            });
            alert("리뷰가 삭제되었습니다.");
        }
    };

    const options = [
        { value: 'NO', label: '번호' },
        { value: 'CONTENT', label: '내용' },
        { value: 'OFFICE_NO', label: '오피스번호' },
        { value: 'MEMBER_NO', label: '작성자번호' },
    ];

    const columns = [
        { header: '번호', accessor: 'NO' },
        { header: '내용', accessor: 'CONTENT' },
        { header: '작성자번호', accessor: 'MEMBER_NO' },
        { header: '오피스번호', accessor: 'OFFICE_NO' },
        { header: '결제번호', accessor: 'BOOKING_NO' },
        { header: '점수', accessor: 'RATING' },
        { header: '작성일', accessor: 'REG_DATE' },
        { header: '', accessor: 'actions' }
    ];

    const formattedReviews = reviews.map(item => ({
        ...item,
        REG_DATE: new Date(item.REG_DATE).toISOString().split('T')[0],
        actions: <button className='admin-review-delete-btn' onClick={() => handleDelete(item.NO)}>삭제</button>
    }));

    return (
        <div className="admin-main">
            <Header />
            <Sidebar />
            <div className='main'>
                <AdminSearch f={f} setF={setF} q={q} setQ={setQ} onSearch={handleSearch} options={options} />
                <AdminTable columns={columns} data={formattedReviews} onRowClick={() => { }} />
                <Pagination pageCount={pageCount} handlePageClick={handlePageClick} currentPage={currentPage} />
            </div>
        </div>
    );
};

export default AdminReviewList;