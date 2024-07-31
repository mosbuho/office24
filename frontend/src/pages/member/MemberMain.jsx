import React, { useEffect, useReducer, useState } from "react";
import MemberFooter from "../../components/member/MemberFooter";
import MemberHeader from "../../components/member/MemberHeader";
import OfficeItem from "../../components/member/OfficeItem";
import PopUpMSG from "../../components/member/PopUpMSG";
import PopUpQNA from "../../components/member/PopUpQNA";
import PopupPage from "../../components/member/PopupPage";
import "../../styles/pages/member/MemberMain.css";

const initialPopupState = {
  type: null,
  message: "",
};

const SearchResultMockData = [
  {
    id: 1,
    title: "강남역 사무실",
    rating: "4.5",
    noOfRating: "40",
    description: "강남역 사무실",
    location: "강남역",
    pricePerDay: "10000",
    officeImgURL: "/demooffice1.webp",
    xCoordinate: 127.058392,
    yCoordinate: 37.500454,
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
    xCoordinate: 126.923774,
    yCoordinate: 37.557534,
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
    xCoordinate: 127.10864,
    yCoordinate: 37.402111,
  },
  {
    id: 4,
    title: "역삼동 비즈니스 센터",
    rating: "4.6",
    noOfRating: "62",
    description: "역삼동 비즈니스 센터",
    location: "역삼동",
    pricePerDay: "13000",
    officeImgURL: "/demooffice4.webp",
    xCoordinate: 127.036346,
    yCoordinate: 37.501362,
  },
  {
    id: 5,
    title: "신촌 스터디룸",
    rating: "4.3",
    noOfRating: "33",
    description: "신촌 스터디룸",
    location: "신촌",
    pricePerDay: "8000",
    officeImgURL: "/demooffice5.webp",
    xCoordinate: 126.936893,
    yCoordinate: 37.555976,
  },
  {
    id: 6,
    title: "종로 공유 오피스",
    rating: "4.7",
    noOfRating: "48",
    description: "종로 공유 오피스",
    location: "종로",
    pricePerDay: "11000",
    officeImgURL: "/demooffice6.webp",
    xCoordinate: 126.981611,
    yCoordinate: 37.572025,
  },
  {
    id: 7,
    title: "성수동 창업 공간",
    rating: "4.4",
    noOfRating: "37",
    description: "성수동 창업 공간",
    location: "성수동",
    pricePerDay: "9000",
    officeImgURL: "/demooffice7.webp",
    xCoordinate: 127.055723,
    yCoordinate: 37.544323,
  },
  {
    id: 8,
    title: "여의도 비즈니스 센터",
    rating: "4.9",
    noOfRating: "72",
    description: "여의도 비즈니스 센터",
    location: "여의도",
    pricePerDay: "18000",
    officeImgURL: "/demooffice8.webp",
    xCoordinate: 126.925381,
    yCoordinate: 37.521624,
  },
  {
    id: 9,
    title: "강남 디자인 스튜디오",
    rating: "4.6",
    noOfRating: "51",
    description: "강남 디자인 스튜디오",
    location: "강남",
    pricePerDay: "14000",
    officeImgURL: "/demooffice9.webp",
    xCoordinate: 127.028461,
    yCoordinate: 37.497175,
  },
  {
    id: 10,
    title: "서초 법률 사무소",
    rating: "4.5",
    noOfRating: "43",
    description: "서초 법률 사무소",
    location: "서초",
    pricePerDay: "16000",
    officeImgURL: "/demooffice10.webp",
    xCoordinate: 127.007695,
    yCoordinate: 37.483577,
  },
  {
    id: 11,
    title: "광화문 비즈니스 라운지",
    rating: "4.8",
    noOfRating: "59",
    description: "광화문 비즈니스 라운지",
    location: "광화문",
    pricePerDay: "17000",
    officeImgURL: "/demooffice11.webp",
    xCoordinate: 126.976882,
    yCoordinate: 37.572768,
  },
  {
    id: 12,
    title: "이태원 글로벌 오피스",
    rating: "4.3",
    noOfRating: "31",
    description: "이태원 글로벌 오피스",
    location: "이태원",
    pricePerDay: "11000",
    officeImgURL: "/demooffice12.webp",
    xCoordinate: 126.994444,
    yCoordinate: 37.534722,
  },
  {
    id: 13,
    title: "명동 비즈니스 센터",
    rating: "4.7",
    noOfRating: "64",
    description: "명동 비즈니스 센터",
    location: "명동",
    pricePerDay: "15000",
    officeImgURL: "/demooffice13.webp",
    xCoordinate: 126.985833,
    yCoordinate: 37.563889,
  },
  {
    id: 14,
    title: "압구정 프리미엄 오피스",
    rating: "4.9",
    noOfRating: "78",
    description: "압구정 프리미엄 오피스",
    location: "압구정",
    pricePerDay: "20000",
    officeImgURL: "/demooffice14.webp",
    xCoordinate: 127.028611,
    yCoordinate: 37.527222,
  },
  {
    id: 15,
    title: "신사동 코워킹스페이스",
    rating: "4.5",
    noOfRating: "45",
    description: "신사동 코워킹스페이스",
    location: "신사동",
    pricePerDay: "13000",
    officeImgURL: "/demooffice15.webp",
    xCoordinate: 127.020833,
    yCoordinate: 37.516389,
  },
  {
    id: 16,
    title: "잠실 스타트업 허브",
    rating: "4.4",
    noOfRating: "39",
    description: "잠실 스타트업 허브",
    location: "잠실",
    pricePerDay: "12000",
    officeImgURL: "/demooffice16.webp",
    xCoordinate: 127.100278,
    yCoordinate: 37.513889,
  },
  {
    id: 17,
    title: "상암동 미디어 센터",
    rating: "4.6",
    noOfRating: "52",
    description: "상암동 미디어 센터",
    location: "상암동",
    pricePerDay: "14000",
    officeImgURL: "/demooffice17.webp",
    xCoordinate: 126.889444,
    yCoordinate: 37.579444,
  },
  {
    id: 18,
    title: "을지로 비즈니스 타워",
    rating: "4.7",
    noOfRating: "57",
    description: "을지로 비즈니스 타워",
    location: "을지로",
    pricePerDay: "16000",
    officeImgURL: "/demooffice18.webp",
    xCoordinate: 126.992778,
    yCoordinate: 37.566389,
  },
  {
    id: 19,
    title: "청담동 럭셔리 오피스",
    rating: "4.8",
    noOfRating: "68",
    description: "청담동 럭셔리 오피스",
    location: "청담동",
    pricePerDay: "22000",
    officeImgURL: "/demooffice19.webp",
    xCoordinate: 127.053611,
    yCoordinate: 37.525278,
  },
  {
    id: 20,
    title: "구로 디지털단지 오피스",
    rating: "4.3",
    noOfRating: "35",
    description: "구로 디지털단지 오피스",
    location: "구로",
    pricePerDay: "10000",
    officeImgURL: "/demooffice20.webp",
    xCoordinate: 126.897778,
    yCoordinate: 37.485556,
  },
  {
    id: 21,
    title: "마포 창업지원센터",
    rating: "4.5",
    noOfRating: "42",
    description: "마포 창업지원센터",
    location: "마포",
    pricePerDay: "9000",
    officeImgURL: "/demooffice21.webp",
    xCoordinate: 126.945556,
    yCoordinate: 37.556111,
  },
  {
    id: 22,
    title: "용산 IT 밸리 오피스",
    rating: "4.6",
    noOfRating: "49",
    description: "용산 IT 밸리 오피스",
    location: "용산",
    pricePerDay: "13000",
    officeImgURL: "/demooffice22.webp",
    xCoordinate: 126.965278,
    yCoordinate: 37.532778,
  },
  {
    id: 23,
    title: "송파 비즈니스 센터",
    rating: "4.4",
    noOfRating: "38",
    description: "송파 비즈니스 센터",
    location: "송파",
    pricePerDay: "11000",
    officeImgURL: "/demooffice23.webp",
    xCoordinate: 127.106389,
    yCoordinate: 37.514722,
  },
  {
    id: 24,
    title: "노원 스터디카페",
    rating: "4.2",
    noOfRating: "29",
    description: "노원 스터디카페",
    location: "노원",
    pricePerDay: "7000",
    officeImgURL: "/demooffice24.webp",
    xCoordinate: 127.061389,
    yCoordinate: 37.655556,
  },
  {
    id: 25,
    title: "강동 비즈니스 허브",
    rating: "4.5",
    noOfRating: "44",
    description: "강동 비즈니스 허브",
    location: "강동",
    pricePerDay: "10000",
    officeImgURL: "/demooffice25.webp",
    xCoordinate: 127.132778,
    yCoordinate: 37.530278,
  },
  {
    id: 26,
    title: "동대문 패션 비즈니스 센터",
    rating: "4.3",
    noOfRating: "36",
    description: "동대문 패션 비즈니스 센터",
    location: "동대문",
    pricePerDay: "12000",
    officeImgURL: "/demooffice26.webp",
    xCoordinate: 127.009722,
    yCoordinate: 37.566667,
  },
  {
    id: 27,
    title: "영등포 금융 비즈니스 센터",
    rating: "4.7",
    noOfRating: "58",
    description: "영등포 금융 비즈니스 센터",
    location: "영등포",
    pricePerDay: "15000",
    officeImgURL: "/demooffice27.webp",
    xCoordinate: 126.905556,
    yCoordinate: 37.516389,
  },
  {
    id: 28,
    title: "성북 대학가 스터디룸",
    rating: "4.1",
    noOfRating: "25",
    description: "성북 대학가 스터디룸",
    location: "성북",
    pricePerDay: "8000",
    officeImgURL: "/demooffice28.webp",
    xCoordinate: 127.016667,
    yCoordinate: 37.589722,
  },
  {
    id: 29,
    title: "중랑 창업 인큐베이터",
    rating: "4.2",
    noOfRating: "27",
    description: "중랑 창업 인큐베이터",
    location: "중랑",
    pricePerDay: "9000",
    officeImgURL: "/demooffice29.webp",
    xCoordinate: 127.092778,
    yCoordinate: 37.606389,
  },
  {
    id: 30,
    title: "은평 혁신파크 오피스",
    rating: "4.4",
    noOfRating: "41",
    description: "은평 혁신파크 오피스",
    location: "은평",
    pricePerDay: "10000",
    officeImgURL: "/demooffice30.webp",
    xCoordinate: 126.929722,
    yCoordinate: 37.637778,
  },
];

