import '../../styles/components/admin/AdminSearch.css';

const AdminSearch = ({ f, setF, query, setQ, onSearch }) => {
    return (
        <div className='admin-search'>
            <select value={f} onChange={(e) => setF(e.target.value)}>
                <option value="NO">번호</option>
                <option value="ID">아이디</option>
                <option value="NAME">이름</option>
                <option value="PHONE">핸드폰</option>
            </select>
            <input
                type="text"
                value={query}
                onChange={(e) => setQ(e.target.value)}
                placeholder="검색어 입력"
            />
            <button onClick={onSearch}>검색</button>
        </div>
    );
};

export default AdminSearch;