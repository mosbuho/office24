import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import ManagerHeader from "../../components/manager/ManagerHeader";
import ManagerSidebar from "../../components/manager/ManagerSidebar";
import axios from '../../utils/axiosConfig';
import imageCompression from 'browser-image-compression';
import '../../styles/pages/manager/ManagerOfficeRegister.css';

const ManagerOfficeRegister = () => {
  const { no } = useParams();
  const navigate = useNavigate();
  const titleRef = useRef(null);
  const priceRef = useRef(null);
  const addressRef = useRef(null);
  const zipcodeRef = useRef(null);
  const contentRef = useRef(null);
  const capacityRef = useRef(null);
  const [sido, setSido] = useState('');  // useState로 sido 관리
  const [mainImage, setMainImage] = useState(null);
  const [additionalImages, setAdditionalImages] = useState([null, null, null]);
  const [mainImagePreview, setMainImagePreview] = useState(null);
  const [additionalImagesPreview, setAdditionalImagesPreview] = useState([null, null, null]);

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

        // 입력 필드에 주소를 설정
        addressRef.current.value = mainAddress;
        zipcodeRef.current.value = zipCode;
        setSido(sido);  // sido 상태 업데이트
      }
    }).open();
  };

  const compressImage = async (file) => {
    const options = {
      maxSizeMB: 1, 
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

  const handleMainImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const compressedFile = await compressImage(file);
      setMainImage(compressedFile);
      setMainImagePreview(URL.createObjectURL(compressedFile));
    } else {
      setMainImage(null);
      setMainImagePreview(null);
    }
  };

  const handleAdditionalImageChange = async (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const compressedFile = await compressImage(file);
      const updatedImages = [...additionalImages];
      const updatedPreviews = [...additionalImagesPreview];

      updatedImages[index] = compressedFile;
      updatedPreviews[index] = URL.createObjectURL(compressedFile);

      setAdditionalImages(updatedImages);
      setAdditionalImagesPreview(updatedPreviews);
    } else {
      const updatedImages = [...additionalImages];
      const updatedPreviews = [...additionalImagesPreview];

      updatedImages[index] = null;
      updatedPreviews[index] = null;

      setAdditionalImages(updatedImages);
      setAdditionalImagesPreview(updatedPreviews);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('title', titleRef.current.value);
    data.append('price', priceRef.current.value);
    data.append('address', addressRef.current.value);
    data.append('zipcode', zipcodeRef.current.value);
    data.append('sido', sido);  // 상태에 저장된 sido 값 전송
    data.append('content', contentRef.current.value);
    data.append('capacity', capacityRef.current.value);
    if (mainImage) {
      data.append('mainImage', mainImage);
    }
    additionalImages.forEach((image, index) => {
      if (image) {
        data.append(`additionalImages[${index}]`, image);
      }
    });

    try {
      const response = await axios.post(`/manager/office/register/${no}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('등록 완료 : ', response.data);
      navigate(`/manager/office/${no}`);
    } catch (error) {
      console.error("오피스 등록 중 오류 발생:", error);
      alert("오피스 등록 중 오류가 발생했습니다.");
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
              {additionalImagesPreview.map((preview, index) => (
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
              <label htmlFor="price">가격</label>
              <input type="number" id="price" ref={priceRef} className="input-price" placeholder="원" />
            </div>

            <div className="form-group">
              <label htmlFor="address">주소<button type="button" className="searchAddress" onClick={handleAddressSearch}>검색</button></label>
              <input type="text" id="address" ref={addressRef} className="input-address" placeholder="주소" />
              <input type="text" id="zipcode" ref={zipcodeRef} className="input-zipcode" placeholder="우편번호" />
            </div>

            <div className="form-group">
              <label htmlFor="content">설명</label>
              <textarea id="content" ref={contentRef} className="input-content" rows="3"></textarea>
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
                <div>
                  <label htmlFor="additionalImage3">기타 이미지</label>
                  <input type="file" id="additionalImage3" className="image-upload" onChange={(e) => handleAdditionalImageChange(e, 2)} />
                </div>
              </div>
            </div>
            <button type="submit" className="submit-button">등록</button>
          </form>
        </div>
      </div>
    </>
  );
}

export default ManagerOfficeRegister;
