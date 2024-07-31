import '../../styles/components/manager/ManagerHeader.css';
import { useNavigate } from 'react-router-dom';
import { LuLogOut } from "react-icons/lu";

const ManagerHeader = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        navigate('/manager', { replace: true });
    };
    return (
        <div className='managerHeader_container'>
            <div className="header">
                <button className='logout_button' type="button" onClick={handleLogout}><LuLogOut />&nbsp;Logout</button>
            </div>
        </div>
    );
}

export default ManagerHeader;