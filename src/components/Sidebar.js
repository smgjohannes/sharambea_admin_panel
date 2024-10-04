import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Sidebar.css';

import { FaPowerOff, FaEdit } from 'react-icons/fa';
import { AiFillDashboard } from 'react-icons/ai';
import { RiAdvertisementLine } from 'react-icons/ri';
import { RiGitPullRequestFill } from 'react-icons/ri';
import { MdMessage } from 'react-icons/md';

const Sidebar = ({ sidebarOpen, closeSidebar }) => {
  const [counts, setCounts] = useState({ newRequests: 0, unreadMessages: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch notification counts from the backend
    fetch('/api/notifications/counts')
      .then((response) => response.json())
      .then((data) => setCounts(data))
      .catch((error) =>
        console.error('Error fetching notification counts:', error)
      );
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div
      className={`sidebar ${sidebarOpen ? 'open' : ''}`}
      onClick={closeSidebar}>
      <ul>
        <li>
          <Link to='/dashboard' onClick={closeSidebar}>
            <span className='icon'>
              <AiFillDashboard />
            </span>{' '}
            Dashboard
          </Link>
        </li>
        <li>
          <Link to='/properties' onClick={closeSidebar}>
            <span className='icon'>
              <RiAdvertisementLine />
            </span>{' '}
            Properties
          </Link>
        </li>
        <li>
          <Link to='/requests' onClick={closeSidebar}>
            <span className='icon'>
              <RiGitPullRequestFill />
            </span>{' '}
            Listings Requests{' '}
            <span className='request-count'>{counts.newRequests}</span>
          </Link>
        </li>
        <li>
          <Link to='/message' onClick={closeSidebar}>
            <span className='icon'>
              <MdMessage />
            </span>{' '}
            Interested buyers{' '}
            <span className='request-count'>{counts.unreadMessages}</span>
          </Link>
        </li>
        <li>
          <Link to='/edit-profile' onClick={closeSidebar}>
            <span className='icon'>
              <FaEdit />
            </span>{' '}
            Edit Profile
          </Link>
        </li>
      </ul>
      <div className='logout'>
        <button className='logout-button' onClick={handleLogout}>
          <i>
            <FaPowerOff />
          </i>{' '}
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
