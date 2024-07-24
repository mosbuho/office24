import React from "react";

const Heart = ({ filled, onClick }) => (
  <span
    onClick={onClick}
    style={{
      color: filled ? "red" : "black",
      cursor: "pointer",
      fontSize: "1.2em",
    }}
  >
    {filled ? "♥" : "♡"}
  </span>
);

const OfficeItem = ({ officeItem }) => {
  const {
    id,
    name,
    description,
    rating,
    rateCount,
    price,
    userId,
    pictureUrl,
    liked,
  } = officeItem;

  const handleLikeToggle = () => {
    onLikeToggle(id);
  };

  const renderStarRating = (rating) => (
    <span className="star-rating">
      <span style={{ color: "#ffc107" }}>★</span>
      {rating.toFixed(2)}
    </span>
  );

  return (
    <div className="office-item">
      <div className="office-item-image-box">
        <div className="office-item-image">
          <img src={pictureUrl} alt={name} />
        </div>
        <div className="office-item-like">
          <Heart filled={liked} onClick={() => handleLikeToggle(id)} />
        </div>
      </div>
      <div className="office-item-content">
        <div className="office-item-top">
          <div className="office-item-top-right">{name}</div>
          <div className="office-item-top-right-left">
            {renderStarRating(rating)}({rateCount})
          </div>
        </div>
        <div className="office-item-middle content">{description}</div>
        <div className="office-item-bottom"></div>
      </div>

      <div></div>
      <p></p>
      <p>Price: ${price}</p>
      <p>User: {userId}</p>
      <div className="like-button"></div>
    </div>
  );
};

export default OfficeItem;
