import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/components/admin/AdminTable.css';

const AdminTable = ({ columns, data, onRowClick }) => {
    const navigate = useNavigate();

    return (
        <div className='admin-table'>
            <table>
                <thead>
                    <tr>
                        {columns.map((column, index) => (
                            <th key={index}>{column.header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.length === 0 ? (
                        <tr>
                            <td colSpan={columns.length}>데이터가 존재하지 않습니다.</td>
                        </tr>
                    ) : (
                        data.map((row, rowIndex) => (
                            <tr key={rowIndex} onClick={() => onRowClick(row, navigate)}>
                                {columns.map((column, colIndex) => (
                                    <td key={colIndex}>{row[column.accessor]}</td>
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default AdminTable;
