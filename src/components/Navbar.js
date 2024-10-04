import React, { useState, useEffect } from 'react';
import '../styles/Navbar.css';
import { IoMdMenu, IoIosNotifications } from 'react-icons/io';
import { MdOutlineMessage } from 'react-icons/md';
import logo from '../assets/images/logo3.png';
// import chelsea from '../assets/images/copyche.png';

const Navbar = ({ toggleSidebar }) => {
  const [notificationCounts, setNotificationCounts] = useState({
    newRequests: 0,
    unreadMessages: 0,
  });
  const [profileImage, setProfileImage] = useState(null);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    // Fetch notification counts from the backend
    fetch('/api/notifications/counts')
      .then((response) => response.json())
      .then((data) => setNotificationCounts(data))
      .catch((error) =>
        console.error('Error fetching notification counts:', error)
      );
  }, []);

  useEffect(() => {
    // Fetch user data including profile image and name from the backend
    const token = localStorage.getItem('token'); // If you're using JWT or another token for authentication
    fetch('http://127.0.0.1:4343/api/v1/me', {
      headers: {
        Authorization: `Bearer ${token}`, // Add auth token if necessary
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          if (data.images && data.images.length > 0) {
            // Assuming the first image is the profile image
            setProfileImage(data.images[0].url);
          }
          // Set the user's name
          setUserName(data.name || 'User'); // Fallback to 'User' if name is not available
        }
      })
      .catch((error) => console.error('Error fetching user data:', error));
  }, []);

  return (
    <nav className='navbar'>
      <div className='logo-search-container'>
        <div className='navbar-logo'>
          <img src={logo} alt='logo' />
        </div>
        <div className='navbar-search'>
          <input type='text' placeholder='Search for results...' />
        </div>
      </div>

      <div className='navbar-icons'>
        <i className='icon-menu' onClick={toggleSidebar}>
          <IoMdMenu />
        </i>
        <i className='icon-notifications'>
          <IoIosNotifications />
          {notificationCounts.newRequests > 0 && (
            <span className='badge'>{notificationCounts.newRequests}</span>
          )}
        </i>
        <i className='icon-messages'>
          <MdOutlineMessage />
          {notificationCounts.unreadMessages > 0 && (
            <span className='badge'>{notificationCounts.unreadMessages}</span>
          )}
        </i>
        <i className='icon-profile'>
          {/* <img
            // src={profileImage || chelsea}
            alt='User Avatar'
            className='avatar'
          /> */}
          <p>Welcome, {userName}</p>
        </i>
      </div>
    </nav>
  );
};

export default Navbar;
