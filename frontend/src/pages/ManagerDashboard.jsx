import ManagerHeader from '../components/ManagerHeader';
import ManagerSidebar from '../components/ManagerSidebar';
import '../styles/ManagerDashboard.css';

const mockData = [
    { book_no: 1, office_no: 131, title: '하루 오피스', member_no: 876, name: '홍길동', start_date: '2024-07-22', end_date: '2024-07-25' },
    { book_no: 2, office_no: 135, title: '오늘 오피스', member_no: 877, name: '이석진', start_date: '2024-07-22', end_date: '2024-07-25' },
    { book_no: 3, office_no: 127, title: '내일 오피스', member_no: 278, name: '김건우', start_date: '2024-07-22', end_date: '2024-07-25' },
];

const ManagerDashboard = () => {

    return (
        <>
            {/* 사이드바 컴포넌트 */}
            <ManagerSidebar title={'office24'} firstChild={'대쉬보드'} secondChild={'상품 관리'} 
            thirdChild={'예약 관리'} fourthChild={'통계'} fifthChild={'정보수정'}/>

            {/* 헤더 컴포넌트*/}
            <ManagerHeader/>
            
            {/* 본문 내용 */}
            <div className="main-content">
                {/* 대쉬보드 전체 컨테이너*/}
                <div className="dashboard">
                    <div className='mini-container'>
                        <div className='mini-stats'>1</div>
                        <div className='mini-stats'>2</div>
                        <div className='mini-stats'>3</div>
                        <div className='mini-stats'>4</div>
                    </div>
                    
                    {/* 통계 컨테이너 */}
                    <div className="statistics">
                        <h3>오피스 이용 통계</h3>
                        <div className="chart-container">
                            <canvas id="usageChart"></canvas>
                        </div>
                    </div>
                    
                    {/* 오피스 컨테이너 */}
                    <div className="product">
                        <h3>오피스 상품 관리</h3>
                        <button>등록</button>
                        <button>수정</button>
                        <button>삭제</button>
                    </div>

                    {/* 예약 컨테이너 */}
                    <div className="reserve">
                        <h3>예약 내역</h3>
                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>예약 번호</th>
                                        <th>오피스 번호</th>
                                        <th>오피스 이름</th>
                                        <th>예약자 코드</th>
                                        <th>예약자 이름</th>
                                        <th>날짜</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {mockData.map((item) => (
                                        <tr key={item.book_no}>
                                            <td>{item.book_no}</td>
                                            <td>{item.office_no}</td>
                                            <td>{item.title}</td>
                                            <td>{item.member_no}</td>
                                            <td>{item.name}</td>
                                            <td>{item.start_date}~{item.end_date}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ManagerDashboard;
