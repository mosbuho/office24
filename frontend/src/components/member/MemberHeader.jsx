import React, { useEffect, useReducer, useRef, useState } from "react";
import { FaCircleUser } from "react-icons/fa6";
import { IoIosMenu } from "react-icons/io";
import { IoSearch } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import "../../styles/components/member/MemberHeader.css";
import Calendar from "./Calendar";

// render: 지역 옵션 목록 //
const LOCATION_OPTIONS = [
  "강남",
  "강서",
  "영등포",
  "강북",
  "서초",
  "송파",
  "마포",
  "종로",
];

// render: 추천 검색어 목록 //
const RECOMMENDATION_OPTIONS = [
  "강남역 오피스",
  "논산역 오피스",
  "상록 오피스",
  "강북 오피스",
  "서울역 오피스",
  "판교 오피스",
  "역삼 오피스",
  "홍대입구 오피스",
  "여의도 오피스",
  "성수 오피스",
];

// state //
const initialState = {
  showCalendar: false,
  showSearch: false,
  showAttendance: false,
};

// function: 팝업 상태 관리를 위한 리듀서 //
function popupReducer(state, action) {
  switch (action.type) {
    case "SHOW_CALENDAR":
      return { ...initialState, showCalendar: true };
    case "SHOW_SEARCH":
      return { ...initialState, showSearch: true };
    case "SHOW_ATTENDANCE":
      return { ...initialState, showAttendance: true };
    case "HIDE_ALL":
      return initialState;
    default:
      return state;
  }
}

// function: 한글 초성 추출 //
function getInitialConsonant(char) {
  const initialConsonants = "ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ";
  const unicodeBase = 44032;
  const unicodeChar = char.charCodeAt(0);

  if (unicodeChar >= unicodeBase && unicodeChar <= unicodeBase + 11171) {
    return initialConsonants[Math.floor((unicodeChar - unicodeBase) / 588)];
  }
  return char;
}

// function: 한글 필터링 //

function koreanFilter(input, target) {
  const inputInitials = input.split("").map(getInitialConsonant).join("");
  const targetInitials = target.split("").map(getInitialConsonant).join("");

  return (
    target.toLowerCase().includes(input.toLowerCase()) ||
    targetInitials.includes(inputInitials)
  );
}

