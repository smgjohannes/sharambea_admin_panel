import React from 'react';

import '../styles/Layout.css';

const Layout = ({ children }) => {
  return (
    <div className='layout'>
      <div className='main-content'>
        <div className='content'>{children}</div>
      </div>
    </div>
  );
};

export default Layout;
