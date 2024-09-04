import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { formatDateTime } from '../components/CommonFunctions';
import MessageModal from '../components/MessageModal';
import '../styles/Message.css';

const Message = () => {
  const [interestedBuyer, setInterestedBuyer] = useState([]);
  const [property_type, setProperty_type] = useState('all');
  const [selectedMessage, setSelectedMessage] = useState(null);

  useEffect(() => {
    const fetchInterestedBuyer = async () => {
      try {
        const token = localStorage.getItem('token');
        const queryParams =
          property_type !== 'all' ? `?property_type=${property_type}` : '';
        const response = await axios.get(
          `http://127.0.0.1:4343/api/v1/interestedBuyer${queryParams}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const filteredData = response.data.filter((buyer) => buyer.interested);
        setInterestedBuyer(filteredData);
      } catch (error) {
        console.error('Error fetching InterestedBuyer:', error);
      }
    };

    fetchInterestedBuyer();
  }, [property_type]);

  const openModal = (buyer) => {
    setSelectedMessage(buyer);
  };

  const closeModal = () => {
    setSelectedMessage(null);
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://127.0.0.1:4343/api/v1/interestedBuyer/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInterestedBuyer(interestedBuyer.filter((buyer) => buyer.id !== id));
    } catch (error) {
      console.error('Error deleting request:', error);
    }
  };

  return (
    <div className='requests-container'>
      <h1>Messages from interested buyers</h1>
      <div className='requests-container--filter'>
        <select
          value={property_type}
          onChange={(e) => setProperty_type(e.target.value)}>
          <option value='all'>All</option>
          <option value='interested'>Interested</option>
        </select>
      </div>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Interested</th>
            <th>view Date/Time</th>
            <th>Message</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {interestedBuyer.map((buyer) => (
            <tr key={buyer.id}>
              <td onClick={() => openModal(buyer)}>{buyer.name}</td>
              <td onClick={() => openModal(buyer)}>{buyer.email}</td>
              <td onClick={() => openModal(buyer)}>{buyer.phone}</td>
              <td onClick={() => openModal(buyer)}>
                {buyer.interested ? 'Yes' : 'No'}
              </td>
              <td onClick={() => openModal(buyer)}>
                {formatDateTime(buyer.viewing_date_time)}
              </td>
              <td onClick={() => openModal(buyer)}>{buyer.message}</td>
              <td className='view-delete-container'>
                <button
                  className='request-view--button'
                  onClick={() => openModal(buyer)}>
                  View
                </button>
                <button
                  className='request-delete--button'
                  onClick={() => handleDelete(buyer.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <MessageModal
        isOpen={!!selectedMessage}
        onMessageClose={closeModal}
        request={selectedMessage}
      />
    </div>
  );
};

export default Message;
