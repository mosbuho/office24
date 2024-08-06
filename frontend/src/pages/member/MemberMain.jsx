import React, { useEffect, useState } from "react";
import { FaMapLocationDot } from "react-icons/fa6";
import KakaoMap from "../../components/member/KakaoMap";
import MemberFooter from "../../components/member/MemberFooter";
import MemberHeader from "../../components/member/MemberHeader";
import OfficeItem from "../../components/member/OfficeItem";
import "../../styles/pages/member/MemberMain.css";

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

function MemberMain() {
  // state //
  const [isMapExpanded, setIsMapExpanded] = useState(false);
  const [isMapFullExpanded, setIsMapFullExpanded] = useState(false);
  const [isButtonVisible, setIsButtonVisible] = useState(false);
  const [mapData, setMapData] = useState([]);

  useEffect(() => {
    // event handler: Scroll 이벤트 처리  //
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;

      const distanceFromBottom = documentHeight - (scrollTop + windowHeight);

      setIsButtonVisible(distanceFromBottom <= 1000);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  //function: 맵토글 함수//
  const toggleMap = () => {
    setIsMapExpanded(!isMapExpanded);
  };

  //function: 맵 풀사이즈토글 함수//
  const toggleMapFullExpanded = () => {
    setIsMapFullExpanded(!isMapFullExpanded);
  };

  useEffect(() => {
    setMapData(SearchResultMockData);
  }, []);

  return (
    //render 메인페이지 랜더링//
    <>
      <MemberHeader />

      <div className="member-main-page">
        <div className="main-container">
          {!isMapFullExpanded && (
            <div style={{ margin: "auto" }}>
              <div
                className={`office-item-list${
                  isMapExpanded ? " expanded" : ""
                }`}
              >
                {SearchResultMockData.map((item) => (
                  <OfficeItem key={item.id} {...item} />
                ))}
              </div>

              <div className="item-list-button-container">
                <button
                  className={`more-button ${isButtonVisible ? "visible" : ""}`}
                >
                  더보기
                </button>
                <button
                  className="expand-map-button"
                  onClick={() => toggleMap()}
                >
                  <FaMapLocationDot />
                </button>
              </div>
            </div>
          )}

          {isMapExpanded && (
            <div
              className={`map-container ${
                isMapFullExpanded ? "full-expanded" : ""
              }`}
            >
              <button
                className="map-button full-extend"
                onClick={() => toggleMapFullExpanded()}
              >
                {isMapFullExpanded ? "접기 >" : "< 확장"}{" "}
              </button>
              <KakaoMap mapData={mapData} />
            </div>
          )}
        </div>
      </div>
      <MemberFooter />
    </>
  );
}
export default MemberMain;
