import Logo from "../components/Logo.jsx";
import LoginForm from "../components/LoginForm.jsx";
import Apis from "../components/Apis.jsx";

import "/src/styles/Login.css";



const Login = () => {
    return(
        <div className="container">
            <Logo/>
            <LoginForm/>
            <Apis/>
        </div>
    )
}

export default Login;