import { useEffect, useState } from "react";
import {
  NewReviewPopup,
  VerifyPopup
} from "../../components/member/Popups";
import ReservationItem from "../../components/member/ReservationItem";
import { getNo } from "../../utils/auth";
import axios from "../../utils/axiosConfig";

function MemberReservations() {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [isReviewPopupOpen, setIsReviewPopupOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [isVerifyPopupOpen, setIsVerifyPopupOpen] = useState(false);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [reservations, setReservations] = useState([]);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetchReservations();
    fetchReviews();
  }, []);

  const no = getNo();
  
  const fetchReservations = async () => {
    try {
      const response = await axios.get(`/member/${no}/reservations`);
      setReservations(response.data);
    } catch (error) {
      console.error("Error fetching reservations:", error);
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
  const filterReservations = (condition) => reservations.filter(condition);

  const upcomingReservations = filterReservations(
    (reservation) => new Date(reservation.START_DATE) > currentDateTime
  );

  const inUseReservations = filterReservations(
    (reservation) =>
      currentDateTime >= new Date(reservation.START_DATE) &&
      currentDateTime <= new Date(reservation.END_DATE)
  );

  const pastReservations = filterReservations(
    (reservation) => new Date(reservation.END_DATE) < currentDateTime
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
    const formattedReservation = {
      ...item,
      startDate: item.START_DATE,
      endDate: item.END_DATE,
      attendance: item.ATTENDANCE || 1,
    };
    setSelectedReservation(formattedReservation);
    setIsEditPopupOpen(true);
  };


  const handleVerifyPopup = (item) => {
    setSelectedReservation(item);
    setIsVerifyPopupOpen(true);
  };

  const renderReservationItem = (item) => (
    <ReservationItem
      key={item.NO}
      item={item}
      activeTab={activeTab}
      onEdit={handleEditPopup}
      onCancel={handleVerifyPopup}
      onReview={() => {
        setSelectedReservation(item);
        setIsReviewPopupOpen(true);
      }}
      review={reviews.find((review) => review.OFFICENO === item.OFFICE_NO)}
    />
  );
  return (
    <>
      <TabNavigation />
      {activeTab === "upcoming" &&
        upcomingReservations.map(renderReservationItem)}
      {activeTab === "inUse" && inUseReservations.map(renderReservationItem)}
      {activeTab === "past" && pastReservations.map(renderReservationItem)}

      {isVerifyPopupOpen && (
        <VerifyPopup
          onConfirm={(result) => {
            setIsVerifyPopupOpen(false);
            if (result === "yes") {
              fetchReservations();
            }
          }}
          onCancel={() => setIsVerifyPopupOpen(false)}
          msg="예약을 취소하시겠습니까?"
        />
      )}

      {isReviewPopupOpen && selectedReservation && (
        <NewReviewPopup
          newInitialValue={selectedReservation}
          onClose={() => {
            setIsReviewPopupOpen(false);
            setSelectedReservation(null);
          }}
          onUpdate={handleReviewUpdate}
          type={activeTab === "past" ? "new" : undefined}
        />
      )}
    </>
  );
}

export default MemberReservations;