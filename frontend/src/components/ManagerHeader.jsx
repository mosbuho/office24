import '../styles/ManagerHeader.css';

const ManagerHeader = ({ leftChild, rightChild }) => {
    return (
            <div className='header_container'>
                <div className="header">
                        <button className='logout_button' type="button">🤗 Logout</button>
                </div>
            </div>
    );
}

export default ManagerHeader