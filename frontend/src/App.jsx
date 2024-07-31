import { React } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import ManagerLogin from './pages/manager/ManagerLogin';
import ManagerMain from './pages/manager/ManagerMain';
import MemberDelete from './pages/member/MemberDelete';
import MemberLogin from './pages/member/MemberLogin';
import MemberRegister from './pages/member/MemberRegister';
import MemberMain from './pages/member/MemberMain';
import MemberPayment from './pages/member/MemberPayment';
import MemberSearch from './pages/member/MemberSearch';
import MemberUpdate from './pages/member/MemberUpdate';
import AdminLogin from './pages/admin/AdminLogin';
import ManagerRegister from './pages/manager/ManagerRegister';
import AdminMain from './pages/admin/AdminMain';
import PrivateRoute from './components/common/PrivateRoute';
import ManagerOffice from './pages/manager/ManagerOffice';
import MemberFindId from "./pages/member/MemberFindId.jsx";
import MemberResetPw from "./pages/member/MemberResetPw.jsx";
import MemberFindIdResult from "./pages/member/MemberFindIResult.jsx";
import MemberOffice from "./pages/member/MemberOffice.jsx";

function App() {
  return (
    <Router>
      <Routes>
        {/* 공개 라우트 */}
        <Route path="/" element={<MemberMain />} />
        <Route path="/login" element={<MemberLogin />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/member/register" element={<MemberRegister />} />
        <Route path="/manager/register" element={<ManagerRegister />} />
        <Route path="/member/findId" element={<MemberFindId/>}/>
        <Route path="/member/findIdResult" element={<MemberFindIdResult/>}/>
        <Route path="/member/resetPw" element={<MemberResetPw/>}/>
        <Route path="/member/office/:no" element={<MemberOffice/>}/>

        {/* 멤버 보호 라우트 */}
        <Route path="/member/update" element={<PrivateRoute requiredRole="ROLE_MEMBER"><MemberUpdate /></PrivateRoute>} />
        <Route path="/member/delete" element={<PrivateRoute requiredRole="ROLE_MEMBER"><MemberDelete /></PrivateRoute>} />
        <Route path="/payment" element={<PrivateRoute requiredRole="ROLE_MEMBER"><MemberPayment /></PrivateRoute>} />
        <Route path="/search" element={<PrivateRoute requiredRole="ROLE_MEMBER"><MemberSearch /></PrivateRoute>} />

        {/* 매니저 보호 라우트 */}
        <Route path="/manager" element={<ManagerLogin />} />
        <Route path="/manager/:no" element={<PrivateRoute requiredRole="ROLE_MANAGER"><ManagerMain /></PrivateRoute>} />
        <Route path="/manager/office/:no" element={<PrivateRoute requiredRole="ROLE_MANAGER"><ManagerOffice /></PrivateRoute>} />

        {/* 어드민 라우트 추가 */}
        <Route path="/admin" element={<PrivateRoute requiredRole="ROLE_ADMIN"><AdminMain /></PrivateRoute>} />
      </Routes>
    </Router>
  );
}
export default App;