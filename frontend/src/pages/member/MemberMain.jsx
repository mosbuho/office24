import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import KakaoMap from "../../components/member/KakaoMap";
import MemberFooter from "../../components/member/MemberFooter";
import MemberHeader from "../../components/member/MemberHeader";
import OfficeItem from "../../components/member/OfficeItem";
import "../../styles/pages/member/MemberMain.css";
import { getNo } from "../../utils/auth";
import axios from "../../utils/axiosConfig";

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
    [currentPage, searchParams]
  );

  useEffect(() => {
    fetchUserLikes();
    fetchData(1);
  }, [fetchUserLikes, fetchData]);

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

  const handleLoadMore = () => {
    setCurrentPage((prevPage) => prevPage + 1);
    fetchData(currentPage + 1);
  };

  const toggleMap = () => {
    setIsMapExpanded(!isMapExpanded);
  };

  const toggleMapFullExpanded = () => {
    setIsMapFullExpanded(!isMapFullExpanded);
  };

  return (
    <>
      <MemberHeader />
      <div className="member-main-page">
        <div className="main-container">
          {!isMapFullExpanded && (
            <div style={{ margin: "auto" }}>
              <div
                className={`office-item-list ${
                  isMapExpanded ? " expanded" : ""
                }`}
              >
                {mapData.map((item) => (
                  <OfficeItem
                    key={item.NO}
                    {...item}
                    initialLikeStatus={userLikes.has(item.NO)}
                  />
                ))}
              </div>
              <div className="item-list-button-container">
                <button
                  className={`more-button ${isButtonVisible ? "visible" : ""}`}
                  onClick={handleLoadMore}
                >
                  더보기
                </button>
                <button className="expand-map-button" onClick={toggleMap}>
                  {/* Add map icon here */}
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
                onClick={toggleMapFullExpanded}
              >
                {isMapFullExpanded ? "접기 >" : "< 확장"}
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
