import "../styles/search.css";
import Search from "./layout/Search";

function Search() {
  return (
    <div style={{ margin: "auto", maxWidth: "1800px", minWidth: "500px" }}>
      <Header />
      <Search />
      <div className="search-result-view">
        <div className="product-view office-list"></div>
      </div>
      <Footer />
    </div>
  );
}

export default Search;
