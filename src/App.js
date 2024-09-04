import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Requests from './components/Requests';
import NewProperty from './components/NewProperty';
import Advertisement from './components/Advertisement';
import PrivateRoute from './components/PrivateRoute';
import Login from './components/Login';
import Layout from './components/Layout';
import EditProfile from './pages/EditProfile';
import Message from './pages/Message';
import './App.css';

const App = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path='/' element={<Login />} />

        {/* Private Routes with shared Layout */}
        <Route
          path='/*'
          element={
            <PrivateRoute>
              <Layout>
                <Navbar toggleSidebar={toggleSidebar} />
                <Sidebar
                  sidebarOpen={sidebarOpen}
                  closeSidebar={toggleSidebar}
                />
                <Routes>
                  <Route path='/dashboard' element={<Dashboard />} />
                  <Route path='/requests' element={<Requests />} />
                  <Route path='/new-property' element={<NewProperty />} />
                  <Route path='/advertisement' element={<Advertisement />} />
                  <Route path='/edit-profile' element={<EditProfile />} />
                  <Route path='/message' element={<Message />} />
                </Routes>
              </Layout>
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
