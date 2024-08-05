import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from '../../utils/axiosConfig';
import ManagerSidebar from '../../components/manager/ManagerSidebar';
import ManagerHeader from "../../components/manager/ManagerHeader";
import '../../styles/pages/manager/ManagerOfficeUpdate.css';

const ManagerOfficeUpdate = () => {
  const { no, officeNo } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [address, setAddress] = useState('');
  const [zipcode, setZipcode] = useState('');
  const [sido, setSido] = useState('');
  const [content, setContent] = useState('');
  const [capacity, setCapacity] = useState('');
  const [mainImageUrl, setMainImageUrl] = useState('');
  const [additionalImageUrls, setAdditionalImageUrls] = useState(['', '']);
  const [mainImage, setMainImage] = useState(null);
  const [additionalImages, setAdditionalImages] = useState([null, null]);

  useEffect(() => {
    const fetchOfficeDetails = async () => {
      try {
        const { data } = await axios.get(`/manager/office/info/${officeNo}`, {
          withCredentials: true,
        });

        setTitle(data.title || '');
        setPrice(data.price || '');
        setAddress(data.address || '');
        setZipcode(data.zipCode || '');
        setSido(data.sido || '');
        setContent(data.content || '');
        setCapacity(data.capacity || '');
        setMainImageUrl(data.titleImg ? `http://localhost:8080/img/${data.titleImg}` : '');
        setAdditionalImageUrls(data.additionalImageUrls.map(url => url ? `http://localhost:8080/img/${url}` : ''));

      } catch (error) {
        console.error("Error fetching office details:", error);
      }
    };

    fetchOfficeDetails();

    const loadScript = (src, callback) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = callback;
      document.body.appendChild(script);
    };

    loadScript('https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js', () => {
    });

  }, [officeNo]);

  const handleImageChange = (e, setter) => {
    const file = e.target.files[0];
    if (file) {
      setter(file);
    }
  };

  const handleAddressSearch = () => {
    new window.daum.Postcode({
      oncomplete: (data) => {
        const mainAddress = data.roadAddress || data.jibunAddress;
        const zipCode = data.zonecode;
        const sido = data.sido;

        setAddress(mainAddress);
        setZipcode(zipCode);
        setSido(sido);
      }
    }).open();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('price', price);
    formData.append('address', address);
    formData.append('zipcode', zipcode);
    formData.append('sido', sido);
    formData.append('content', content);
    formData.append('capacity', capacity);

    const extractFileName = (url) => {
      const lastSlashIndex = url.lastIndexOf('/');
      return url.substr(lastSlashIndex + 1);
    };

    if (mainImage) {
      formData.append('mainImage', mainImage);
      formData.append('existingMainImage', extractFileName(mainImageUrl));
    } else {
      const mainImageFileName = extractFileName(mainImageUrl);
      formData.append('existingMainImage', mainImageFileName);
    }

    additionalImages.forEach((image, index) => {
      if (image) {
        formData.append('additionalImages[]', image);
      } else if (additionalImageUrls[index]) {
        const additionalImageFileName = extractFileName(additionalImageUrls[index]);
        formData.append('existingAdditionalImages[]', additionalImageFileName);
      }
    });

    try {
      await axios.put(`/manager/office/update/${no}/${officeNo}`, formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert("해당 오피스의 정보가 수정되었습니다.");
      navigate(`/manager/office/${no}`);
    } catch (error) {
      console.error("Error updating office:", error);
      alert("해당 오피스의 정보 수정에 실패하였습니다.");
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
      <div className='managerOfficeUpdate-container'>
        <div className='headernav'>
          <ul>
            <li className="active">오피스 수정</li>
          </ul>
        </div>
        <div className='registerForm'>
          <div className='image-preview-section'>
            <div className='main-image-preview'>
              <img
                src={mainImage ? URL.createObjectURL(mainImage) : mainImageUrl}
                alt="Main Preview"
              />
            </div>
            <div className='other-images-preview'>
              {additionalImages.map((image, index) => (
                <div key={index}>
                  <img
                    src={image ? URL.createObjectURL(image) : additionalImageUrls[index]}
                    alt={`Preview ${index + 1}`}
                  />
                </div>
              ))}
            </div>
          </div>
          <form className='form-section' onSubmit={handleSubmit}>
            <div className='form-group'>
              <label htmlFor="title">오피스명</label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className='form-group'>
              <label htmlFor="price">가격(일 단위)</label>
              <input
                type="number"
                id="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="address">주소<button type="button" onClick={handleAddressSearch}>검색</button></label>
              <input
                type="text"
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
              <input
                type="text"
                id="zipcode"
                value={zipcode || ''}
                onChange={(e) => setZipcode(e.target.value)}
              />
            </div>
            <div className='form-group'>
              <label htmlFor="content">설명</label>
              <textarea
                id="content"
                rows="4"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              ></textarea>
            </div>
            <div className='form-group'>
              <label htmlFor="capacity">수용인원</label>
              <input
                type="number"
                id="capacity"
                placeholder='people'
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
              />
            </div>
            <div className='form-group'>
              <div className="images-section">
                <div>
                  <label htmlFor="mainImage">대표 이미지</label>
                  <input
                    type="file"
                    id="mainImage"
                    onChange={(e) => handleImageChange(e, setMainImage)}
                  />
                </div>
                {additionalImages.map((_, index) => (
                  <div key={index}>
                    <label htmlFor={`additionalImage${index + 1}`}>기타 이미지 {index + 1}</label>
                    <input
                      type="file"
                      id={`additionalImage${index + 1}`}
                      onChange={(e) => handleImageChange(e, (file) => {
                        const newImages = [...additionalImages];
                        newImages[index] = file;
                        setAdditionalImages(newImages);
                      })}
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className='button-group'>
              <button className='submit-button' type="submit">수정</button>
              <button type="button" className="cancel-button" onClick={handleCancel}>취소</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ManagerOfficeUpdate;
