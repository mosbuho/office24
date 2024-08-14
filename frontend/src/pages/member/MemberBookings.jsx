import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import BookingItem from "../../components/member/BookingItem";
import { NewReviewPopup, VerifyPopup } from "../../components/member/Popups";
import "../../styles/pages/member/MemberBooking.css";
import { getNo } from "../../utils/auth";
import axios from "../../utils/axiosConfig";

// 탭 네비게이션 컴포넌트
const TabNavigation = React.memo(({ activeTab, setActiveTab }) => (
  <div className="tab-navigation">
    {["upcoming", "inUse", "past"].map((tab) => (
      <button
        key={tab}
        className={activeTab === tab ? "active" : ""}
        onClick={() => setActiveTab(tab)}
      >
        {tab === "upcoming"
          ? "예약 목록"
          : tab === "inUse"
          ? "사용 중"
          : "기간 만료"}
      </button>
    ))}
  </div>
));

TabNavigation.displayName = "TabNavigation";

// 교차점 관찰자 훅
const useIntersectionObserver = (callback, options = {}) => {
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      entry.isIntersecting && callback();
    }, options);

    ref.current && observer.observe(ref.current);

    return () => ref.current && observer.unobserve(ref.current);
  }, [callback, options]);

  return ref;
};

function MemberBookings() {
  // 상태 관리
  const [activeTab, setActiveTab] = useState("upcoming");
  const [isReviewPopupOpen, setIsReviewPopupOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isVerifyPopupOpen, setIsVerifyPopupOpen] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [tabData, setTabData] = useState({
    upcoming: { bookings: [], page: 1, itemsPerPage: 10, hasMore: true },
    inUse: { bookings: [], page: 1, itemsPerPage: 10, hasMore: true },
    past: { bookings: [], page: 1, itemsPerPage: 10, hasMore: true },
  });

  const no = getNo();

  // 예약 데이터 가져오기
  const fetchBookings = useCallback(
    async (tab, page = 1, limit = 10) => {
      try {
        const response = await axios.get(`/member/${no}/bookings`, {
          params: { tab, page, limit },
        });
        return response.data;
      } catch (error) {
        console.error("예약 데이터 가져오기 오류:", error);
        return null;
      }
    },
    [no]
  );

  // 예약 데이터 로드
   const loadBookings = useCallback(
     async (loadMore = false) => {
       if (isLoading) return;
       setIsLoading(true);
       const currentTabData = tabData[activeTab];
       const page = loadMore ? currentTabData.page + 1 : 1;
       const response = await fetchBookings(
         activeTab,
         page,
         currentTabData.itemsPerPage
       );

       if (response?.bookings) {
         setTabData((prevTabData) => ({
           ...prevTabData,
           [activeTab]: {
             bookings: loadMore
               ? [...currentTabData.bookings, ...response.bookings]
               : response.bookings,
             page,
             itemsPerPage: currentTabData.itemsPerPage,
             hasMore: response.bookings.length === currentTabData.itemsPerPage,
           },
         }));
       }
       setIsLoading(false);
     },
     [activeTab, tabData, fetchBookings, isLoading]
   );

   useEffect(() => {
     if (tabData[activeTab].bookings.length === 0 && !isLoading) {
       loadBookings();
     }
   }, [activeTab, loadBookings, tabData, isLoading]);

  // 무한 스크롤 구현
  const loadMoreRef = useIntersectionObserver(

    () => tabData[activeTab].hasMore && loadBookings(true)
  );

  // 리뷰 데이터 가져오기
  const fetchReviews = async () => {
    try {
      const response = await axios.get(`/member/${no}/review`);
      setReviews(response.data);
    } catch (error) {
      console.error("리뷰 데이터 가져오기 오류:", error);
    }
  };

  // 리뷰 업데이트 처리
  const handleReviewUpdate = async (updatedReview) => {
    try {
      setReviews((prevReviews) => [...prevReviews, updatedReview]);
      await fetchReviews();
      console.log("리뷰 업데이트 완료:", updatedReview);
    } catch (error) {
      console.error("리뷰 업데이트 오류:", error);
    }
  };

  // 예약 수정 팝업 처리
  const handleEditPopup = (item) => {
    setSelectedBooking({
      ...item,
      startDate: item.START_DATE,
      endDate: item.END_DATE,
      attendance: item.ATTENDANCE || 1,
    });
  };

  // 예약 취소 확인 팝업 처리
  const handleVerifyPopup = (item) => {
    setSelectedBooking(item);
    setIsVerifyPopupOpen(true);
  };

  // 선택된 예약에 대한 리뷰 필터링
  const filteredReviews = useMemo(
    () =>
      reviews.filter(
        (review) => review.OFFICENO === selectedBooking?.OFFICE_NO
      ),
    [reviews, selectedBooking]
  );

  // 예약 아이템 렌더링
  const renderBookingItem = useCallback(
    (item) => (
      <BookingItem
        key={item.NO}
        item={item}
        activeTab={activeTab}
        onEdit={handleEditPopup}
        onCancel={handleVerifyPopup}
        onReview={() => {
          setSelectedBooking(item);
          setIsReviewPopupOpen(true);
        }}
        review={filteredReviews.find(
          (review) => review.OFFICENO === item.OFFICE_NO
        )}
      />
    ),
    [activeTab, filteredReviews]
  );

  return (
    <>
      <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />


      {tabData[activeTab].bookings.map(renderBookingItem)}
      {tabData[activeTab].hasMore && <div ref={loadMoreRef}></div>}

      {isVerifyPopupOpen && (
        <VerifyPopup
          onConfirm={(result) => {
            setIsVerifyPopupOpen(false);
            result === "yes" && loadBookings();
          }}
          onCancel={() => setIsVerifyPopupOpen(false)}
          msg="예약을 취소하시겠습니까?"
        />
      )}
      {isReviewPopupOpen && selectedBooking && (
        <NewReviewPopup
          newInitialValue={selectedBooking}
          onClose={() => {
            setIsReviewPopupOpen(false);
            setSelectedBooking(null);
          }}
          onUpdate={handleReviewUpdate}
          type={activeTab === "past" ? "new" : undefined}
        />
      )}
    </>
  );
}


export default MemberBookings;