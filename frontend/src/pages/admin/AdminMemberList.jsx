import React, { useState, useEffect } from 'react';
import axios from '../../utils/axiosConfig';
import Table from '../../components/admin/AdminTable';
import Header from '../../components/admin/AdminHeader';
import Sidebar from '../../components/admin/AdminSidebar';
import Pagination from '../../components/admin/AdminPagination';
import AdminSearch from '../../components/admin/AdminSearch';

const AdminMemberList = () => {
    const [members, setMembers] = useState([]);
    const [pageCount, setPageCount] = useState(1);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageDataCache, setPageDataCache] = useState({});
    const [f, setF] = useState('NO');
    const [q, setQ] = useState('');

    useEffect(() => {
        fetchMembers(1);
    }, []);

    const fetchMembers = async (page) => {
        if (pageDataCache[`${f}_${q}_${page}`]) {
            setMembers(pageDataCache[`${f}_${q}_${page}`]);
            return;
        }

        const response = await axios.get('/admin/member', {
            params: {
                page, size: 30, f, q
            }
        });

        const { members: fetchedMembers, totalCount } = response.data;
        setPageDataCache(prevCache => ({
            ...prevCache,
            [`${f}_${q}_${page}`]: fetchedMembers
        }));

        setMembers(fetchedMembers);
        setPageCount(Math.ceil(totalCount / 30));
    };

    const handlePageClick = (selectedItem) => {
        const newPage = selectedItem.selected + 1;
        setCurrentPage(selectedItem.selected);
        fetchMembers(newPage);
    };

    const handleSearch = () => {
        setCurrentPage(0);
        setPageDataCache({});
        fetchMembers(1);
    };

    const handleRowClick = (member, navigate) => {
        navigate(`/admin/member/${member.NO}`, { state: { member } });
    };

    const columns = [
        { header: '번호', accessor: 'NO' },
        { header: '아이디', accessor: 'ID' },
        { header: '이름', accessor: 'NAME' },
        { header: '핸드폰', accessor: 'PHONE' },
        { header: '이메일', accessor: 'EMAIL' },
        { header: '생일', accessor: 'BIRTH' },
        { header: '성별', accessor: 'GENDER' },
        { header: '가입일', accessor: 'REG_DATE' },
    ];

    const options = [
        { value: 'NO', label: '번호' },
        { value: 'ID', label: '아이디' },
        { value: 'NAME', label: '이름' },
        { value: 'PHONE', label: '연락처' },
    ];

    const formattedMembers = members.map(member => ({
        ...member,
        BIRTH: new Date(member.BIRTH).toISOString().split('T')[0],
        REG_DATE: new Date(member.REG_DATE).toISOString().split('T')[0],
        GENDER: member.GENDER === 'M' ? '남성' : '여성'
    }));

    return (
        <div className="admin-main">
            <Header />
            <Sidebar />
            <div className='main'>
                <AdminSearch f={f} setF={setF} q={q} setQ={setQ} onSearch={handleSearch} options={options} />
                <Table columns={columns} data={formattedMembers} onRowClick={handleRowClick} />
                <Pagination pageCount={pageCount} handlePageClick={handlePageClick} currentPage={currentPage} />
            </div>
        </div>
    );
};

export default AdminMemberList;
