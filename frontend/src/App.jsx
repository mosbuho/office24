import { React } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import MemberMain from './pages/member/MemberMain';
import MemberLogin from './pages/member/MemberLogin';
import MemberRegister from './pages/member/MemberRegister';
import MemberUpdate from './pages/member/MemberUpdate';
import MemberDelete from './pages/member/MemberDelete';
import MemberPayment from './pages/member/MemberPayment';
import MemberSearch from './pages/member/MemberSearch';
import ManagerMain from './pages/manager/ManagerMain';
import ManagerLogin from './pages/manager/ManagerLogin';

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
        <Route path="/manager/login" element={<ManagerLogin />} />
        <Route path="/manager" element={<ManagerMain />} />
        {/* 어드민 */}
      </Routes>
    </Router>
  );
}

export default App;