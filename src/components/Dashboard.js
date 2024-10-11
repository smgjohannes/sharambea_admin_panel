import React, { useEffect, useState } from 'react';
import DashboardCard from './DashboardCard';

import '../styles/Dashboard.css';
import { HttpClient } from '../utils/HttpClient';

const Dashboard = () => {
  const [counts, setCounts] = useState({
    rent: 0,
    sell: 0,
    buy: 0,
    total: 0,
  });

  useEffect(() => {
    const httpClient = new HttpClient();
    const token = localStorage.getItem('token');
    const fetchProperties = async () => {
      try {
        const response = await httpClient.get('/properties', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const properties = response.data;

        // Calculate counts for each category
        const rentCount = properties.filter(
          (property) => property.property_type === 'rent'
        ).length;
        const sellCount = properties.filter(
          (property) => property.property_type === 'sell'
        ).length;
        const buyCount = properties.filter(
          (property) => property.property_type === 'buy'
        ).length;
        const comercialCount = properties.filter(
          (property) => property.property_type === 'comercial'
        ).length;
        // Calculate total
        const totalCount = rentCount + sellCount + buyCount + comercialCount;

        setCounts({
          rent: rentCount,
          sell: sellCount,
          buy: buyCount,
          comercialCount,
          total: totalCount,
        });
      } catch (error) {
        console.error('Error fetching properties', error);
      }
    };

    fetchProperties();
  }, []);

  return (
    <>
      <div className='dashboard'>
        <DashboardCard title='Sell' count={counts.sell} icon='🏠' />
        <DashboardCard title='Buy' count={counts.buy} icon='💰' />
        <DashboardCard title='Rent' count={counts.rent} icon='🏢' />
        <DashboardCard title='Total' count={counts.total} icon='📊' />
      </div>
    </>
  );
};

export default Dashboard;
