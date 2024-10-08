import { BrowserRouter, Route, Routes } from 'react-router-dom';
import NotFoundPage from './components/common/NotFound';
import PrivateRoute from './components/common/PrivateRoute';
import PublicRoute from './components/common/PublicRoute';


import MemberMyPage from "./components/member/MemberMyPage";
import MemberDelete from "./pages/member/MemberDelete";
import MemberFindId from "./pages/member/MemberFindId";
import MemberFindIdResult from "./pages/member/MemberFindIResult";
import MemberLogin from "./pages/member/MemberLogin";
import MemberMain from "./pages/member/MemberMain";
import MemberOffice from "./pages/member/MemberOffice";
import MemberPayment from "./pages/member/MemberPayment";
import MemberRegister from "./pages/member/MemberRegister";
import MemberResetPw from "./pages/member/MemberResetPw";
import MemberUpdate from "./pages/member/MemberUpdate";
import MemberBookings from './pages/member/MemberBookings';
import MemberWish from './pages/member/MemberWish';
import MemberProfile from './pages/member/MemberProfile';
import MemberReviews from './pages/member/MemberReviews';
import MemberRefund from './pages/member/MemberRefund';


import ManagerBooking from './pages/manager/ManagerBooking';
import ManagerCreate from './pages/manager/ManagerCreate';
import ManagerFindId from './pages/manager/ManagerFindId';
import ManagerInfo from './pages/manager/ManagerInfo';
import ManagerLogin from './pages/manager/ManagerLogin';
import ManagerMain from './pages/manager/ManagerMain';
import ManagerOfficeCreate from './pages/manager/ManagerOfficeCreate';
import ManagerOfficeList from './pages/manager/ManagerOfficeList';
import ManagerOfficeUpdate from './pages/manager/ManagerOfficeUpdate';
import ManagerResetPw from './pages/manager/ManagerResetPw';
import ManagerRefund from './pages/manager/ManagerRefund';

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
import AdminRefundList from './pages/admin/AdminRefundList';

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
        <Route path="/member/update" element={<PrivateRoute requiredRole="ROLE_MEMBER"><MemberUpdate /></PrivateRoute>} />
        <Route path="/member/delete" element={<PrivateRoute requiredRole="ROLE_MEMBER"><MemberDelete /></PrivateRoute>} />
        <Route path="/payment" element={<PrivateRoute requiredRole="ROLE_MEMBER"><MemberPayment /></PrivateRoute>} />
        <Route path="/member/:no/" element={<PrivateRoute requiredRole="ROLE_MEMBER"><MemberMyPage /></PrivateRoute>}>
          <Route path="profile" element={<MemberProfile />} />
          <Route path="wish" element={<MemberWish />} />
          <Route path="booking" element={<MemberBookings />} />
          <Route path="refund" element={<MemberRefund />} />
          <Route path="review" element={<MemberReviews />} />
        </Route>

        {/* 매니저 라우트 */}
        <Route path="/manager/" element={<PrivateRoute requiredRole="ROLE_MANAGER"><ManagerMain /></PrivateRoute>} />
        <Route path="/manager/office" element={<PrivateRoute requiredRole="ROLE_MANAGER"><ManagerOfficeList /></PrivateRoute>} />
        <Route path="/manager/office/create" element={<PrivateRoute requiredRole="ROLE_MANAGER"><ManagerOfficeCreate /></PrivateRoute>} />
        <Route path="/manager/office/:officeNo/update" element={<PrivateRoute requiredRole="ROLE_MANAGER"><ManagerOfficeUpdate /></PrivateRoute>} />
        <Route path="/manager/booking" element={<PrivateRoute requiredRole="ROLE_MANAGER"><ManagerBooking /></PrivateRoute>} />
        <Route path="/manager/info" element={<PrivateRoute requiredRole="ROLE_MANAGER"><ManagerInfo /></PrivateRoute>} />
        <Route path="/manager/refund" element={<PrivateRoute requiredRole="ROLE_MANAGER"><ManagerRefund /></PrivateRoute>} />

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
        <Route path="/admin/refund" element={<PrivateRoute requiredRole="ROLE_ADMIN"><AdminRefundList /></PrivateRoute>} />
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
