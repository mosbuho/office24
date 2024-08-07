import React from 'react';
import ReactPaginate from 'react-paginate';
import '../../styles/components/admin/AdminPagination.css';

const AdminPagination = ({ pageCount, handlePageClick, currentPage }) => {
    return (
        <ReactPaginate
            previousLabel={"이전"}
            nextLabel={"다음"}
            breakLabel={"..."}
            pageCount={pageCount}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={handlePageClick}
            containerClassName={"admin-pagination"}
            activeClassName={"active"}
            disabledClassName={"disabled"}
            previousClassName={"previous"}
            nextClassName={"next"}
            forcePage={currentPage}
        />
    );
};

export default AdminPagination;
