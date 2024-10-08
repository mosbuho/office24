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
            <div className='sidebar_button' onClick={() => handleNav(`/manager`)}>대쉬보드</div>
            <div className='sidebar_button' onClick={() => handleNav(`/manager/office`)}>오피스 관리</div>
            <div className='sidebar_button' onClick={() => handleNav(`/manager/booking`)}>예약 관리</div>
            <div className='sidebar_button' onClick={() => handleNav(`/manager/info`)}>정보 관리</div>
            <div className='sidebar_button' onClick={() => handleNav(`/manager/refund`)}>환불 내역</div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ManagerSidebar;