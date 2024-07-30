import '../../styles/components/manager/ManagerHeader.css';
import { useNavigate } from 'react-router-dom';

const ManagerHeader = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('accessToken'); 
        navigate('/manager', { replace: true });
    };
    return (
        <div className='managerHeader_container'>
            <div className="header">
                <button className='logout_button' type="button" onClick={handleLogout}>🤗 Logout</button>
            </div>
        </div>
    );
}

export default ManagerHeader;