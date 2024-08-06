import { useState, useEffect } from 'react';
import axios from '../../utils/axiosConfig';
import Header from '../../components/admin/AdminHeader';
import Sidebar from '../../components/admin/AdminSidebar';
import Pagination from '../../components/admin/AdminPagination';
import AdminSearch from '../../components/admin/AdminSearch';
import AdminTable from '../../components/admin/AdminTable';
import '../../styles/pages/admin/AdminOfficeList.css';

const AdminOfficeList = () => {
    const [office, setOffice] = useState([]);
    const [pageCount, setPageCount] = useState(1);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageDataCache, setPageDataCache] = useState({});
    const [availability, setAvailability] = useState('');
    const [f, setF] = useState('no');
    const [q, setQ] = useState('');

    useEffect(() => {
        fetchOffice(1);
    }, [availability]);

    const fetchOffice = async (page) => {
        const cacheKey = `${f}_${q}_${availability}_${page}`;
        if (pageDataCache[cacheKey]) {
            setOffice(pageDataCache[cacheKey]);
            return;
        }

        const response = await axios.get('/admin/office', {
            params: {
                page, size: 30, f, q, availability
            }
        });

        const { office: fetchedoffice, totalCount } = response.data;

        setPageDataCache(prevCache => ({
            ...prevCache,
            [cacheKey]: fetchedoffice
        }));

        setOffice(fetchedoffice);
        setPageCount(Math.ceil(totalCount / 30));
    };

    const handlePageClick = (selectedItem) => {
        const newPage = selectedItem.selected + 1;
        setCurrentPage(selectedItem.selected);
        fetchOffice(newPage);
    };

    const handleSearch = () => {
        setCurrentPage(0);
        setPageDataCache({});
        fetchOffice(1);
    };

    const handleFilterChange = (event) => {
        setAvailability(event.target.value);
        setCurrentPage(0);
        setPageDataCache({});
        fetchOffice(1);
    };

    const columns = [
        { header: '번호', accessor: 'NO' },
        { header: '오피스명', accessor: 'TITLE' },
        { header: '주소', accessor: 'ADDRESS' },
        { header: '매니저', accessor: 'NAME' },
        { header: '연락처', accessor: 'PHONE' },
        { header: '가격', accessor: 'PRICE' },
        { header: '수용인원', accessor: 'CAPACITY' },
        { header: '승인여부', accessor: 'AVAILABILITY' },
        { header: '생성일', accessor: 'REG_DATE' }
    ];

    const options = [
        { value: 'no', label: '번호' },
        { value: 'title', label: '오피스명' },
    ];

    const formattedOffice = office.map(item => ({
        ...item,
        PRICE: item.PRICE.toLocaleString() + '원',
        CAPACITY: item.CAPACITY.toLocaleString(),
        AVAILABILITY: item.AVAILABILITY === 1 ? '승인' : (item.AVAILABILITY === 2 ? '반려됨' : '미승인'),
        REG_DATE: new Date(item.REG_DATE).toISOString().split('T')[0]
    }));

    return (
        <div className="admin-main">
            <Header />
            <Sidebar />
            <div className='main'>
                <div className="admin-office-header">
                    <AdminSearch f={f} setF={setF} q={q} setQ={setQ} onSearch={handleSearch} options={options} />
                    <select className="office-filter-select" onChange={handleFilterChange} value={availability}>
                        <option value=''>전체</option>
                        <option value='1'>승인</option>
                        <option value='0'>미승인</option>
                        <option value='2'>반려</option>
                    </select>
                </div>
                <AdminTable columns={columns} data={formattedOffice} onRowClick={(office, navigate) => navigate(`/admin/office/${office.NO}`)} />
                <Pagination pageCount={pageCount} handlePageClick={handlePageClick} currentPage={currentPage} />
            </div>
        </div>
    );
};

export default AdminOfficeList;
