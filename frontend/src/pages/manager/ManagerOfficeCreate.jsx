import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import ManagerHeader from "../../components/manager/ManagerHeader";
import ManagerSidebar from "../../components/manager/ManagerSidebar";
import axios from '../../utils/axiosConfig';
import imageCompression from 'browser-image-compression';
import '../../styles/pages/manager/ManagerOfficeCreate.css';
import { getNo } from '../../utils/auth';
import { EditorState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

const ManagerOfficeCreate = () => {
  const no = getNo();
  const navigate = useNavigate();
  const titleRef = useRef(null);
  const priceRef = useRef(null);
  const addressRef = useRef(null);
  const zipcodeRef = useRef(null);
  const capacityRef = useRef(null);
  const [sido, setSido] = useState('');
  const [mainImage, setMainImage] = useState(null);
  const [additionalImages, setAdditionalImages] = useState([null, null, null]);
  const [mainImagePreview, setMainImagePreview] = useState(null);
  const [additionalImagesPreview, setAdditionalImagesPreview] = useState([null, null, null]);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const MAX_FILE_SIZE_MB = 5;
  const MAX_WIDTH = 1280;
  const MAX_HEIGHT = 720;

  useEffect(() => {
    document.body.classList.add('manager-office-body');
    const loadScript = (src, callback) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = callback;
      document.body.appendChild(script);
    };

    loadScript('https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js', () => {
      console.log('Kakao Address API loaded');
    });

    return () => {
      document.body.classList.remove('manager-office-body');
    };
  }, []);

  const handleAddressSearch = () => {
    new window.daum.Postcode({
      oncomplete: (data) => {
        const mainAddress = data.roadAddress || data.jibunAddress;
        const zipCode = data.zonecode;
        const sido = data.sido;

        addressRef.current.value = mainAddress;
        zipcodeRef.current.value = zipCode;
        setSido(sido);
      }
    }).open();
  };

  const compressImage = async (file) => {
    const options = {
      maxSizeMB: MAX_FILE_SIZE_MB,
      useWebWorker: true,
    };

    try {
      const compressedFile = await imageCompression(file, options);
      return compressedFile;
    } catch (error) {
      console.error("이미지 압축 중 오류 발생:", error);
      return file;
    }
  };

  const checkImageResolution = (file) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        if (img.width > MAX_WIDTH || img.height > MAX_HEIGHT) {
          reject(`이미지 해상도는 최대 ${MAX_WIDTH}x${MAX_HEIGHT}px이어야 합니다.`);
        } else {
          resolve();
        }
      };
    });
  };

  const handleMainImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        alert(`이미지 크기는 ${MAX_FILE_SIZE_MB}MB를 초과할 수 없습니다.`);
        return;
      }
      try {
        await checkImageResolution(file);
        const compressedFile = await compressImage(file);
        setMainImage(compressedFile);
        setMainImagePreview(URL.createObjectURL(compressedFile));
      } catch (error) {
        alert(error);
        setMainImage(null);
        setMainImagePreview(null);
      }
    } else {
      setMainImage(null);
      setMainImagePreview(null);
    }
  };

  const handleAdditionalImageChange = async (e, index) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        alert(`이미지 크기는 ${MAX_FILE_SIZE_MB}MB를 초과할 수 없습니다.`);
        return;
      }

      try {
        await checkImageResolution(file);
        const compressedFile = await compressImage(file);
        const updatedImages = [...additionalImages];
        const updatedPreviews = [...additionalImagesPreview];

        updatedImages[index] = compressedFile;
        updatedPreviews[index] = URL.createObjectURL(compressedFile);

        setAdditionalImages(updatedImages);
        setAdditionalImagesPreview(updatedPreviews);
      } catch (error) {
        alert(error);
        const updatedImages = [...additionalImages];
        const updatedPreviews = [...additionalImagesPreview];

        updatedImages[index] = null;
        updatedPreviews[index] = null;

        setAdditionalImages(updatedImages);
        setAdditionalImagesPreview(updatedPreviews);
      }
    } else {
      const updatedImages = [...additionalImages];
      const updatedPreviews = [...additionalImagesPreview];

      updatedImages[index] = null;
      updatedPreviews[index] = null;

      setAdditionalImages(updatedImages);
      setAdditionalImagesPreview(updatedPreviews);
    }
  };

  const handleEditorChange = (editorState) => {
    setEditorState(editorState);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !titleRef.current.value.trim() ||
      !priceRef.current.value.trim() ||
      !addressRef.current.value.trim() ||
      !zipcodeRef.current.value.trim() ||
      !capacityRef.current.value.trim()
    ) {
      alert("모든 필수 항목을 입력해 주세요.");
      return;
    }

    const contentState = editorState.getCurrentContent();
    const contentRaw = JSON.stringify(convertToRaw(contentState));

    const data = new FormData();
    data.append('title', titleRef.current.value);
    data.append('price', priceRef.current.value);
    data.append('address', addressRef.current.value);
    data.append('zipcode', zipcodeRef.current.value);
    data.append('sido', sido);
    data.append('content', contentRaw);
    data.append('capacity', capacityRef.current.value);

    if (mainImage) {
      data.append('mainImage', mainImage);
    }

    additionalImages.forEach((image, index) => {
      if (image) {
        data.append(`additionalImages[]`, image);
      }
    });

    for (let [key, value] of data.entries()) {
      console.log(`${key}: ${value.name || value}`);
    }

    try {
      const response = await axios.post(`/manager/${no}/office/create`, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      alert(response.data);
      navigate(`/manager/office`);
    } catch (error) {
      console.error("오피스 등록 중 오류 발생:", error);
      alert("오피스 등록 중 오류가 발생했습니다.");
    }
  };

  const handleCancel = () => {
    if (window.confirm("정말로 취소하시겠습니까? 변경사항이 저장되지 않습니다.")) {
      navigate(`/manager/office/${no}`);
    }
  };

  return (
    <>
      <ManagerSidebar />
      <ManagerHeader />
      <div className="managerOfficeRegister-container">
        <div className="headernav">
          <ul>
            <li>신규 등록</li>
          </ul>
        </div>
        <div className="registerForm">
          <div className="image-preview-section">
            <div className="main-image-preview">
              {mainImagePreview ? (
                <img src={mainImagePreview} alt="대표 이미지 미리보기" />
              ) : (
                "대표이미지 미리보기"
              )}
            </div>
            <div className="other-images-preview">
              {additionalImagesPreview.slice(0, 2).map((preview, index) => (
                preview ? (
                  <img key={index} src={preview} alt={`기타 이미지 ${index + 1}`} />
                ) : (
                  <div key={index}>{`기타 이미지 ${index + 1}`}</div>
                )
              ))}
            </div>
          </div>
          <form className="form-section" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title">오피스명</label>
              <input type="text" id="title" ref={titleRef} className="input-title" placeholder="예시) 내일 오피스" />
            </div>

            <div className="form-group">
              <label htmlFor="price">가격 (일 단위)</label>
              <input type="number" id="price" ref={priceRef} className="input-price" placeholder="원" />
            </div>

            <div className="form-group">
              <label htmlFor="address">주소<button type="button" className="searchAddress" onClick={handleAddressSearch}>검색</button></label>
              <input type="text" id="address" ref={addressRef} className="input-address" placeholder="주소" />
              <input type="text" id="zipcode" ref={zipcodeRef} className="input-zipcode" placeholder="우편번호" />
            </div>

            <div className="form-group">
              <label htmlFor="content">설명</label>
              <div className="draft-editor">
                <Editor
                  placeholder="내용을 작성해주세요."
                  editorState={editorState}
                  onEditorStateChange={handleEditorChange}
                  editorStyle={{
                    height: "100px",
                    border: "1px solid lightgray",
                    padding: "5px",
                  }}
                  toolbar={{
                    options: ['inline', 'blockType', 'list', 'textAlign', 'history'],
                    inline: { options: ['bold', 'italic', 'underline'] },
                    blockType: { inDropdown: true },
                    list: { options: ['unordered', 'ordered'] },
                    textAlign: { options: ['left', 'center', 'right'] },
                    history: { options: ['undo', 'redo'] },
                  }}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="capacity">수용인원</label>
              <input type="number" id="capacity" ref={capacityRef} className="input-capacity" placeholder="명" />
            </div>

            <div className="form-group">
              <div className="images-section">
                <div>
                  <label htmlFor="mainImage">대표 이미지</label>
                  <input type="file" id="mainImage" className="image-upload" onChange={handleMainImageChange} />
                </div>
                <div>
                  <label htmlFor="additionalImage1">기타 이미지</label>
                  <input type="file" id="additionalImage1" className="image-upload" onChange={(e) => handleAdditionalImageChange(e, 0)} />
                </div>
                <div>
                  <label htmlFor="additionalImage2">기타 이미지</label>
                  <input type="file" id="additionalImage2" className="image-upload" onChange={(e) => handleAdditionalImageChange(e, 1)} />
                </div>
              </div>
            </div>
            <div className="button-group">
              <button type="submit" className="submit-button">등록</button>
              <button type="button" className="cancel-button" onClick={handleCancel}>취소</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default ManagerOfficeCreate;
