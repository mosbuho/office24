import { Route, BrowserRouter, Routes } from 'react-router-dom';
import PrivateRoute from './components/common/PrivateRoute';
import PublicRoute from './components/common/PublicRoute';
import NotFoundPage from './components/common/NotFound';


import MemberDelete from "./pages/member/MemberDelete";
import MemberFindId from "./pages/member/MemberFindId";
import MemberFindIdResult from "./pages/member/MemberFindIResult";
import MemberLogin from "./pages/member/MemberLogin";
import MemberMain from "./pages/member/MemberMain";
import MemberOffice from "./pages/member/MemberOffice";
import MemberPayment from "./pages/member/MemberPayment";
import MemberRegister from "./pages/member/MemberRegister";
import MemberResetPw from "./pages/member/MemberResetPw";
import MemberSearch from "./pages/member/MemberSearch";
import MemberUpdate from "./pages/member/MemberUpdate";


import ManagerCreate from './pages/manager/ManagerCreate';
import ManagerLogin from './pages/manager/ManagerLogin';
import ManagerMain from './pages/manager/ManagerMain';
import ManagerOfficeCreate from './pages/manager/ManagerOfficeCreate';
import ManagerOfficeUpdate from './pages/manager/ManagerOfficeUpdate';
import ManagerBooking from './pages/manager/ManagerBooking';
import ManagerOfficeList from './pages/manager/ManagerOfficeList';
import ManagerInfo from './pages/manager/ManagerInfo';
import ManagerFindId from './pages/manager/ManagerFindId';
import ManagerResetPw from './pages/manager/ManagerResetPw';

import AdminBookingList from "./pages/admin/AdminBookingList";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminMain from "./pages/admin/AdminMain";
import AdminManager from "./pages/admin/AdminManager";
import AdminManagerList from "./pages/admin/AdminManagerList";
import AdminMember from "./pages/admin/AdminMember";
import AdminMemberList from "./pages/admin/AdminMemberList";
import AdminNotice from "./pages/admin/AdminNotice";
import AdminNoticeCreate from "./pages/admin/AdminNoticeCreate";
import AdminNoticeList from "./pages/admin/AdminNoticeList";
import AdminOffice from "./pages/admin/AdminOffice";
import AdminOfficeList from "./pages/admin/AdminOfficeList";
import AdminReviewList from "./pages/admin/AdminReviewList";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 공개 라우트 */}
        <Route path="/" element={<MemberMain />} />
        <Route path="/office/:officeNo" element={<MemberOffice />} />

        {/* 비로그인 라우트 */}
        <Route path="/login" element={<PublicRoute><MemberLogin /></PublicRoute>} />
        <Route path="/admin/login" element={<PublicRoute><AdminLogin /></PublicRoute>} />
        <Route path="/member/register" element={<PublicRoute><MemberRegister /></PublicRoute>} />
        <Route path="/manager/create" element={<PublicRoute><ManagerCreate /></PublicRoute>} />
        <Route path="/member/find-id" element={<PublicRoute><MemberFindId /></PublicRoute>} />
        <Route path="/member/find-id-result" element={<PublicRoute><MemberFindIdResult /></PublicRoute>} />
        <Route path="/member/reset-pw" element={<PublicRoute><MemberResetPw /></PublicRoute>} />
        <Route path="/manager/login" element={<PublicRoute><ManagerLogin /></PublicRoute>} />
        <Route path="/manager/find-id" element={<PublicRoute><ManagerFindId /></PublicRoute>} />
        <Route path="/manager/reset-pw" element={<PublicRoute><ManagerResetPw /></PublicRoute>} />
                                      
        {/* 멤버 라우트 */}
        <Route path="/member/update" element={<PrivateRoute requiredRole="ROLE_MEMBER"><MemberUpdate /></PrivateRoute>}/>
        <Route path="/member/delete" element={<PrivateRoute requiredRole="ROLE_MEMBER"><MemberDelete /></PrivateRoute>}/>
        <Route path="/payment" element={<PrivateRoute requiredRole="ROLE_MEMBER"><MemberPayment /></PrivateRoute>}/>
        <Route path="/search" element={<PrivateRoute requiredRole="ROLE_MEMBER"><MemberSearch /></PrivateRoute>}/>

        {/* 매니저 라우트 */}
        <Route path="/manager/" element={<PrivateRoute requiredRole="ROLE_MANAGER"><ManagerMain /></PrivateRoute>} />
        <Route path="/manager/office" element={<PrivateRoute requiredRole="ROLE_MANAGER"><ManagerOfficeList /></PrivateRoute>} />
        <Route path="/manager/office/create" element={<PrivateRoute requiredRole="ROLE_MANAGER"><ManagerOfficeCreate /></PrivateRoute>} />
        <Route path="/manager/office/:officeNo/update" element={<PrivateRoute requiredRole="ROLE_MANAGER"><ManagerOfficeUpdate /></PrivateRoute>} />
        <Route path="/manager/booking" element={<PrivateRoute requiredRole="ROLE_MANAGER"><ManagerBooking /></PrivateRoute>} />
        <Route path="/manager/info" element={<PrivateRoute requiredRole="ROLE_MANAGER"><ManagerInfo /></PrivateRoute>} />

        {/* 어드민 라우트 */}
        <Route path="/admin" element={<PrivateRoute requiredRole="ROLE_ADMIN"><AdminMain /></PrivateRoute>} />
        <Route path="/admin/member" element={<PrivateRoute requiredRole="ROLE_ADMIN"><AdminMemberList /></PrivateRoute>} />
        <Route path="/admin/member/:no" element={<PrivateRoute requiredRole="ROLE_ADMIN"><AdminMember /></PrivateRoute>} />
        <Route path="/admin/manager" element={<PrivateRoute requiredRole="ROLE_ADMIN"><AdminManagerList /></PrivateRoute>} />
        <Route path="/admin/manager/:no" element={<PrivateRoute requiredRole="ROLE_ADMIN"><AdminManager /></PrivateRoute>} />
        <Route path="/admin/office" element={<PrivateRoute requiredRole="ROLE_ADMIN"><AdminOfficeList /></PrivateRoute>} />
        <Route path="/admin/office/:no" element={<PrivateRoute requiredRole="ROLE_ADMIN"><AdminOffice /></PrivateRoute>} />
        <Route path="/admin/review" element={<PrivateRoute requiredRole="ROLE_ADMIN"><AdminReviewList /></PrivateRoute>} />
        <Route path="/admin/booking" element={<PrivateRoute requiredRole="ROLE_ADMIN"><AdminBookingList /></PrivateRoute>} />
        <Route path="/admin/notice" element={<PrivateRoute requiredRole="ROLE_ADMIN"><AdminNoticeList /></PrivateRoute>} />
        <Route path="/admin/notice/:no" element={<PrivateRoute requiredRole="ROLE_ADMIN"><AdminNotice /></PrivateRoute>} />
        <Route path="/admin/notice/create" element={<PrivateRoute requiredRole="ROLE_ADMIN"><AdminNoticeCreate /></PrivateRoute>} />

        {/* 에러 */}
        <Route path="*" element={<NotFoundPage />} />

      </Routes>
    </BrowserRouter>
  );
}
export default App;
