import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { formatDateTime } from './CommonFunctions';
import RequestModal from './RequestModal';
import '../styles/Requests.css';

const Requests = () => {
  const [requests, setRequests] = useState([]);
  const [property_type, setProperty_type] = useState('all');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = localStorage.getItem('token');
        let queryParams = '';

        if (property_type !== 'all') {
          queryParams += `property_type=${property_type}`;
        }

        console.log(`Fetching requests with params: ${queryParams}`);

        const response = await axios.get(
          `http://127.0.0.1:4343/api/v1/requests${
            queryParams ? `?${queryParams}` : ''
          }`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setRequests(response.data);
      } catch (error) {
        console.error('Error fetching requests:', error);
      }
    };

    fetchRequests();
  }, [property_type]);

  const filterByPrice = (requests) => {
    return requests.filter((request) => {
      const price = parseFloat(request.price || 0);
      const min = parseFloat(minPrice || 0);
      const max = parseFloat(maxPrice || Infinity);
      return price >= min && price <= max;
    });
  };

  const filteredRequests = filterByPrice(requests);

  const openModal = (request) => {
    setSelectedRequest(request);
  };

  const closeModal = () => {
    setSelectedRequest(null);
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://127.0.0.1:4343/api/v1/requests/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRequests(requests.filter((request) => request.id !== id));
    } catch (error) {
      console.error('Error deleting request:', error);
    }
  };

  return (
    <div className='requests-container'>
      <h1>Requests</h1>
      <div className='requests-container--filter'>
        <select
          value={property_type}
          onChange={(e) => setProperty_type(e.target.value)}>
          <option value='all'>All</option>
          <option value='sell'>sell</option>
          <option value='buy'>buy</option>
          <option value='rent'>rent</option>
          <option value='comercial'>comercial</option>
        </select>
        <div className='filters-container'>
          <input
            type='number'
            placeholder='Min Price'
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
          <input
            type='number'
            placeholder='Max Price'
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>
      </div>

      <table>
        <thead>
          <tr>
            {/* <th>Name</th> */}
            <th>Phone</th>
            <th>Pro Type</th>
            <th>Cat Type</th>
            <th>Location</th>
            <th>Date</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredRequests.map((request) => (
            <tr key={request.id}>
              {/* <td onClick={() => openModal(request)}>{request.name}</td> */}
              <td onClick={() => openModal(request)}>{request.phone}</td>
              <td onClick={() => openModal(request)}>
                {request.property_type}
              </td>
              <td onClick={() => openModal(request)}>
                {request.category_type}
              </td>
              <td onClick={() => openModal(request)}>{request.location}</td>
              <td onClick={() => openModal(request)}>
                {formatDateTime(request.created_at)}
              </td>
              <td onClick={() => openModal(request)} className='price'>
                N${request.price}
              </td>
              <td className='view-delete-container'>
                <button
                  className='request-view--button'
                  onClick={() => openModal(request)}>
                  View
                </button>
                <button
                  className='request-delete--button'
                  onClick={() => handleDelete(request.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <RequestModal
        isOpen={!!selectedRequest}
        onRequestClose={closeModal}
        request={selectedRequest}
      />
    </div>
  );
};

export default Requests;
