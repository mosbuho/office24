import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../utils/axiosConfig';
import Header from '../../components/admin/AdminHeader';
import Sidebar from '../../components/admin/AdminSidebar';
import Pagination from '../../components/admin/AdminPagination';
import '../../styles/pages/admin/AdminMemberList.css';

const AdminMember = () => {
    const [members, setMembers] = useState([]);
    const [pageCount, setPageCount] = useState(1);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageDataCache, setPageDataCache] = useState({});
    const [f, setF] = useState('NO');
    const [q, setQ] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        fetchMembers(1);
    }, []);

    const fetchMembers = async (page) => {
        if (pageDataCache[`${f}_${q}_${page}`]) {
            setMembers(pageDataCache[`${f}_${q}_${page}`]);
            return;
        }
        const response = await axios.get(`/admin/member`, {
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
        setCurrentPage(0); // Reset to the first page
        setPageDataCache({}); // Invalidate cache on search
        fetchMembers(1); // Fetch the first page with new search criteria
    };

    return (
        <div className="admin-main">
            <Header />
            <Sidebar />
            <div className='main'>
                <div className='admin-search'>
                    <select
                        value={f}
                        onChange={(e) => setF(e.target.value)}
                    >
                        <option value="NO">번호</option>
                        <option value="ID">아이디</option>
                        <option value="NAME">이름</option>
                        <option value="PHONE">핸드폰</option>
                    </select>
                    <input
                        type="text"
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        placeholder="검색어 입력"
                    />
                    <button onClick={handleSearch}>검색</button>
                </div>
                <div className='admin-table'>
                    <table>
                        <thead>
                            <tr>
                                <th>번호</th>
                                <th>아이디</th>
                                <th>이름</th>
                                <th>핸드폰</th>
                                <th>이메일</th>
                                <th>생일</th>
                                <th>성별</th>
                                <th>가입일</th>
                            </tr>
                        </thead>
                        <tbody>
                            {members.map(member => (
                                <tr key={member.NO} onClick={() => navigate(`/admin/member/${member.NO}`, { state: { member } })}>
                                    <td>{member.NO}</td>
                                    <td>{member.ID}</td>
                                    <td>{member.NAME}</td>
                                    <td>{member.PHONE}</td>
                                    <td>{member.EMAIL}</td>
                                    <td>{new Date(member.BIRTH).toISOString().split('T')[0]}</td>
                                    <td>{member.GENDER === 'M' ? "남성" : "여성"}</td>
                                    <td>{new Date(member.REG_DATE).toISOString().split('T')[0]}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <Pagination
                    pageCount={pageCount}
                    handlePageClick={handlePageClick}
                    currentPage={currentPage}
                />
            </div>
        </div>
    );
};

export default AdminMember;
