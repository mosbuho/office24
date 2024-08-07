import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaMapLocationDot } from "react-icons/fa6";
import KakaoMap from "../../components/member/KakaoMap";
import MemberFooter from "../../components/member/MemberFooter";
import MemberHeader from "../../components/member/MemberHeader";
import OfficeItem from "../../components/member/OfficeItem";
import "../../styles/pages/member/MemberMain.css";

function MemberMain() {
  // state //
  const [isMapExpanded, setIsMapExpanded] = useState(false);
  const [isMapFullExpanded, setIsMapFullExpanded] = useState(false);
  const [isButtonVisible, setIsButtonVisible] = useState(false);
  const [mapData, setMapData] = useState([]);

  useEffect(() => {
    // 데이터 가져오기
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8080/office");
        const data = response.data;
        console.log(data); //log
        // 데이터가 배열인지 확인
        if (Array.isArray(data)) {
          setMapData(data);
        } else {
          console.error("Expected an array but got:", data);
          setMapData([]);
        }
      } catch (error) {
        console.error("데이터를 가져오는 중 에러가 발생했습니다:", error);
      }
    };

    fetchData();
  }, []);

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

  return (
    //render 메인페이지 랜더링//
    <>
      <MemberHeader />

      <div className="member-main-page">
        <div className="main-container">
          {!isMapFullExpanded && (
            <div style={{ margin: "auto" }}>
              <div
                className={`office-item-list${isMapExpanded ? " expanded" : ""
                  }`}
              >
                {mapData.map((item, index) => (
                  <OfficeItem
                    key={index}
                    NO={item.NO}
                    TITLE={item.TITLE}
                    RATING={item.RATING}
                    NOOFRATING={item.NOOFRATING}
                    LOCATION={item.LOCATION}
                    PRICEPERDAY={item.PRICEPERDAY}
                    OFFICEIMGURL={item.OFFICEIMGURL}
                    LONGITUDE={item.LONGITUDE}
                    LATITUDE={item.LATITUDE}
                  />
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
              className={`map-container ${isMapFullExpanded ? "full-expanded" : ""
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
