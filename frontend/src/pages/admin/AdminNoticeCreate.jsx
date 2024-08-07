import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/admin/AdminHeader';
import Sidebar from '../../components/admin/AdminSidebar';
import '../../styles/pages/admin/AdminNotice.css';
import axios from '../../utils/axiosConfig';
import { EditorState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

const AdminNoticeCreate = () => {
    const navigate = useNavigate();
    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    const [title, setTitle] = useState('');

    const handleEditorChange = (editorState) => setEditorState(editorState);

    const handleCreate = async () => {
        try {
            const contentState = editorState.getCurrentContent();
            const contentRaw = JSON.stringify(convertToRaw(contentState));

            await axios.post('/admin/notice', { title, content: contentRaw });
            navigate('/admin/notice');
        } catch {
            alert('공지 생성에 실패했습니다. 다시 시도해 주세요.');
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
                            <label htmlFor="title">제목</label>
                            <input
                                type="text"
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
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
                        <button type="button" className="create-btn" onClick={handleCreate}>생성</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminNoticeCreate;
