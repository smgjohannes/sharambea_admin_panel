import React from 'react';
import '../styles/DashboardCard.css';

const DashboardCard = ({ title, count, icon }) => {
  return (
    <div className='dashboard-card'>
      <div className='dashboard-card-title--count'>
        <span className='dashboard-card-title'>{title}</span>
        <span className='dashboard-card-count'>{count}</span>
      </div>
      <div className='dashboard-card-icon'>{icon}</div>
    </div>
  );
};

export default DashboardCard;
