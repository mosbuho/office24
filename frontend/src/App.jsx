import { Route, BrowserRouter, Routes } from 'react-router-dom';
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
import MemberFindId from "./pages/member/MemberFindId";
import MemberResetPw from "./pages/member/MemberResetPw";
import MemberFindIdResult from "./pages/member/MemberFindIResult";
import ManagerOfficeRegister from './pages/manager/ManagerOfficeRegister';
import MemberOffice from "./pages/member/MemberOffice";
import ManagerOfficeUpdate from './pages/manager/ManagerOfficeUpdate';
import ManagerBooking from './pages/manager/ManagerBooking';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 공개 라우트 */}
        <Route path="/" element={<MemberMain />} />
        <Route path="/login" element={<MemberLogin />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/member/register" element={<MemberRegister />} />
        <Route path="/manager/register" element={<ManagerRegister />} />
        <Route path="/member/findId" element={<MemberFindId />} />
        <Route path="/member/findIdResult" element={<MemberFindIdResult />} />
        <Route path="/member/resetPw" element={<MemberResetPw />} />
        <Route path="/member/office/:no" element={<MemberOffice />} />
        <Route path="/manager/login" element={<ManagerLogin />} />

        {/* 멤버 보호 */}
        <Route path="/member/update" element={<PrivateRoute requiredRole="ROLE_MEMBER"><MemberUpdate /></PrivateRoute>} />
        <Route path="/member/delete" element={<PrivateRoute requiredRole="ROLE_MEMBER"><MemberDelete /></PrivateRoute>} />
        <Route path="/payment" element={<PrivateRoute requiredRole="ROLE_MEMBER"><MemberPayment /></PrivateRoute>} />
        <Route path="/search" element={<PrivateRoute requiredRole="ROLE_MEMBER"><MemberSearch /></PrivateRoute>} />

        {/* 매니저 보호 */}
        <Route path="/manager/" element={<PrivateRoute requiredRole="ROLE_MANAGER"><ManagerMain /></PrivateRoute>} />
        <Route path="/manager/office/:no" element={<PrivateRoute requiredRole="ROLE_MANAGER"><ManagerOffice /></PrivateRoute>} />
        <Route path="/manager/office/register/:no" element={<PrivateRoute requiredRole="ROLE_MANAGER"><ManagerOfficeRegister/></PrivateRoute>} />
        <Route path="/manager/office/update/:no/:officeNo" element={<PrivateRoute requiredRole="ROLE_MANAGER"><ManagerOfficeUpdate/></PrivateRoute>} />
        <Route path="/manager/booking/:no" element={<PrivateRoute requiredRole="ROLE_MANAGER"><ManagerBooking/></PrivateRoute>} />

        {/* 어드민 라우트 */}
        <Route path="/admin" element={<PrivateRoute requiredRole="ROLE_ADMIN"><AdminMain /></PrivateRoute>} />
        <Route path="/admin/member" element={<PrivateRoute requiredRole="ROLE_ADMIN"><AdminMemberList /></PrivateRoute>} />
        <Route path="/admin/member/:no" element={<PrivateRoute requiredRole="ROLE_ADMIN"><AdminMember /></PrivateRoute>} />
        <Route path="/admin/manager" element={<PrivateRoute requiredRole="ROLE_ADMIN"><AdminManagerList /></PrivateRoute>} />
        <Route path="/admin/manager/:no" element={<PrivateRoute requiredRole="ROLE_ADMIN"><AdminManager /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;