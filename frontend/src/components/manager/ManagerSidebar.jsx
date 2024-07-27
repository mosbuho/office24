import '../../styles/components/manager/ManagerSidebar.css';

const ManagerSidebar = ({ title, firstChild, secondChild, thirdChild, fourthChild, fifthChild }) => {
    return (
        <>
            <div className='managerSidebar_container'>
                <div className="sidebar">
                    <div className="logo">{title}</div>
                    <div className='button_container'>
                        <div className='sidebar_button'>{firstChild}</div>
                        <div className='sidebar_button'>{secondChild}</div>
                        <div className='sidebar_button'>{thirdChild}</div>
                        <div className='sidebar_button'>{fourthChild}</div>
                        <div className='sidebar_button'>{fifthChild}</div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ManagerSidebar;