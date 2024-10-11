import React, { useState, useEffect } from 'react';
import '../styles/Navbar.css';
import { IoMdMenu, IoIosNotifications } from 'react-icons/io';
import { MdOutlineMessage } from 'react-icons/md';
import logo from '../assets/images/logo3.png';
import { HttpClient } from '../utils/HttpClient';

// import chelsea from '../assets/images/copyche.png';

const Navbar = ({ toggleSidebar }) => {
  const [profileImage, setProfileImage] = useState(null);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const httpClient = new HttpClient();

    httpClient
      .get('/me')
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          if (data.images && data.images.length > 0) {
            setProfileImage(data.images[0].url);
          }
          setUserName(data.name || 'User');
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
