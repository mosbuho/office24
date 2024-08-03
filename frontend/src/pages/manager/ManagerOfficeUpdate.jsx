import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from '../../utils/axiosConfig';
import ManagerSidebar from '../../components/manager/ManagerSidebar';
import ManagerHeader from "../../components/manager/ManagerHeader";
import '../../styles/pages/manager/ManagerOfficeUpdate.css';

const ManagerOfficeUpdate = () => {
  const { no, officeNo } = useParams();
  const navigate = useNavigate();

  // Individual state management
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

        // Set office data
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
      setter(file);  // Update the actual file (used for form submission)
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
      formData.append('mainImage', mainImage);  // 저장할 메인 이미지
      formData.append('existingMainImage', extractFileName(mainImageUrl)); // 삭제할 메인 이미지
    } else {
      const mainImageFileName = extractFileName(mainImageUrl); // 파일 이름만 추출
      formData.append('existingMainImage', mainImageFileName);
    }

    additionalImages.forEach((image, index) => {
      if (image) {
        formData.append('additionalImages[]', image);  // Add the actual file
      } else if (additionalImageUrls[index]) {
        const additionalImageFileName = extractFileName(additionalImageUrls[index]); // 파일 이름만 추출
        formData.append('existingAdditionalImages[]', additionalImageFileName);  // Use the existing image URL
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

  return (
    <>
      <ManagerSidebar />
      <ManagerHeader />
      <div className='managerOfficeRegister-container'>
        <div className='headernav'>
          <ul>
            <li className="active">Update Office Information</li>
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
              <label htmlFor="title">Office Name</label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className='form-group'>
              <label htmlFor="price">Price (per day)</label>
              <input
                type="number"
                id="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="address">Address<button type="button" onClick={handleAddressSearch}>Search</button></label>
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
              <label htmlFor="content">Description</label>
              <textarea
                id="content"
                rows="4"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              ></textarea>
            </div>
            <div className='form-group'>
              <label htmlFor="capacity">Capacity</label>
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
                  <label htmlFor="mainImage">Main Image</label>
                  <input
                    type="file"
                    id="mainImage"
                    onChange={(e) => handleImageChange(e, setMainImage)}
                  />
                </div>
                {additionalImages.map((_, index) => (
                  <div key={index}>
                    <label htmlFor={`additionalImage${index + 1}`}>Additional Image {index + 1}</label>
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
            <button className='submit-button' type="submit">Update</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ManagerOfficeUpdate;