const MemberHeader = () => {
  // state //
  const [popupState, dispatch] = useReducer(popupReducer, initialState);
  const [expanded, setExpanded] = useState(true);
  const [location, setLocation] = useState("");
  const [attendance, setAttendance] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [filteredLocations, setFilteredLocations] = useState(LOCATION_OPTIONS);
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredRecommendations, setFilteredRecommendations] = useState(
    RECOMMENDATION_OPTIONS
  );
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const searchContainerRef = useRef(null);
  const dropdownRef = useRef(null);
  const optionsRef = useRef(null);

  // event handler: 이벤트 분류 //
  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    window.addEventListener("scroll", handleScroll);
    return () => {
      document.removeEventListener("click", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  //  event handler: 외부 클릭 처리 //
  const handleClickOutside = (event) => {
    if (
      searchContainerRef.current &&
      !searchContainerRef.current.contains(event.target)
    ) {
      collapse();
    }
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowDropdown(false);
    }
    if (optionsRef.current && !optionsRef.current.contains(event.target)) {
      dispatch({ type: "HIDE_ALL" });
    }
  };

  //  event handler: 검색어 입력 처리 //
  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    setLocation(value);

    const filteredLoc = LOCATION_OPTIONS.filter((loc) =>
      koreanFilter(value, loc)
    );
    const filteredRec = RECOMMENDATION_OPTIONS.filter((rec) =>
      koreanFilter(value, rec)
    );

    setFilteredLocations(filteredLoc);
    setFilteredRecommendations(filteredRec);
  };

  //  event handler: 옵션 클릭 처리 //
  const handleOptionClick = (value) => {
    setSearchInput(value);
    setLocation(value);
  };

  //  event handler: 스크롤 처리 //
  const handleScroll = () => {
    if (window.scrollY < 500) {
      setExpanded(true);
    } else if (window.scrollY > 300) {
      setExpanded(false);
      collapse();
    } else {
      setExpanded(true);
    }
  };
  const handleLogin = () => {
    navigate("/login");
  };

  const handleRegister = () => {
    navigate("/member/register");
  };

  // function: 사용자 메뉴 이벤트 처리 //
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  // function: 검색창 확장 //
  const expandSearch = (e) => {
    e.stopPropagation();
    setExpanded(true);
  };

  // function: 검색창 축소 //
  const collapse = () => {
    if (window.scrollY > 300) {
      setExpanded(false);
      dispatch({ type: "HIDE_ALL" });
    }
  };

  // function: 검색 실행 //
  const search = () => {
    console.log("Searching:", {
      location,
      dates: { startDate, endDate },
      attendance,
    });
    // TODO: Implement the search functionality
  };

  // function: 날짜 포맷 //
  const formatDate = (date) => {
    if (!date) return "";
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  };

  // function: 달력 클릭 처리 //
  const handleCalendarClick = () => {
    dispatch({ type: "SHOW_CALENDAR" });
  };

  // function: 검색 포커스 처리 //
  const handleSearchFocus = () => {
    dispatch({ type: "SHOW_SEARCH" });
  };

  // function: 인원 선택 클릭 처리 //
  const handleAttendanceClick = () => {
    dispatch({ type: "SHOW_ATTENDANCE" });
  };

  // function: 인원 변경 처리 //
  const handleAttendanceChange = (change) => {
    setAttendance((prev) => Math.max(1, prev + change));
  };

  const navigate = useNavigate();

  // render: 헤더 컴포넌트 //
  return (
    <div className="header-container">
      <div
        className={`search-container ${expanded ? "expanded" : ""}`}
        ref={searchContainerRef}
      >
        <div className="search-bar-wrapper">
          <div
            className={`search-bar ${expanded ? "expanded" : ""}`}
            onClick={expandSearch}
          >
            {!expanded && <div className="search-placeholder">검색하세요</div>}
            {expanded && (
              <div className="search-inputs">
                <div className="search-input-wrapper input-wrapper">
                  <label htmlFor="location-search" className="search-label">
                    검색
                  </label>
                  <input
                    id="location-search"
                    type="text"
                    className="search-input"
                    placeholder="어떤것을 찾고 계신가요?"
                    value={searchInput}
                    onChange={handleSearchInputChange}
                    onFocus={handleSearchFocus}
                  />
                </div>
                <div className="check-day-input-wrapper input-wrapper">
                  <label htmlFor="check-in-day-input" className="search-label">
                    날짜
                  </label>
                  <input
                    id="check-in-day-input"
                    type="text"
                    className="search-input"
                    placeholder="이용 날"
                    value={`${formatDate(startDate)} ~ ${formatDate(endDate)}`}
                    readOnly
                    onClick={handleCalendarClick}
                  />
                </div>
                <div className="attendance-input-wrapper input-wrapper">
                  <label htmlFor="attendance-input" className="search-label">
                    인원
                  </label>
                  <input
                    id="attendance-input"
                    type="text"
                    className="search-input"
                    placeholder="normal 1"
                    value={`일반석: ${attendance} 명`}
                    readOnly
                    onClick={handleAttendanceClick}
                  />
                </div>
              </div>
            )}
            <button
              className={`search-button ${expanded ? "expanded" : ""}`}
              onClick={search}
            >
              <div className="search-button-content">
                <div className="search-icon-wrapper">
                  <IoSearch />
                </div>
                <div className="search-button-text">
                  <p>검색</p>
                </div>
              </div>
            </button>
          </div>
        </div>

        <div className="search-option-popups" ref={optionsRef}>
          {popupState.showCalendar && (
            <div className="date-options-sections">
              <div className="calendar-popup">
                <Calendar
                  settingStartDate={setStartDate}
                  settingEndDate={setEndDate}
                  startDate={startDate}
                  endDate={endDate}
                />
              </div>
            </div>
          )}
          {popupState.showSearch && (
            <div className="search-options-section">
              {filteredLocations.length > 0 && (
                <>
                  <h3>지역 선택</h3>
                  <div className="recommendation-options">
                    {filteredLocations.map((location, index) => (
                      <div
                        key={index}
                        className="location-option"
                        onClick={() => handleOptionClick(location)}
                      >
                        {location}
                      </div>
                    ))}
                  </div>
                </>
              )}
              {filteredRecommendations.length > 0 && (
                <>
                  <h3>추천 검색어</h3>
                  <div className="recommendation-options">
                    {filteredRecommendations.map((recommendation, index) => (
                      <div
                        key={index}
                        className="recommendation-option"
                        onClick={() => handleOptionClick(recommendation)}
                      >
                        {recommendation}
                      </div>
                    ))}
                  </div>
                </>
              )}
              {filteredLocations.length === 0 &&
                filteredRecommendations.length === 0 && (
                  <div>검색 결과가 없습니다.</div>
                )}
            </div>
          )}
          {popupState.showAttendance && (
            <div className="attendance-options-sections">
              <div className="attendance-counter">
                <span>일반석</span>
                <button
                  className={`attendance-button ${
                    attendance === 1 ? "disabled" : ""
                  }`}
                  onClick={() => handleAttendanceChange(-1)}
                  disabled={attendance === 1}
                >
                  -
                </button>
                <span>{attendance}</span>
                <button
                  className="attendance-button"
                  onClick={() => handleAttendanceChange(1)}
                >
                  +
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="fixed-logo-wrapper">OFFICE24</div>
      <div
        className="fixed-menu-wrapper"
        onClick={toggleDropdown}
        ref={dropdownRef}
      >
        <div className="menu-icon-wrapper">
          <IoIosMenu />
        </div>
        <div className="profile-img-wrapper">
          <FaCircleUser style={{ color: "gray" }} />
          {showDropdown && (
            <div className="profile-dropdown">
              <div className="dropdown-option" onClick={handleLogin}>
                로그인
              </div>
              <div className="dropdown-option" onClick={handleRegister}>
                회원가입
              </div>
              <div className="dropdown-divider"></div>
              <div className="dropdown-option">Q&A</div>

              {/* <div className="dropdown-option">사용자 정보</div>
              <div className="dropdown-option">로그아웃 </div>
              <div className="dropdown-divider"></div>
              <div className="dropdown-option">Q&A</div> */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MemberHeader;
