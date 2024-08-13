import '../../styles/components/admin/AdminSidebar.css';
import { useNavigate, useLocation } from 'react-router-dom';

const AdminSidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const sections = {
        member: '이용자',
        manager: '매니저',
        office: '오피스',
        review: '리뷰',
        booking: '예약',
        refund: '취소',
        notice: '공지사항'
    };

    const getClassName = (keyword) => {
        return location.pathname.includes(keyword) ? "active" : "";
    };

    return (
        <nav className="admin-sidebar">
            <ul>
                <li className={location.pathname.endsWith('admin') ? "active" : ""} onClick={() => navigate('/admin')}>대시보드</li>
                {Object.keys(sections).map(section => (
                    <li key={section} className={getClassName(section)} onClick={() => navigate(`/admin/${section}`)}>
                        {sections[section]}
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default AdminSidebar;
