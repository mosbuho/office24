import { useEffect, useState } from "react";
import BookingItem from "../../components/member/BookingItem";
import {
  NewReviewPopup,
  VerifyPopup
} from "../../components/member/Popups";
import { getNo } from "../../utils/auth";
import axios from "../../utils/axiosConfig";

function MemberBookings() {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [isReviewPopupOpen, setIsReviewPopupOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isVerifyPopupOpen, setIsVerifyPopupOpen] = useState(false);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetchBookings();
    fetchReviews();
  }, []);

  const no = getNo();
  
  const fetchBookings = async () => {
    try {
      const response = await axios.get(`/member/${no}/bookings`);
      setBookings(response.data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`/member/${no}/review`);
      setReviews(response.data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  const TabNavigation = () => (
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
  );

  const currentDateTime = new Date();
  const filterBookings = (condition) => bookings.filter(condition);

  const upcomingBookings = filterBookings(
    (booking) => new Date(booking.START_DATE) > currentDateTime
  );

  const inUseBookings = filterBookings(
    (booking) =>
      currentDateTime >= new Date(booking.START_DATE) &&
      currentDateTime <= new Date(booking.END_DATE)
  );

  const pastBookings = filterBookings(
    (booking) => new Date(booking.END_DATE) < currentDateTime
  );

  const handleReviewUpdate = async (updatedReview) => {
    try {
      setReviews((prevReviews) => [...prevReviews, updatedReview]);
      await fetchReviews();
      console.log("Review updated:", updatedReview);
    } catch (error) {
      console.error("Error updating review:", error);
    }
  };

  const handleEditPopup = (item) => {
    const formattedBooking = {
      ...item,
      startDate: item.START_DATE,
      endDate: item.END_DATE,
      attendance: item.ATTENDANCE || 1,
    };
    setSelectedBooking(formattedBooking);
    setIsEditPopupOpen(true);
  };


  const handleVerifyPopup = (item) => {
    setSelectedBooking(item);
    setIsVerifyPopupOpen(true);
  };

  const renderBookingItem = (item) => (
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
      review={reviews.find((review) => review.OFFICENO === item.OFFICE_NO)}
    />
  );
  return (
    <>
      <TabNavigation />
      {activeTab === "upcoming" &&
        upcomingBookings.map(renderBookingItem)}
      {activeTab === "inUse" && inUseBookings.map(renderBookingItem)}
      {activeTab === "past" && pastBookings.map(renderBookingItem)}

      {isVerifyPopupOpen && (
        <VerifyPopup
          onConfirm={(result) => {
            setIsVerifyPopupOpen(false);
            if (result === "yes") {
              fetchBookings();
            }
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