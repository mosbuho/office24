import { useNavigate } from "react-router-dom";
import "../../styles/components/member/MemberFooter.css";

const MemberFooter = ({ handlePopup }) => {
  const navigate = useNavigate();

  return (
    <footer className="member-footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>지원</h3>
          <ul>
            <li>
              <span onClick={() => handlePopup("QNA")}>도움말 센터</span>
            </li>
            <li>
              <span onClick={() => navigate("/office24-cover")}>
                Office24커버
              </span>
            </li>
            <li>
              <span onClick={() => navigate("/accessibility")}>
                장애인 지원
              </span>
            </li>
            <li>
              <span onClick={() => navigate("/cancellation-options")}>
                예약 취소 옵션
              </span>
            </li>
            <li>
              <span onClick={() => navigate("/neighbor-complaints")}>
                이웃 민원 신고
              </span>
            </li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>호스팅</h3>
          <ul>
            <li>
              <span onClick={() => navigate("/host-your-office")}>
                당신의 사무실을 Office24하세요
              </span>
            </li>
            <li>
              <span onClick={() => navigate("/host-cover")}>
                호스트를 위한 Office24커버
              </span>
            </li>
            <li>
              <span onClick={() => navigate("/hosting-resources")}>
                호스팅 자료
              </span>
            </li>
            <li>
              <span onClick={() => navigate("/community-forum")}>
                커뮤니티 포럼
              </span>
            </li>
            <li>
              <span onClick={() => navigate("/responsible-hosting")}>
                책임감 있는 호스팅
              </span>
            </li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Office24</h3>
          <ul>
            <li>
              <span onClick={() => navigate("/newsroom")}>뉴스룸</span>
            </li>
            <li>
              <span onClick={() => navigate("/new-features")}>새로운 기능</span>
            </li>
            <li>
              <span onClick={() => navigate("/careers")}>채용정보</span>
            </li>
            <li>
              <span onClick={() => navigate("/investor-info")}>
                투자자 정보
              </span>
            </li>
            <li>
              <span onClick={() => navigate("/emergency-office")}>
                Office24 긴급 사무실
              </span>
            </li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>
          © 2024 Office24, Inc. ·{" "}
          <span onClick={() => navigate("/privacy-policy")}>
            개인정보 처리방침
          </span>{" "}
          · <span onClick={() => navigate("/terms-of-service")}>이용약관</span>{" "}
          · <span onClick={() => navigate("/sitemap")}>사이트맵</span> ·{" "}
          <span onClick={() => navigate("/company-details")}>
            회사 세부정보
          </span>
        </p>
      </div>
    </footer>
  );
};

export default MemberFooter;
