import Header from "../components/Header.jsx";
import NewList from "../components/NewList.jsx";
import LowList from "../components/LowList.jsx";
import Footer from "../components/Footer.jsx";

import "/src/styles/Home.css";

const Home = () => {
    return (
        <div>
            <Header/>
            <NewList/>
            <LowList/>
            <Footer/>
        </div>
    )
}
export default Home;