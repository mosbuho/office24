import {createContext, useCallback, useMemo, useReducer, useRef, React} from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Main from './pages/Main.jsx';
import ManagerMain from './pages/ManagerMain.jsx';
import AdminMain from './pages/AdminMain.jsx';
import Login from "./pages/Login.jsx";
import MemberRegister from "./pages/MemberRegister.jsx";
import Home from "./pages/Home.jsx";
import MemberUpdate from "./pages/MemberUpdate.jsx";
import MemberDelete from "./pages/MemberDelete.jsx";
import Payment from "./pages/Payment.jsx";

export const UserStateContext = createContext();
export const UserDispatchContext = createContext();

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/manager/*" element={<ManagerMain />} />
        <Route path="/admin" element={<AdminMain />} />
        <Route path="/member/login" element={<Login/>}/>
        <Route path="/member/register" element={<MemberRegister/>}/>
        <Route path={"/member/update"}  element={<MemberUpdate/>}/>
        <Route path={"/member/delete"} element={<MemberDelete/>}/>
        <Route path={"/member/payment"} element={<Payment/>}/>
      </Routes>
    </Router>
  );
}

export default App;