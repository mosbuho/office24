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

    const navigate = useNavigate();

    useEffect(() => {
        fetchMembers(1);
    }, []);

    const fetchMembers = async (page) => {
        if (pageDataCache[page]) {
            setMembers(pageDataCache[page]);
            return;
        }

        const response = await axios.get(`/admin/member`, {
            params: { page, size: 30 }
        });
        const { members: fetchedMembers, totalCount } = response.data;

        setPageDataCache(prevCache => ({
            ...prevCache,
            [page]: fetchedMembers
        }));

        setMembers(fetchedMembers);
        setPageCount(Math.ceil(totalCount / 30));
    };

    const handlePageClick = (selectedItem) => {
        const newPage = selectedItem.selected + 1;
        setCurrentPage(selectedItem.selected);
        fetchMembers(newPage);
    };

    return (
        <div className="admin-main">
            <Header />
            <Sidebar />
            <div className='main'>
                <div className='admin-table'>
                    <table>
                        <thead>
                            <tr>
                                <th>번호</th>
                                <th>아이디</th>
                                <th>이름</th>
                                <th>핸드폰 번호</th>
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
