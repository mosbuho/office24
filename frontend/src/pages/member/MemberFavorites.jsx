import { useEffect, useState } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import OfficeItem from "../../components/member/OfficeItem";
import { getNo } from "../../utils/auth";
import axios from "../../utils/axiosConfig";

function MemberFavorites() {
  const [favoriteOffices, setFavoriteOffices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const userNo = getNo();

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`member/${userNo}/favorites`);
      setFavoriteOffices(
        response.data.map((office) => ({ ...office, isLiked: true }))
      );
    } catch (error) {
      console.error(error);
      setError("에러 발생.... 문의 주세요....");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLikeChange = (officeNo, newLikeStatus) => {
    if (!newLikeStatus) {
      setFavoriteOffices((prevFavorites) =>
        prevFavorites.filter((office) => office.NO !== officeNo)
      );
    }
  };

  if (isLoading) {
    return <div>로딩중......</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="favorites-tab">
      <h2>찜 목록</h2>
      {favoriteOffices.length === 0 ? (
        <p>목록이 비어있습니다.</p>
      ) : (
        <TransitionGroup className="office-item-list-sub">
          {favoriteOffices.map((item) => (
            <CSSTransition key={item.NO} timeout={300} classNames="fade">
              <OfficeItem
                {...item}
                initialLikeStatus={true}
                onLikeChange={handleLikeChange}
              />
            </CSSTransition>
          ))}
        </TransitionGroup>
      )}
    </div>
  );
}

export default MemberFavorites;
