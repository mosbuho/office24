import React, { useCallback, useEffect, useRef, useState } from "react";
import BookingItem from "../../components/member/BookingItem";
import { NewReviewPopup } from "../../components/member/Popups";
import "../../styles/pages/member/MemberBooking.css";
import { getNo } from "../../utils/auth";
import axios from "../../utils/axiosConfig";

const TabNavigation = React.memo(({ activeTab, onTabChange }) => (
  <div className="tab-navigation">
    {["upcoming", "inUse", "past"].map((tab) => (
      <button
        key={tab}
        className={activeTab === tab ? "active" : ""}
        onClick={() => onTabChange(tab)}
      >
        {tab === "upcoming" ? "예약 중" : tab === "inUse" ? "이용 중" : "이용 완료"}
      </button>
    ))}
  </div>
));

const useIntersectionObserver = (callback, options = {}) => {
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) callback();
    }, options);

    if (ref.current) observer.observe(ref.current);
    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, [callback, options]);

  return ref;
};

const ITEMS_PER_PAGE = 10;

function MemberBookings() {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [isReviewPopupOpen, setIsReviewPopupOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [reviews, setReviews] = useState(new Set());
  const [isLoading, setIsLoading] = useState(false);

  const [bookingsState, setBookingsState] = useState({
    upcoming: { data: [], page: 1, hasMore: true },
    inUse: { data: [], page: 1, hasMore: true },
    past: { data: [], page: 1, hasMore: true },
  });

  const no = getNo();

  const getBookingsState = useCallback((tab) => bookingsState[tab] || { data: [], page: 1, hasMore: true }, [bookingsState]);

  const fetchBookings = useCallback(async (tab, page) => {
    try {
      const response = await axios.get(`/member/${no}/bookings`, {
        params: { tab, page, limit: ITEMS_PER_PAGE },
      });
      return response.data;
    } catch {
      return null;
    }
  }, [no]);

  const fetchWrittenReviews = useCallback(async () => {
    try {
      const response = await axios.get(`/member/${no}/written-reviews`);
      return new Set(response.data.map(review => review));
    } catch {
      return new Set();
    }
  }, [no]);

  const loadBookings = useCallback(async (tab, loadMore = false) => {
    if (isLoading) return;

    const bookings = getBookingsState(tab);

    if (!bookings.hasMore && loadMore) return;

    setIsLoading(true);
    const page = loadMore ? bookings.page + 1 : 1;

    const response = await fetchBookings(tab, page);

    if (response?.bookings) {
      setBookingsState(prevState => ({
        ...prevState,
        [tab]: {
          data: loadMore ? [...prevState[tab].data, ...response.bookings] : response.bookings,
          page,
          hasMore: response.bookings.length === ITEMS_PER_PAGE,
        }
      }));
    } else {
      setBookingsState(prevState => ({
        ...prevState,
        [tab]: {
          ...prevState[tab],
          hasMore: false,
        }
      }));
    }

    setIsLoading(false);
  }, [isLoading, getBookingsState, fetchBookings]);

  useEffect(() => {
    const bookings = getBookingsState(activeTab);
    if (bookings.data.length === 0 && bookings.hasMore) {
      loadBookings(activeTab);
    }
  }, [activeTab, getBookingsState, loadBookings]);

  useEffect(() => {
    const loadReviews = async () => {
      const writtenReviewSet = await fetchWrittenReviews();
      setReviews(writtenReviewSet);
    };
    loadReviews();
  }, [fetchWrittenReviews]);

  const handleTabChange = useCallback((newTab) => {
    setActiveTab(newTab);
    setBookingsState(prevState => ({
      ...prevState,
      [newTab]: {
        data: [],
        page: 1,
        hasMore: true,
      }
    }));
  }, []);

  const loadMoreRef = useIntersectionObserver(() => {
    const bookings = getBookingsState(activeTab);
    if (bookings.hasMore && !isLoading) {
      loadBookings(activeTab, true);
    }
  });

  const handleReviewUpdate = useCallback(async () => {
    try {
      const writtenReviewSet = await fetchWrittenReviews();
      setReviews(writtenReviewSet);
    } catch (error) {
      console.error("리뷰 업데이트 오류:", error);
    }
  }, [fetchWrittenReviews]);

  const handleBookingCancel = useCallback((bookingNo) => {
    setBookingsState(prevState => ({
      ...prevState,
      [activeTab]: {
        ...prevState[activeTab],
        data: prevState[activeTab].data.filter(booking => booking.NO !== bookingNo),
      }
    }));
  }, [activeTab]);

  const handleEditPopup = useCallback((item) => {
    setSelectedBooking({
      ...item,
      startDate: item.START_DATE,
      endDate: item.END_DATE,
      attendance: item.ATTENDANCE || 1,
    });
  }, []);

  const renderBookingItem = useCallback((item) => {
    const hasWrittenReview = reviews.has(item.NO);

    return (
      <BookingItem
        key={item.NO}
        item={item}
        activeTab={activeTab}
        onEdit={handleEditPopup}
        onCancel={handleBookingCancel}
        onReview={() => {
          setSelectedBooking(item);
          setIsReviewPopupOpen(true);
        }}
        hasWrittenReview={hasWrittenReview}
      />
    );
  }, [activeTab, handleEditPopup, handleBookingCancel, reviews]);

  const currentBookings = getBookingsState(activeTab);

  const renderBookings = () => {
    if (currentBookings.data.length === 0 && !currentBookings.hasMore) {
      return <div>예약 내역이 존재하지 않습니다.</div>;
    }

    return (
      <>
        {currentBookings.data.map(renderBookingItem)}
        {currentBookings.hasMore && <div ref={loadMoreRef}></div>}
        {isLoading && <></>}
      </>
    );
  };

  return (
    <>
      <TabNavigation activeTab={activeTab} onTabChange={handleTabChange} />
      {renderBookings()}
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
