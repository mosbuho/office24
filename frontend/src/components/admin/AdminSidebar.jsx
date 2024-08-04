import '../../styles/components/admin/AdminSidebar.css';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const getClassName = (keyword) => {
        return location.pathname.includes(keyword) ? "active" : "";
    };

    return (
        <nav className="admin-sidebar">
            <ul>
                <li className={getClassName("admin") && !location.pathname.includes('member') && !location.pathname.includes('manager') && !location.pathname.includes('office') && !location.pathname.includes('review') && !location.pathname.includes('notice') ? "active" : ""} onClick={() => navigate('/admin')}>대시보드</li>
                <li className={getClassName("member")} onClick={() => navigate('/admin/member')}>이용자 관리</li>
                <li className={getClassName("manager")} onClick={() => navigate('/admin/manager')}>매니저 관리</li>
                <li className={getClassName("office")} onClick={() => navigate('/admin/office')}>오피스 관리</li>
                <li className={getClassName("review")} onClick={() => navigate('/admin/review')}>리뷰 관리</li>
                <li className={getClassName("notice")} onClick={() => navigate('/admin/notice')}>공지사항 관리</li>
            </ul>
        </nav>
    );
};

export default Sidebar;