function MemberMain() {
  // state //
  const [isButtonVisible, setIsButtonVisible] = useState(false);
  const [popupState, dispatchPopup] = useReducer(
    popupReducer,
    initialPopupState
  );

  useEffect(() => {
    // event handler: Scroll 이벤트 처리  //
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;

      const distanceFromBottom = documentHeight - (scrollTop + windowHeight);

      setIsButtonVisible(distanceFromBottom <= 700 && distanceFromBottom >= 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  //  event handler: 팝업 상태 관리 리듀서 사용을 위한 핸들러 //
  const handlePopup = (type, message = "") => {
    dispatchPopup({ type, message });
  };

  //  function: 팝업 상태 관리 리듀서   //
  function popupReducer(state, action) {
    switch (action.type) {
      // case "LOGIN":
      //   return {
      //     type: "LOGIN",
      //     popupComponent: (
      //       <LoginPopup onClose={() => dispatchPopup({ type: "CLOSE" })} />
      //     ),
      //   };
      // case "REGISTER":
      //   return {
      //     type: "REGISTER",
      //     popupComponent: (
      //       <RegisterPopup onClose={() => dispatchPopup({ type: "CLOSE" })} />
      //     ),
      //   };
      case "QNA":
        return {
          type: "QNA",
          popupComponent: (
            <PopUpQNA onClose={() => dispatchPopup({ type: "CLOSE" })} />
          ),
          onClickBackground: () => dispatchPopup({ type: "CLOSE" }),
        };
      case "MSG":
        return {
          type: "MSG",
          popupComponent: (
            <PopUpMSG
              message={action.message}
              onClose={() => dispatchPopup({ type: "CLOSE" })}
            />
          ),
          onClickBackground: () => dispatchPopup({ type: "CLOSE" }),
        };
      case "CLOSE":
        return initialPopupState;
      default:
        return state;
    }
  }

  return (
    //render 메인페이지 랜더링//
    <div className="member-main-page">
      <MemberHeader handlePopup={handlePopup} />
      <div className="main-container">
        <div className="office-item-list">
          {SearchResultMockData.map((item) => (
            <OfficeItem key={item.id} {...item} />
          ))}{" "}
          <button className={`More-Button ${isButtonVisible ? "visible" : ""}`}>
            더보기
          </button>
        </div>
      </div>
      <PopupPage
        popupComponent={popupState.popupComponent}
        onClickBackground={popupState.onClickBackground}
      />
      <MemberFooter handlePopup={handlePopup} />
    </div>
  );
}

export default MemberMain;
