import { LuLogOut } from "react-icons/lu";
import { useNavigate } from 'react-router-dom';
import { removeTokens } from "../../utils/auth";
import '../../styles/components/admin/AdminHeader.css';

const AdminHeader = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        removeTokens();
        navigate('/admin/login', { replace: true });
    };

    return (
        <div className="admin-header">
            <div className="logo" onClick={() => { navigate("/admin") }}>OFFICE24</div>
            <div className="logout" onClick={handleLogout}>
                <LuLogOut />
                <span>로그아웃</span>
            </div>
        </div>
    );
};

export default AdminHeader; 