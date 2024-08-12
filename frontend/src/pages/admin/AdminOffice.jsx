import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { EditorState, convertFromRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import axios from '../../utils/axiosConfig';
import Sidebar from '../../components/admin/AdminSidebar';
import Header from "../../components/admin/AdminHeader";
import '../../styles/pages/admin/AdminOffice.css';

const AdminOffice = () => {
    const { no } = useParams();
    const [office, setOffice] = useState({
        title: '',
        price: '',
        address: '',
        zipcode: '',
        sido: '',
        content: '',
        capacity: '',
        mainImageUrl: '',
        additionalImageUrls: ['', ''],
    });

    const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOfficeDetails = async () => {
            try {
                const { data } = await axios.get(`/admin/office/${no}`, { withCredentials: true });

                if (data.content) {
                    const contentState = convertFromRaw(JSON.parse(data.content));
                    setEditorState(EditorState.createWithContent(contentState));
                }

                setOffice({
                    title: data.title || '',
                    price: data.price || '',
                    address: data.address || '',
                    zipcode: data.zipCode || '',
                    sido: data.sido || '',
                    content: data.content || '',
                    capacity: data.capacity || '',
                    mainImageUrl: data.titleImg ? `http://localhost:8080/img/${data.titleImg}` : '',
                    additionalImageUrls: data.additionalImageUrls.map(url => url ? `http://localhost:8080/img/${url}` : ''),
                });
            } catch (err) {
                alert("오피스 정보를 불러오는 중 오류가 발생했습니다.");
            }
        };

        fetchOfficeDetails();
    }, [no]);

    const handleAccept = async () => {
        try {
            await axios.put(`/admin/office/${no}/accept`);
            alert("승인 되었습니다.");
            navigate('/admin/office');
        } catch {
            alert("처리 중 오류가 발생했습니다. 다시 시도해주세요.");
        }
    };

    const handleRefuse = async () => {
        try {
            await axios.put(`/admin/office/${no}/refuse`);
            alert("반려 되었습니다.");
            navigate('/admin/office');
        } catch {
            alert("처리 중 오류가 발생했습니다. 다시 시도해주세요.");
        }
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`/admin/office/${no}`);
            alert("삭제 되었습니다.");
            navigate('/admin/office');
        } catch {
            alert("처리 중 오류가 발생했습니다. 다시 시도해주세요.");
        }
    };

    return (
        <div className="admin-main">
            <Header />
            <Sidebar />
            <div className='main'>
                <div className='admin-office-detail'>
                    <div className='image-preview-section'>
                        <div className='main-image-preview'>
                            <img
                                src={office.mainImageUrl}
                                alt="Main Preview"
                            />
                        </div>
                        <div className='other-images-preview'>
                            {office.additionalImageUrls.map((url, index) => (
                                <div key={index}>
                                    <img
                                        src={url}
                                        alt={`Preview ${index + 1}`}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <form className='form-section'>
                            <div className='form-group'>
                                <label htmlFor="title">오피스명</label>
                                <input
                                    type="text"
                                    id="title"
                                    value={office.title}
                                    readOnly
                                />
                            </div>
                            <div className='form-group'>
                                <label htmlFor="price">가격(일 단위)</label>
                                <input
                                    type="number"
                                    id="price"
                                    value={office.price}
                                    readOnly
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="address">주소</label>
                                <input
                                    type="text"
                                    id="address"
                                    value={office.address}
                                    readOnly
                                />
                                <input
                                    type="text"
                                    id="zipcode"
                                    value={office.zipcode}
                                    readOnly
                                />
                            </div>
                            <div className='form-group'>
                                <label htmlFor="content">설명</label>
                                <div className='editor-wrapper'>
                                    <Editor
                                        editorState={editorState}
                                        readOnly={true}
                                        toolbarHidden={true}
                                    />
                                </div>
                            </div>
                            <div className='form-group'>
                                <label htmlFor="capacity">수용인원</label>
                                <input
                                    type="number"
                                    id="capacity"
                                    value={office.capacity}
                                    readOnly
                                />
                            </div>
                        </form>
                        <div className='buttons'>
                            <button className='update-btn' onClick={handleAccept}>승인</button>
                            <button onClick={handleRefuse}>반려</button>
                            <button className='delete-btn' onClick={handleDelete}>삭제</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminOffice;
