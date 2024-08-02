import { LuLogOut } from "react-icons/lu";
import '../../styles/components/admin/AdminHeader.css';

const Header = ({ onLogout }) => (
    <div className="admin-header-container">
        <div className="logo">OFFICE24</div>
        <input type="text" placeholder="Search" className="search-input" />
        <div className="logout" onClick={onLogout}>
            <LuLogOut />
            <span>로그아웃</span>
        </div>
    </div>
);

export default Header;