import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaMapLocationDot } from "react-icons/fa6";
import KakaoMap from "../../components/member/KakaoMap";
import MemberFooter from "../../components/member/MemberFooter";
import MemberHeader from "../../components/member/MemberHeader";
import OfficeItem from "../../components/member/OfficeItem";
import "../../styles/pages/member/MemberMain.css";

function MemberMain() {
  const [isMapExpanded, setIsMapExpanded] = useState(false);
  const [isMapFullExpanded, setIsMapFullExpanded] = useState(false);
  const [isButtonVisible, setIsButtonVisible] = useState(false);
  const [mapData, setMapData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(24);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8080/office", {
          params: {
            page: currentPage,
            size: itemsPerPage,
          },
        });
        const data = response.data;

        if (Array.isArray(data)) {
          setMapData((prevData) => [...prevData, ...data]);
        } else {
          console.error("Expected an array but got:", data);
        }
      } catch (error) {
        console.error("데이터를 가져오는 중 에러가 발생했습니다:", error);
      }
    };

    fetchData();
  }, [currentPage]);

  useEffect(() => {
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

  const toggleMap = () => {
    setIsMapExpanded(!isMapExpanded);
  };

  const toggleMapFullExpanded = () => {
    setIsMapFullExpanded(!isMapFullExpanded);
  };

  const handleLoadMore = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const itemsInRow = 6;
  const dummyItems = Array(itemsInRow - (mapData.length % itemsInRow)).fill(null);

  return (
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
                    LOCATION={item.LOCATION}
                    PRICEPERDAY={item.PRICEPERDAY.toLocaleString()}
                    OFFICEIMGURL={item.OFFICEIMGURL}
                  />
                ))}
                {dummyItems.map((_, index) => (
                  <div key={`dummy-${index}`} className="office-item dummy"></div>
                ))}

              </div>

              <div className="item-list-button-container">
                <button
                  className={`more-button ${isButtonVisible ? "visible" : ""}`}
                  onClick={handleLoadMore}
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
