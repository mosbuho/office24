import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../components/admin/AdminHeader';
import Sidebar from '../../components/admin/AdminSidebar';
import '../../styles/pages/admin/AdminMember.css';
import axios from '../../utils/axiosConfig';

const Adminmanager = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { manager } = location.state;

    const [formData, setFormData] = useState({
        NO: manager.NO,
        ID: manager.ID,
        NAME: manager.NAME,
        PHONE: manager.PHONE,
        EMAIL: manager.EMAIL,
        REG_DATE: new Date(manager.REG_DATE).toISOString().split('T')[0]
    });

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [id.toUpperCase()]: value
        }));
    };

    const handlePwReset = async () => {
        if (window.confirm('비밀번호를 초기화 하시겠습니까?')) {
            try {
                await axios.post(`/admin/manager/${formData.NO}/reset-pw`);
                alert('비밀번호가 초기화 되었습니다.');
                navigate('/admin/manager');
            } catch {
                alert('비밀번호 초기화를 실패했습니다. 다시 시도해 주세요.');
            }
        }
    }

    const handleUpdate = async () => {
        if (window.confirm('정보를 수정하시겠습니까?')) {
            try {
                await axios.put(`/admin/manager/${formData.NO}`, {
                    name: formData.NAME,
                    phone: formData.PHONE,
                    email: formData.EMAIL,
                });
                alert('정보가 수정되었습니다.');
                navigate('/admin/manager');
            } catch {
                alert('수정을 실패했습니다. 다시 시도해 주세요.');
            }
        }
    };

    const handleDelete = async () => {
        if (window.confirm('이용자를 삭제하시겠습니까?')) {
            try {
                await axios.delete(`/admin/manager/${formData.NO}`);
                alert('이용자가 삭제되었습니다.');
                navigate('/admin/manager');
            } catch {
                alert('삭제를 실패했습니다. 다시 시도해 주세요.');
            }
        }
    };

    return (
        <div className="admin-main">
            <Header />
            <Sidebar />
            <div className='main'>
                <div className='admin-member-detail'>
                    <form>
                        <div className="form-group">
                            <label htmlFor="no">번호</label>
                            <input
                                type="text"
                                id="no"
                                value={formData.NO}
                                readOnly
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="id">아이디</label>
                            <input
                                type="text"
                                id="id"
                                value={formData.ID}
                                readOnly
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="name">이름</label>
                            <input
                                type="text"
                                id="name"
                                value={formData.NAME}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="phone">핸드폰 번호</label>
                            <input
                                type="text"
                                id="phone"
                                value={formData.PHONE}
                                onChange={handleChange}
                                maxLength={11}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">이메일</label>
                            <input
                                type="email"
                                id="email"
                                value={formData.EMAIL}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="regDate">가입일</label>
                            <input
                                type="date"
                                id="regDate"
                                value={formData.REG_DATE}
                                readOnly
                            />
                        </div>
                        <button type="button" className="pw-reset-btn" onClick={handlePwReset}>비밀번호 초기화</button>
                        <button type="button" className="update-btn" onClick={handleUpdate}>수정</button>
                        <button type="button" className="delete-btn" onClick={handleDelete}>삭제</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Adminmanager;
