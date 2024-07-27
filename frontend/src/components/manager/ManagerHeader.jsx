import '../../styles/components/manager/ManagerHeader.css';

const ManagerHeader = () => {
    return (
        <div className='managerHeader_container'>
            <div className="header">
                <button className='logout_button' type="button">🤗 Logout</button>
            </div>
        </div>
    );
}

export default ManagerHeader;