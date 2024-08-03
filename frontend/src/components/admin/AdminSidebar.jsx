import '../../styles/components/admin/AdminSidebar.css';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const getClassName = (path) => {
        return location.pathname === path ? "active" : "";
    };

    return (
        <nav className="admin-sidebar">
            <ul>
                <li className={getClassName("/admin")} onClick={() => navigate('/admin')}>대시보드</li>
                <li className={getClassName("/admin/member")} onClick={() => navigate('/admin/member')}>이용자 관리</li>
                <li className={getClassName("/admin/manager")} onClick={() => navigate('/admin/manager')}>매니저 관리</li>
                <li className={getClassName("/admin/office")} onClick={() => navigate('/admin/office')}>오피스 관리</li>
                <li className={getClassName("/admin/review")} onClick={() => navigate('/admin/review')}>리뷰 관리</li>
                <li className={getClassName("/admin/notice")} onClick={() => navigate('/admin/notice')}>공지사항 관리</li>
            </ul>
        </nav>
    );
};

export default Sidebar;