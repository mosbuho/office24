import React, { useReducer, useState } from "react";
import { IoCloseCircle } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import MemberFooter from "../../components/member/MemberFooter";
import MemberHeader from "../../components/member/MemberHeader";
import OfficeItem from "../../components/member/OfficeItem";
import "../../styles/pages/member/MemberMyPage.css";
const OfficeMockData = [
  {
    id: 1,
    title: "강남역 사무실",
    rating: "4.5",
    noOfRating: "40",
    description: "강남역 사무실",
    location: "강남역",
    pricePerDay: "10000",
    officeImgURL: "/demooffice1.webp",
    longitude: 127.058392,
    latitude: 37.500454,
  },
  {
    id: 2,
    title: "홍대입구 코워킹스페이스",
    rating: "4.8",
    noOfRating: "55",
    description: "홍대입구 코워킹스페이스",
    location: "홍대입구",
    pricePerDay: "12000",
    officeImgURL: "/demooffice2.webp",
    longitude: 126.9237741555385,
    latitude: 37.5575341555385,
  },
  {
    id: 3,
    title: "판교 스타트업 오피스",
    rating: "4.2",
    noOfRating: "28",
    description: "판교 스타트업 오피스",
    location: "판교",
    pricePerDay: "15000",
    officeImgURL: "/demooffice3.webp",
    longitude: 127.108641555385,
    latitude: 37.4021111555385,
  },
  {
    id: 4,
    title: "역삼동 비즈니스 센터",
    rating: "4.6",
    noOfRating: "62",
    description: "역삼동 비즈니스 센터",
    location: "역삼동",
    pricePerDay: "13000",
    officeImgURL: "/demooffice2.webp",
    longitude: 127.0363461555385,
    latitude: 37.5013621555385,
  },
  {
    id: 5,
    title: "신촌 스터디룸",
    rating: "4.3",
    noOfRating: "33",
    description: "신촌 스터디룸",
    location: "신촌",
    pricePerDay: "8000",
    officeImgURL: "/demooffice1.webp",
    longitude: 126.9368931555385,
    latitude: 37.5559761555385,
  },
  {
    id: 6,
    title: "종로 공유 오피스",
    rating: "4.7",
    noOfRating: "48",
    description: "종로 공유 오피스",
    location: "종로",
    pricePerDay: "11000",
    officeImgURL: "/demooffice3.webp",
    longitude: 126.9816111555385,
    latitude: 37.5720251555385,
  },
  {
    id: 7,
    title: "성수동 창업 공간",
    rating: "4.4",
    noOfRating: "37",
    description: "성수동 창업 공간",
    location: "성수동",
    pricePerDay: "9000",
    officeImgURL: "/demooffice1.webp",
    longitude: 127.0557231555385,
    latitude: 37.5443231555385,
  },
  {
    id: 8,
    title: "여의도 비즈니스 센터",
    rating: "4.9",
    noOfRating: "72",
    description: "여의도 비즈니스 센터",
    location: "여의도",
    pricePerDay: "18000",
    officeImgURL: "/demooffice2.webp",
    longitude: 126.9253811555385,
    latitude: 37.5216241555385,
  },
  {
    id: 9,
    title: "강남 디자인 스튜디오",
    rating: "4.6",
    noOfRating: "51",
    description: "강남 디자인 스튜디오",
    location: "강남",
    pricePerDay: "14000",
    officeImgURL: "/demooffice3.webp",
    longitude: 127.028461,
    latitude: 37.497175,
  },
  {
    id: 10,
    title: "서초 법률 사무소",
    rating: "4.5",
    noOfRating: "43",
    description: "서초 법률 사무소",
    location: "서초",
    pricePerDay: "16000",
    officeImgURL: "/demooffice1.webp",
    longitude: 127.0076951555385,
    latitude: 37.4835771555385,
  },
  {
    id: 11,
    title: "광화문 비즈니스 라운지",
    rating: "4.8",
    noOfRating: "59",
    description: "광화문 비즈니스 라운지",
    location: "광화문",
    pricePerDay: "17000",
    officeImgURL: "/demooffice1.webp",
    longitude: 126.9768821555385,
    latitude: 37.5727681555385,
  },
  {
    id: 12,
    title: "이태원 글로벌 오피스",
    rating: "4.3",
    noOfRating: "31",
    description: "이태원 글로벌 오피스",
    location: "이태원",
    pricePerDay: "11000",
    officeImgURL: "/demooffice2.webp",
    longitude: 126.9944441555385,
    latitude: 37.5347221555385,
  },
  {
    id: 13,
    title: "명동 비즈니스 센터",
    rating: "4.7",
    noOfRating: "64",
    description: "명동 비즈니스 센터",
    location: "명동",
    pricePerDay: "15000",
    officeImgURL: "/demooffice2.webp",
    longitude: 126.9858331555385,
    latitude: 37.5638891555385,
  },
  {
    id: 14,
    title: "압구정 프리미엄 오피스",
    rating: "4.9",
    noOfRating: "78",
    description: "압구정 프리미엄 오피스",
    location: "압구정",
    pricePerDay: "20000",
    officeImgURL: "/demooffice2.webp",
    longitude: 127.0286111555385,
    latitude: 37.5272221555385,
  },
  {
    id: 15,
    title: "신사동 코워킹스페이스",
    rating: "4.5",
    noOfRating: "45",
    description: "신사동 코워킹스페이스",
    location: "신사동",
    pricePerDay: "13000",
    officeImgURL: "/demooffice1.webp",
    longitude: 127.0208331555385,
    latitude: 37.5163891555385,
  },
  {
    id: 16,
    title: "잠실 스타트업 허브",
    rating: "4.4",
    noOfRating: "39",
    description: "잠실 스타트업 허브",
    location: "잠실",
    pricePerDay: "12000",
    officeImgURL: "/demooffice2.webp",
    longitude: 127.1002781555385,
    latitude: 37.5138891555385,
  },
  {
    id: 17,
    title: "상암동 미디어 센터",
    rating: "4.6",
    noOfRating: "52",
    description: "상암동 미디어 센터",
    location: "상암동",
    pricePerDay: "14000",
    officeImgURL: "/demooffice3.webp",
    longitude: 126.8894441555385,
    latitude: 37.5794441555385,
  },
  {
    id: 18,
    title: "을지로 비즈니스 타워",
    rating: "4.7",
    noOfRating: "57",
    description: "을지로 비즈니스 타워",
    location: "을지로",
    pricePerDay: "16000",
    officeImgURL: "/demooffice2.webp",
    longitude: 126.9927781555385,
    latitude: 37.5663891555385,
  },
  {
    id: 19,
    title: "청담동 럭셔리 오피스",
    rating: "4.8",
    noOfRating: "68",
    description: "청담동 럭셔리 오피스",
    location: "청담동",
    pricePerDay: "22000",
    officeImgURL: "/demooffice1.webp",
    longitude: 127.0536111555385,
    latitude: 37.5252781555385,
  },
  {
    id: 20,
    title: "구로 디지털단지 오피스",
    rating: "4.3",
    noOfRating: "35",
    description: "구로 디지털단지 오피스",
    location: "구로",
    pricePerDay: "10000",
    officeImgURL: "/demooffice2.webp",
    longitude: 126.8977781555385,
    latitude: 37.4855561555385,
  },
  {
    id: 21,
    title: "마포 창업지원센터",
    rating: "4.5",
    noOfRating: "42",
    description: "마포 창업지원센터",
    location: "마포",
    pricePerDay: "9000",
    officeImgURL: "/demooffice3.webp",
    longitude: 126.9455561555385,
    latitude: 37.5561111555385,
  },
  {
    id: 22,
    title: "용산 IT 밸리 오피스",
    rating: "4.6",
    noOfRating: "49",
    description: "용산 IT 밸리 오피스",
    location: "용산",
    pricePerDay: "13000",
    officeImgURL: "/demooffice3.webp",
    longitude: 126.9652781555385,
    latitude: 37.5327781555385,
  },
  {
    id: 23,
    title: "송파 비즈니스 센터",
    rating: "4.4",
    noOfRating: "38",
    description: "송파 비즈니스 센터",
    location: "송파",
    pricePerDay: "11000",
    officeImgURL: "/demooffice2.webp",
    longitude: 127.1063891555385,
    latitude: 37.5147221555385,
  },
  {
    id: 24,
    title: "노원 스터디카페",
    rating: "4.2",
    noOfRating: "29",
    description: "노원 스터디카페",
    location: "노원",
    pricePerDay: "7000",
    officeImgURL: "/demooffice1.webp",
    longitude: 127.0613891555385,
    latitude: 37.6555561555385,
  },
];
const popupReducer = (state, action) => {
  switch (action.type) {
    case "OPEN_POPUP":
      return {
        ...state,
        openPopup: action.field,
        [action.field]: action.value,
      };
    case "CLOSE_POPUP":
      return { ...state, openPopup: null };
    case "UPDATE_VALUE":
      return { ...state, [state.openPopup]: action.value };
    default:
      return state;
  }
};
function PhonePopup({ initialValue, onSave, onClose }) {
  const [phone, setPhone] = useState(initialValue);
  const [error, setError] = useState("");

  const validatePhone = (value) => {
    const phonePattern = /^01[016789]\d{7,8}$/;
    return phonePattern.test(value.replace(/-/g, ""));
  };

  const formatPhone = (value) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length <= 3) {
      return cleaned;
    } else if (cleaned.length <= 7) {
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
    } else {
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(
        7,
        11
      )}`;
    }
  };

  const handleChange = (e) => {
    const formattedPhone = formatPhone(e.target.value);
    setPhone(formattedPhone);
    setError(
      validatePhone(formattedPhone) ? "" : "올바른 전화번호 형식이 아닙니다."
    );
  };

  const handleSave = () => {
    if (validatePhone(phone)) {
      onSave("phone", phone.replace(/-/g, ""));
      onClose();
    } else {
      setError("올바른 전화번호 형식이 아닙니다.");
    }
  };

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup" onClick={(e) => e.stopPropagation()}>
        <div className="popup-header">
          <h3>전화번호 수정</h3>
          <button className="popup-close" onClick={onClose}>
            <IoCloseCircle />
          </button>
        </div>
        <div className="popup-content">
          <div className="popup-form">
            <input
              type="tel"
              value={phone}
              onChange={handleChange}
              placeholder="010-1234-5678"
            />
            {error && <p className="error">{error}</p>}
            <div className="popup-buttons">
              <button onClick={onClose}>취소</button>
              <button onClick={handleSave}>저장</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function EmailPopup({ initialValue, onSave, onClose }) {
  const [email, setEmail] = useState(initialValue);
  const [error, setError] = useState("");

  const validateEmail = (value) => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(value);
  };

  const handleSave = () => {
    if (validateEmail(email)) {
      onSave("email", email);
      onClose();
    } else {
      setError("올바른 이메일 주소를 입력해주세요.");
    }
  };
  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup" onClick={(e) => e.stopPropagation()}>
        <div className="popup-header">
          <h3>이메일 수정</h3>
          <button className="popup-close" onClick={onClose}>
            <IoCloseCircle />
          </button>
        </div>
        <div className="popup-content">
          <div className="popup-form">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {error && <p className="error">{error}</p>}
            <div className="popup-buttons">
              <button onClick={onClose}>취소</button>
              <button onClick={handleSave}>저장</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
function NamePopup({ initialValue, onSave, onClose }) {
  const [name, setName] = useState(initialValue);
  const [error, setError] = useState("");

  const validateName = (value) => {
    const namePattern = /^[가-힣]{2,12}$/;
    return namePattern.test(value);
  };

  const handleSave = () => {
    if (validateName(name)) {
      onSave("name", name);
      onClose();
    } else {
      setError("2자 이상 12자 이하의 한글만 가능합니다.");
    }
  };

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup" onClick={(e) => e.stopPropagation()}>
        <div className="popup-header">
          <h3>이름 수정</h3>
          <button className="popup-close" onClick={onClose}>
            <IoCloseCircle />
          </button>
        </div>
        <div className="popup-content">
          <div className="popup-form">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {error && <p className="error">{error}</p>}
            <div className="popup-buttons">
              <button onClick={onClose}>취소</button>
              <button onClick={handleSave}>저장</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
function BirthPopup({ initialValue, onSave, onClose }) {
  const [birth, setBirth] = useState(initialValue);
  const [error, setError] = useState("");

  const validateBirth = (value) => {
    const birthPattern = /^\d{4}-\d{2}-\d{2}$/;
    return birthPattern.test(value);
  };

  const handleSave = () => {
    if (validateBirth(birth)) {
      onSave("birth", birth);
      onClose();
    } else {
      setError("올바른 생년월일 형식(YYYY-MM-DD)으로 입력해주세요.");
    }
  };

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup" onClick={(e) => e.stopPropagation()}>
        <div className="popup-header">
          <h3>생년월일 수정</h3>
          <button className="popup-close" onClick={onClose}>
            <IoCloseCircle />
          </button>
        </div>
        <div className="popup-content">
          <div className="popup-form">
            <input
              type="text"
              value={birth}
              onChange={(e) => setBirth(e.target.value)}
            />
            {error && <p className="error">{error}</p>}
            <div className="popup-buttons">
              <button onClick={onClose}>취소</button>
              <button onClick={handleSave}>저장</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
function OfficeList({ offices }) {
  return (
    <div className="office-item-list sub">
      {offices.map((item) => (
        <OfficeItem key={item.id} {...item} />
      ))}
    </div>
  );
}
function ViewInfo({ mockMemberData, updateMemberData }) {
  const [popupState, dispatch] = useReducer(popupReducer, {
    openPopup: null,
    phone: "",
    email: "",
    name: "",
    birth: "",
  });

  const [activePopup, setActivePopup] = useState(null);

  const handleEdit = (field) => {
    setActivePopup(field);
  };

  const handleSave = (field, value) => {
    updateMemberData(field, value);
    setActivePopup(null);
  };

  const handleClose = () => {
    setActivePopup(null);
  };

  return (
    <div className="info-container">
      <h2>내 정보</h2>
      <div className="info-row">
        <label>아이디:</label>
        <span>{mockMemberData.id}</span>
      </div>
      <div className="info-row bt">
        <label>비밀번호 변경</label>
      </div>
      <div className="info-row" onClick={() => handleEdit("name")}>
        <label>이름:</label>
        <span>{mockMemberData.name}</span>
        <u>수정</u>
      </div>
      <div className="info-row" onClick={() => handleEdit("phone")}>
        <label>전화번호:</label>
        <span>{mockMemberData.phone}</span>
        <u>수정</u>
      </div>
      <div className="info-row" onClick={() => handleEdit("email")}>
        <label>이메일:</label>
        <span>{mockMemberData.email}</span>
        <u>수정</u>
      </div>
      <div className="info-row" onClick={() => handleEdit("birth")}>
        <label>생년월일:</label>
        <span>{mockMemberData.birth}</span>
        <u>수정</u>
      </div>

      <div className="info-row bt">
        <label>변경사항 적용</label>
      </div>

      <div className="info-row">
        <label>성별:</label>
        <span>{mockMemberData.gender === "M" ? "남성" : "여성"}</span>
      </div>
      <div className="info-row">
        <label>가입일:</label>
        <span>{mockMemberData.reg_date}</span>
      </div>
      <div className="info-row bt">
        <label>변경사항 적용</label>
      </div>
      {activePopup === "phone" && (
        <PhonePopup
          initialValue={mockMemberData.phone}
          onSave={handleSave}
          onClose={handleClose}
        />
      )}
      {activePopup === "email" && (
        <EmailPopup
          initialValue={mockMemberData.email}
          onSave={handleSave}
          onClose={handleClose}
        />
      )}
      {activePopup === "name" && (
        <NamePopup
          initialValue={mockMemberData.name}
          onSave={handleSave}
          onClose={handleClose}
        />
      )}
      {activePopup === "birth" && (
        <BirthPopup
          initialValue={mockMemberData.birth}
          onSave={handleSave}
          onClose={handleClose}
        />
      )}
    </div>
  );
}
function Favorites() {
  return (
    <div>
      <h2>찜 목록</h2>
      <OfficeList offices={OfficeMockData} />
    </div>
  );
}
function Reservations() {
  return <h2>예약 내역 확인</h2>;
}
function Reviews() {
  return <h2>리뷰 작성 내역</h2>;
}
function MemberMyPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("viewInfo");
  const [mockMemberData, setMockMemberData] = useState({
    no: 1,
    id: "user123",
    name: "홍길동",
    phone: "010-1234-5678",
    email: "user123@example.com",
    birth: "1990-01-01",
    gender: "M",
    reg_date: "2023-05-01",
  });

  const updateMemberData = (field, value) => {
    setMockMemberData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const tabs = [
    { id: "viewInfo", label: "내 정보" },
    { id: "favorites", label: "찜 목록" },
    { id: "reservations", label: "예약 내역" },
    { id: "reviews", label: "내가 쓴 리뷰" },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "viewInfo":
        return (
          <ViewInfo
            mockMemberData={mockMemberData}
            updateMemberData={updateMemberData}
          />
        );
      case "reservations":
        return <Reservations />;
      case "reviews":
        return <Reviews />;
      case "favorites":
        return <Favorites />;
      default:
        return null;
    }
  };

  return (
    <div className="member-my-page">
      <MemberHeader />
      <main className="member-content-wrapper">
        <section className="tab-container">
          <div className="tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`tab ${activeTab === tab.id ? "active" : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </section>
        <section className="tab-content">{renderTabContent()}</section>
      </main>
      <MemberFooter />
    </div>
  );
}

export default MemberMyPage;
