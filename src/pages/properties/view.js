import React, { useEffect, useState } from 'react';

import { useParams, useNavigate } from 'react-router-dom';
import '../../styles/ViewProperty.css';
import PropertyDetailsModal from '../../components/PropertyDetailsModal';
import MessageModal from '../../components/MessageModal';
import { formatDateTime } from '../../components/CommonFunctions';
import { FaTrash } from 'react-icons/fa';
import { HttpClient } from '../../utils/HttpClient';

const ViewProperty = () => {
  const { propertyId } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [buyers, setBuyers] = useState([]);
  const [showPropertyModal, setShowPropertyModal] = useState(false);
  const [selectedBuyer, setSelectedBuyer] = useState(null);
  const [showMessageModal, setShowMessageModal] = useState(false);

  // Fetch property data
  useEffect(() => {
    const httpClient = new HttpClient();
    const fetchProperty = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await httpClient.get(
          `/properties/${propertyId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setProperty(response.data);
      } catch (error) {
        console.error('Error fetching property:', error);
      }
    };

    const fetchBuyers = async () => {
      const httpClient = new HttpClient();
      try {
        const token = localStorage.getItem('token');
        const response = await httpClient.get(
          `/properties/${propertyId}/interestedBuyer`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setBuyers(response.data);
      } catch (error) {
        console.error('Error fetching buyers:', error);
      }
    };

    fetchProperty();
    fetchBuyers();
  }, [propertyId]);

  const handleViewMoreClick = () => {
    setShowPropertyModal(true);
  };

  const handleBuyerClick = (buyer) => {
    setSelectedBuyer(buyer);
    setShowMessageModal(true);
  };

  const handleReturnToProperties = () => {
    navigate('/properties');
  };

  const handleDeleteBuyer = async (buyerId, event) => {
    event.stopPropagation(); 
    const httpClient = new HttpClient();
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this buyer?'
    );
    if (confirmDelete) {
      try {
        const token = localStorage.getItem('token');
        await httpClient.delete(
          `/properties/${propertyId}/interestedBuyer/${buyerId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setBuyers((prevBuyers) =>
          prevBuyers.filter((buyer) => buyer.id !== buyerId)
        );
      } catch (error) {
        console.error('Error deleting buyer:', error);
      }
    }
  };

  if (!property) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className='property-container'>
        {/* Left side - Property information */}
        <div className='property-details'>
          <button onClick={handleViewMoreClick}>View More</button>
          <h1>{property.name}</h1>
          <div className='info-grid'>
            <p>
              <strong>Price:</strong> ${property.price}
            </p>
            <p>
              <strong>Location:</strong> {property.town}, {property.suburb},{' '}
              {property.region}
            </p>
            <p>
              <strong>Bedrooms:</strong> {property.bedrooms}
            </p>
            <p>
              <strong>Category:</strong> {property.category}
            </p>
            <p>
              <strong>Suburb:</strong> {property.suburb}
            </p>
            <p>
              <strong>Property_type:</strong> {property.property_type}
            </p>
            <p>
              <strong>Kitchens:</strong> {property.kitchens}
            </p>
          </div>

          {/* Display attached images */}
          <h3>Property Images</h3>
          <div className='property-images'>
            {property.Images &&
              property.Images.map((image) => (
                <img
                  key={image.id}
                  src={image.url}
                  alt={image.name}
                  className='property-image'
                />
              ))}
          </div>
        </div>

        {/* Right side - Interested buyers table */}
        <div className='buyers-section'>
          <h3>Interested Buyers</h3>
          <table className='buyers-table'>
            <thead>
              <tr>
                <th>Name</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {buyers.length > 0 ? (
                buyers.map((buyer) => (
                  <tr key={buyer.id} onClick={() => handleBuyerClick(buyer)}>
                    <td>{buyer.name}</td>
                    <td>{formatDateTime(buyer.created_at)}</td>
                    <td>
                      <FaTrash
                        style={{ color: 'red', cursor: 'pointer' }}
                        onClick={(event) => handleDeleteBuyer(buyer.id, event)} // Stop event propagation here
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan='3'>No buyers found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Modals */}
        <PropertyDetailsModal
          show={showPropertyModal}
          onClose={() => setShowPropertyModal(false)}
          property={property}
        />
        <MessageModal
          isOpen={showMessageModal}
          onMessageClose={() => setShowMessageModal(false)}
          request={selectedBuyer}
        />
        {/* Button to return to properties */}
      </div>
      <div className='return-button'>
        <button onClick={handleReturnToProperties}>Return to Properties</button>
      </div>
    </>
  );
};

export default ViewProperty;
