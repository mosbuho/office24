import { useState } from "react";
import OfficeItem from "../../components/member/OfficeItem";
import {
  EditPopup,
  NewReviewPopup,
  VerifyPopup,
} from "../../components/member/Popups";
import { ReviewItem } from "../../components/member/ReviewItem";

function TabReservations() {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [isReviewPopupOpen, setIsReviewPopupOpen] = useState(false);

  const [selectedReservation, setSelectedReservation] = useState(null);
  const [isVerifyPopupOpen, setIsVerifyPopupOpen] = useState(false);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [memberData, setMemberData] = useState(null);

  const mockReservations = [
    {
      no: 1,
      title: "강남역 사무실",
      rating: "4.5",
      noOfRating: "40",
      description: "강남역 사무실",
      location: "강남역",
      pricePerDay: "10000",
      officeImgURL: "/demooffice1.webp",
      longitude: 127.058392,
      latitude: 37.500454,
      regdate: "2024-05-15T10:05:00",
      startDate: "2024-07-15T10:05:00",
      endDate: "2024-10-18T10:05:00",
      attendance: 1,
    },
    {
      no: 2,
      title: "송파 공유 오피스",
      rating: "4.5",
      noOfRating: "38",
      description: "송파 공유 오피스",
      location: "송파",
      pricePerDay: "11000",
      officeImgURL: "/demooffice3.webp",
      longitude: 127.112585,
      latitude: 37.514322,
      regdate: "2024-08-01T09:30:00",
      startDate: "2025-01-02T09:00:00",
      endDate: "2025-01-31T18:00:00",
      attendance: 2,
    },
  ];

  const reviews = [
    {
      no: 1,
      title: "신촌 스타트업 허브",
      content:
        "Solid performance and reasonable price. Satisfied with my purchase.",
      rating: 4,
      date: "2023-05-18",
    },
    {
      no: 1,
      title: "판교 테크노밸리 오피스",
      content:
        "Decent product overall, but there are a few minor issues that could be addressed.",
      rating: 3,
      date: "2023-05-20",
    },
  ];

  //render tabs
  const TabNavigation = () => (
    <div className="tab-navigation">
      {activeTab === "upcoming" && (
        <button className="active" onClick={() => setActiveTab("upcoming")}>
          예약 목록
        </button>
      )}
      {activeTab === "inUse" && (
        <button className="active" onClick={() => setActiveTab("inUse")}>
          사용 중
        </button>
      )}
      {activeTab === "past" && (
        <button className="active" onClick={() => setActiveTab("past")}>
          기간 만료
        </button>
      )}
      {activeTab !== "upcoming" && (
        <button onClick={() => setActiveTab("upcoming")}>예약 목록</button>
      )}
      {activeTab !== "inUse" && (
        <button onClick={() => setActiveTab("inUse")}>사용 중</button>
      )}
      {activeTab !== "past" && (
        <button onClick={() => setActiveTab("past")}>기간 만료</button>
      )}
    </div>
  );

  const currentDateTime = new Date();

  const upcomingReservations = mockReservations.filter((reservation) => {
    const startDate = new Date(reservation.startDate);
    return startDate > currentDateTime;
  });

  const inUseReservations = mockReservations.filter((reservation) => {
    const startDate = new Date(reservation.startDate);
    const endDate = new Date(reservation.endDate);
    return currentDateTime >= startDate && currentDateTime <= endDate;
  });

  const pastReservations = mockReservations.filter((reservation) => {
    const endDate = new Date(reservation.endDate);
    return endDate < currentDateTime;
  });

  const handleEditPopup = (item) => {
    setSelectedReservation(item);
    setIsEditPopupOpen(true);
  };

  const handleVerifyPopup = (item) => {
    setSelectedReservation(item);
    setIsVerifyPopupOpen(true);
  };

  return (
    <>
      <TabNavigation />
      {activeTab === "upcoming" && (
        <>
          {upcomingReservations.map((item) => (
            <div className="office-item-option-wrap " key={item.no}>
              <OfficeItem {...item} />
              <div className="office-item-reservation-info">
                <p>시작일: {new Date(item.startDate).toLocaleDateString()}</p>
                <p>~</p>
                <p>종료일: {new Date(item.endDate).toLocaleDateString()}</p>
                <p>사용 인원: {item.attendance}명 </p>
              </div>
              <div className="extra-info">
                <div className="btns-wrap">
                  <div
                    className="btn-edit"
                    onClick={() => handleEditPopup(item)}
                  >
                    수정
                  </div>
                  <div
                    className="btn-cancel"
                    onClick={() => handleVerifyPopup(item)}
                  >
                    취소
                  </div>
                </div>
              </div>
            </div>
          ))}
          {isEditPopupOpen && (
            <EditPopup
              reservation={selectedReservation}
              onClose={() => setIsEditPopupOpen(false)}
              onSave={(updatedReservation) => {
                setIsEditPopupOpen(false);
              }}
            />
          )}

          {isVerifyPopupOpen && (
            <VerifyPopup
              onConfirm={(result) => {
                setIsVerifyPopupOpen(false);
                if (result === "yes") {
                  //
                }
              }}
              onCancel={(result) => {
                setIsVerifyPopupOpen(false);
              }}
              msg="예약을 취소하시겠습니까?"
            />
          )}
        </>
      )}

      {activeTab === "inUse" && (
        <>
          {inUseReservations.map((item) => (
            <div className="office-item-option-wrap " key={item.no}>
              <OfficeItem {...item} />
              <div className="office-item-reservation-info">
                <p>시작일: {new Date(item.startDate).toLocaleDateString()}</p>
                <p>~</p>
                <p>종료일: {new Date(item.endDate).toLocaleDateString()}</p>
                <p>사용 인원: {item.attendance}명 </p>
              </div>
              <div className="extra-info">
                <div className="btn-review">
                  {reviews.find((review) => review.no === item.no) ? (
                    <ReviewItem
                      customTitle="리뷰"
                      {...reviews.find((review) => review.no === item.no)}
                    />
                  ) : (
                    <div className="no-review review-item">
                      <div className="review-header">
                        <div className="title-container">
                          <h4>작성한 리뷰가 없습니다</h4>
                        </div>
                        <div
                          className="edit-button"
                          onClick={() => setIsReviewPopupOpen(true)}
                        >
                          <p>작성</p>
                        </div>
                      </div>
                      {isReviewPopupOpen && (
                        <NewReviewPopup
                          newInitialValue={item}
                          onClose={() => setIsReviewPopupOpen(false)}
                        />
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </>
      )}

      {activeTab === "past" && (
        <>
          {pastReservations.map((item) => (
            <div className="office-item-option-wrap " key={item.no}>
              <OfficeItem {...item} />
              <div className="office-item-reservation-info">
                <p>시작일: {new Date(item.startDate).toLocaleDateString()}</p>
                <p>~</p>
                <p>종료일: {new Date(item.endDate).toLocaleDateString()}</p>
                <p>사용 인원: {item.attendance}명 </p>
              </div>
              <div className="extra-info">
                <div className="btn-review">
                  {reviews.find((review) => review.no === item.no) ? (
                    <ReviewItem
                      customTitle="리뷰"
                      {...reviews.find((review) => review.no === item.no)}
                    />
                  ) : (
                    <div className="no-review review-item">
                      <div className="review-header">
                        <div className="title-container">
                          <h4>작성한 리뷰가 없습니다</h4>
                        </div>
                        <div
                          className="edit-button"
                          onClick={() => setIsReviewPopupOpen(true)}
                        >
                          <p>작성</p>
                        </div>
                      </div>

                      {isReviewPopupOpen && (
                        <NewReviewPopup
                          newInitialValue={item}
                          onClose={() => setIsReviewPopupOpen(false)}
                          type="new"
                        />
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </>
      )}
    </>
  );
}

export default TabReservations;
