import {createContext, useCallback, useMemo, useReducer, useRef, React} from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Main from './pages/Main.jsx';
import ManagerMain from './pages/ManagerMain.jsx';
import AdminMain from './pages/AdminMain.jsx';
import MemberMain from "./pages/MemberMain.jsx";

export const UserStateContext = createContext();
export const UserDispatchContext = createContext();

function App() {
    return (
        <Routes>
            <Route path="/" element={<Main/>}/>
            <Route path="/manager/*" element={<ManagerMain/>}/>
            <Route path="/admin" element={<AdminMain/>}/>
            <Route path={"/member/*"} element={<MemberMain/>}/>
        </Routes>
    );
}

export default App;