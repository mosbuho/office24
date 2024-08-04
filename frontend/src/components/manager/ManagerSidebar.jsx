import '../../styles/components/manager/ManagerSidebar.css';
import { useNavigate } from 'react-router-dom';
import { getNo } from '../../utils/auth';


const ManagerSidebar = () => {
  const navigate = useNavigate();
  const no = getNo();

  const handleNav = (path) => {
    navigate(path);
  };

  return (
    <>
      <div className='managerSidebar_container'>
        <div className="sidebar">
          <div className="logo" onClick={() => handleNav('/manager')}>OFFICE24</div>
          <div className='button_container'>
            <div className='sidebar_button' onClick={() => handleNav(`/manager/office/${no}`)}>오피스 관리</div>
            <div className='sidebar_button' onClick={() => handleNav(`/manager/booking/${no}`)}>예약 관리</div>
            <div className='sidebar_button'>통계 관리</div>
            <div className='sidebar_button'>정보 관리</div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ManagerSidebar;