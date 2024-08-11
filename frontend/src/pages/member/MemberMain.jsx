import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaMapLocationDot } from "react-icons/fa6";
import { useLocation } from "react-router-dom";
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
  const location = useLocation();
  const [pageLength, setPageLength] = useState(0);

  const searchParams = location.state?.searchParams || {};

  const fetchData = async (page = currentPage) => {
    try {
      const response = await axios.get("http://localhost:8080/office", {
        params: {
          page,
          size: itemsPerPage,
          location: searchParams.location || "",
          startDate: searchParams.startDate || "",
          endDate: searchParams.endDate || "",
          attendance: searchParams.attendance || 1,
        },
      });
      const data = response.data;
      setPageLength(data.length);
      if (Array.isArray(data)) {
        if (page === 1) {
          setMapData(data);
        } else {
          setMapData((prevData) => [...prevData, ...data]);
        }
      } else {
        console.error("Expected an array but got:", data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Fetch data when currentPage changes
  useEffect(() => {
    fetchData();
  }, [currentPage]);

  // Reset page and fetch data when searchParams change
  useEffect(() => {
    setCurrentPage(1);
    fetchData(1); // Fetch data for the first page with new search parameters
  }, [location.state?.searchParams]);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const distanceFromBottom = documentHeight - (scrollTop + windowHeight);

      setIsButtonVisible(distanceFromBottom <= 500);
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

  console.log(itemsPerPage);

  return (
    <>
      <MemberHeader />
      <div className="member-main-page">
        <div className="main-container">
          {!isMapFullExpanded && (
            <div style={{ margin: "auto" }}>
              <div
                className={`office-item-list ${isMapExpanded ? " expanded" : ""
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
              </div>

              <div className="item-list-button-container">
                {pageLength === itemsPerPage && (
                  <button
                    className={`more-button ${isButtonVisible ? "visible" : ""}`}
                    onClick={handleLoadMore}
                  >
                    더보기
                  </button>
                )}
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
              style={{ display: pageLength < 24 ? 'none' : 'block' }}
            >
              <button
                className="map-button full-extend"
                onClick={() => toggleMapFullExpanded()}
              >
                {isMapFullExpanded ? "접기 >" : "< 확장"}
              </button>
              <KakaoMap mapData={mapData} />
            </div>
          )}
        </div>
      </div >
      <MemberFooter />
    </>
  );
}

export default MemberMain;
