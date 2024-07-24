import React from 'react';
import { Routes, Route} from 'react-router-dom';
import ManagerLogin from './ManagerLogin';
import ManagerDashboard from './ManagerDashboard';

function ManagerMain() {
  return (
    <>
        <Routes>
          <Route path="login" element={<ManagerLogin />} />
          <Route path="dashboard" element={ <ManagerDashboard /> } />
        </Routes>
    </>
  );
}

export default ManagerMain;