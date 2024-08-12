import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FaMapLocationDot } from "react-icons/fa6";
import { useLocation } from "react-router-dom";
import KakaoMap from "../../components/member/KakaoMap";
import MemberFooter from "../../components/member/MemberFooter";
import MemberHeader from "../../components/member/MemberHeader";
import OfficeItem from "../../components/member/OfficeItem";
import "../../styles/pages/member/MemberMain.css";
import { getNo } from "../../utils/auth";
import axios from "../../utils/axiosConfig";
import { FaArrowCircleLeft, FaArrowCircleRight } from "react-icons/fa";

function MemberMain() {
  const [mapData, setMapData] = useState([]);
  const [userLikes, setUserLikes] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [isMapExpanded, setIsMapExpanded] = useState(false);
  const [isMapFullExpanded, setIsMapFullExpanded] = useState(false);
  const [isButtonVisible, setIsButtonVisible] = useState(false);
  const location = useLocation();

  const searchParams = useMemo(
    () => location.state?.searchParams || {},
    [location.state]
  );

  const fetchUserLikes = useCallback(async () => {
    const userNo = getNo();
    if (!userNo) return;
    try {
      const response = await axios.get(`/member/${userNo}/liked-offices`);
      setUserLikes(new Set(response.data));
    } catch (error) {
      console.error("Error fetching user likes:", error);
    }
  }, []);

  const fetchData = useCallback(
    async (page = currentPage) => {
      try {
        const response = await axios.get("/office", {
          params: {
            page,
            size: 24,
            location: searchParams.location || "",
            startDate: searchParams.startDate || "",
            endDate: searchParams.endDate || "",
            attendance: searchParams.attendance || 1,
          },
        });
        const newData = response.data;
        setMapData((prevData) =>
          page === 1 ? newData : [...prevData, ...newData]
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },
    [searchParams]
  );

  useEffect(() => {
    fetchUserLikes();
    setCurrentPage(1);
    fetchData(1);
  }, [fetchUserLikes, fetchData, searchParams]);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const distanceFromBottom = documentHeight - (scrollTop + windowHeight);

      setIsButtonVisible(distanceFromBottom <= 500 && mapData.length === currentPage * 24);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [mapData.length]);

  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    fetchData(nextPage);
  };

  const toggleMap = () => {
    setIsMapExpanded(!isMapExpanded);
  };

  const toggleMapFullExpanded = () => {
    setIsMapFullExpanded((prev) => !prev);
  };
  return (
    <>
      <MemberHeader />
      <div className="member-main-page">
        <div className="main-container">
          {!isMapFullExpanded && (
            <div style={{ margin: "auto" }}>
              <div
                className={`office-item-list ${isMapExpanded ? "expanded" : ""
                  }`}
              >
                {mapData.length === 0 ? (
                  <div className="office-not-found">검색 결과가 없습니다.</div>
                ) : (
                  mapData.map((item) => (
                    <OfficeItem
                      key={item.NO}
                      {...item}
                      initialLikeStatus={userLikes.has(item.NO)}
                    />
                  ))
                )}
              </div>
              <div className="item-list-button-container">
                <button
                  className={`more-button ${isButtonVisible ? "visible" : ""
                    }`}
                  onClick={handleLoadMore}
                >
                  더보기
                </button>

                <button className="expand-map-button" onClick={toggleMap}>
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
                onClick={toggleMapFullExpanded}
              >
                {isMapFullExpanded ? (
                  <><FaArrowCircleRight />접기</>
                ) : (
                  <><FaArrowCircleLeft />확장</>
                )}
              </button>
              <KakaoMap
                key={isMapFullExpanded ? "full" : "normal"}
                mapData={mapData}
              />
            </div>
          )}
        </div>
      </div>
      <MemberFooter />
    </>
  );
}

export default MemberMain;