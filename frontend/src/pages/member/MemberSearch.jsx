import Header from "../../components/member/MemberHeader";
import Footer from "../../components/member/MemberFooter";

import '../../styles/pages/member/MemberSearch.css';

function MemberSearch() {
  return (
    <>
      <Header />
      <div className="search-result-view">
        <div className="product-view office-list"></div>
      </div>
      <Footer />
    </>
  );
}

export default MemberSearch;