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

function App() {
  return (
    <Router>
      <Routes>
        {/* 멤버 */}
        <Route path="/" element={<MemberMain />} />
        <Route path="/login" element={<MemberLogin />} />
        <Route path="/member/register" element={<MemberRegister />} />
        <Route path="/member/update" element={<MemberUpdate />} />
        <Route path="/member/delete" element={<MemberDelete />} />
        <Route path="/payment" element={<MemberPayment />} />
        <Route path="/search" element={<MemberSearch />} />
        {/* 매니저 */}
        <Route path="/manager" element={<ManagerMain />} />
        <Route path="/manager/login" element={<ManagerLogin />} />
        <Route path="/manager/register" element={<ManagerRegister />} />
        {/* 어드민 */}
        <Route path="/admin/login" element={<AdminLogin />} />
      </Routes>
    </Router>
  );
}

export default App;