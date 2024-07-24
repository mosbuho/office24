import {createContext, useCallback, useMemo, useReducer, useRef} from 'react';
import './App.css';
import {Routes, Route} from 'react-router-dom';

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
        <Routes>
            <Route path={"/"} element={<Home/>}/>
            <Route path="/member/login" element={<Login/>}/>
            <Route path="/member/register" element={<MemberRegister/>}/>
            <Route path={"/member/update"}  element={<MemberUpdate/>}/>
            <Route path={"/member/delete"} element={<MemberDelete/>}/>
            <Route path={"/member/payment"} element={<Payment/>}/>
        </Routes>
    )
}

export default App
