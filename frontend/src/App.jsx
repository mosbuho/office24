import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Main from './pages/Main.jsx';
import ManagerMain from './pages/ManagerMain.jsx';
import AdminMain from './pages/AdminMain.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/manager/*" element={<ManagerMain />} />
        <Route path="/admin" element={<AdminMain />} />
      </Routes>
    </Router>
  );
}

export default App;