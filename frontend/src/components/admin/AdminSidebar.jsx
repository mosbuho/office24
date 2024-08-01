import '../../styles/components/admin/AdminSidebar.css';

const Sidebar = () => (
    <nav className="admin-sidebar-container">
        <ul>
            <li className="active">대시보드</li>
            <li>멤버</li>
            <li>매니저</li>
            <li>오피스</li>
            <li>리뷰</li>
            <li>신고</li>
        </ul>
    </nav>
);

export default Sidebar;