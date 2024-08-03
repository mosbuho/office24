import '../../styles/components/admin/AdminSidebar.css';

const Sidebar = () => (
    <nav className="admin-sidebar-container">
        <ul>
            <li className="active">대시보드</li>
            <li>이용자 관리</li>
            <li>매니저 관리</li>
            <li>오피스 관리</li>
            <li>리뷰 관리</li>
            <li>공지사항 관리</li>
        </ul>
    </nav>
);

export default Sidebar;