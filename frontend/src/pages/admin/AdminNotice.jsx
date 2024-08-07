import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../components/admin/AdminHeader';
import Sidebar from '../../components/admin/AdminSidebar';
import '../../styles/pages/admin/AdminNotice.css';
import axios from '../../utils/axiosConfig';
import { EditorState, convertFromRaw, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

const AdminNotice = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { notice } = location.state;

    const [editorState, setEditorState] = useState(() =>
        EditorState.createEmpty()
    );
    const [formData, setFormData] = useState({
        NO: notice.NO,
        TITLE: notice.TITLE,
        REG_DATE: new Date(notice.REG_DATE).toISOString().split('T')[0]
    });

    useEffect(() => {
        setEditorState(EditorState.createWithContent(convertFromRaw(JSON.parse(notice.CONTENT))));
    }, [notice.CONTENT]);

    const handleEditorChange = (editorState) => {
        setEditorState(editorState);
    };

    const handleUpdate = async () => {
        if (window.confirm('정보를 수정하시겠습니까?')) {
            try {
                const contentState = editorState.getCurrentContent();
                const contentRaw = JSON.stringify(convertToRaw(contentState));

                await axios.put(`/admin/notice/${formData.NO}`, {
                    title: formData.TITLE,
                    content: contentRaw,
                    regDate: formData.REG_DATE,
                });
                alert('정보가 수정되었습니다.');
                navigate('/admin/notice');
            } catch {
                alert('수정을 실패했습니다. 다시 시도해 주세요.');
            }
        }
    };

    const handleDelete = async () => {
        if (window.confirm('공지를 삭제하시겠습니까?')) {
            try {
                await axios.delete(`/admin/notice/${formData.NO}`);
                alert('공지가 삭제되었습니다.');
                navigate('/admin/notice');
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
                <div className='admin-notice-detail'>
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
                            <label htmlFor="title">제목</label>
                            <input
                                type="text"
                                id="title"
                                value={formData.TITLE}
                                onChange={(e) => setFormData({ ...formData, TITLE: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <div className="draft-editor">
                                <Editor
                                    editorState={editorState}
                                    onEditorStateChange={handleEditorChange}
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="regDate">작성일</label>
                            <input
                                type="date"
                                id="regDate"
                                value={formData.REG_DATE}
                                readOnly
                            />
                        </div>
                        <button type="button" className="update-btn" onClick={handleUpdate}>수정</button>
                        <button type="button" className="delete-btn" onClick={handleDelete}>삭제</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminNotice;
