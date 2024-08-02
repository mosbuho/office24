import '../../styles/components/manager/ManagerSidebar.css';
import { useNavigate, useParams } from 'react-router-dom';


const ManagerSidebar = () => {
  const navigate = useNavigate();
  const { no } = useParams();

  const handleNav = (path) => {
    navigate(path);
  };

  return (
    <>
      <div className='managerSidebar_container'>
        <div className="sidebar">
          <div className="logo" onClick={() => handleNav(`/manager/${no}`)}>OFFICE24</div>
          <div className='button_container'>
            <div className='sidebar_button' onClick={() => handleNav(`/manager/${no}`)}>대쉬보드</div>
            <div className='sidebar_button' onClick={() => handleNav(`/manager/office/${no}`)}>오피스 관리</div>
            <div className='sidebar_button'>예약 관리</div>
            <div className='sidebar_button'>통계 관리</div>
            <div className='sidebar_button'>정보 관리</div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ManagerSidebar;