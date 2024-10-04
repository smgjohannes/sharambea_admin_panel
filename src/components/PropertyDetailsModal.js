import React, { useEffect } from 'react';
import axios from 'axios';
import '../styles/PropertyDetailsModal.css';

const PropertyDetailsModal = ({ show, onClose, property }) => {
  useEffect(() => {
    if (!show || !property) return;
    const token = localStorage.getItem('token');
    const interestedBuyers = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:4343/api/v1/properties/${property.id}/interestedBuyer`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching property:', error);
      }
    };

    interestedBuyers();
  }, [show, property]);

  return (
    <div className={`w3-modal ${show ? 'w3-show' : 'w3-hide'}`}>
      <div className='w3-modal-content w3-card-4 w3-animate-top'>
        <header className='w3-container w3-light-grey'>
          <h2>{property.property_name}</h2>
          <button
            className='w3-button w3-red w3-display-topright w3-margin-top w3-margin-right'
            onClick={onClose}>
            &times;
          </button>
        </header>

        <div className='w3-container w3-padding info-property-content'>
          <div className='w3-margin-bottom info-section'>
            <p>
              <strong>Name:</strong> {property.name}
            </p>
            <p>
              <strong>Suburb:</strong> {property.suburb}
            </p>
            <p>
              <strong>Description:</strong> {property.property_description}
            </p>
          </div>

          {property.Images && property.Images.length > 0 && (
            <div className='w3-margin-bottom'>
              <h3>Attached Pictures</h3>
              <div className='w3-row-padding'>
                {property.Images.map((image, index) => (
                  <div key={index} className='w3-col s4 m4 l4'>
                    <img
                      src={image.url}
                      alt={property.property_name}
                      className='w3-image w3-round w3-margin-bottom'
                      style={{ height: '120px', width: '450px' }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <footer className='w3-container w3-light-grey w3-padding w3-margin-bottom'>
          <button className='w3-button w3-red w3-margin-top' onClick={onClose}>
            Close
          </button>
        </footer>
      </div>
    </div>
  );
};

export default PropertyDetailsModal;
