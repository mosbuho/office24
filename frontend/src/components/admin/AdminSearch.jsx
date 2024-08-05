import '../../styles/components/admin/AdminSearch.css';

const AdminSearch = ({ f, setF, q, setQ, onSearch, options }) => {
    return (
        <div className='admin-search'>
            <select value={f} onChange={(e) => setF(e.target.value)}>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            <input
                type="text"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="검색어 입력"
            />
            <button onClick={onSearch}>검색</button>
        </div>
    );
};

export default AdminSearch;