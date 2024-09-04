import React from 'react';
import { formatDateTime } from './CommonFunctions';
import '../styles/RequestModal.css';

const RequestModal = ({ isOpen, onRequestClose, request }) => {
  if (!request) return null;

  return (
    <div className={`w3-modal ${isOpen ? 'w3-show' : 'w3-hide'} modal`}>
      <div className='w3-modal-content w3-card-4 w3-animate-top '>
        <header className='w3-container w3-light-grey'>
          <h2>Full details for {request.name}'s Request</h2>
          <button
            className='w3-button w3-red w3-display-topright w3-margin-top w3-margin-right'
            onClick={onRequestClose}>
            &times;
          </button>
        </header>

        <div className='w3-container w3-padding info-property-content'>
          <div className='w3-margin-bottom info-section'>
            <p>
              <strong>Phone:</strong> {request.phone}
            </p>
            <p>
              <strong>Property Type:</strong> {request.property_type}
            </p>
            <p>
              <strong>Category Type:</strong> {request.category_type}
            </p>
            <p>
              <strong>Location:</strong> {request.location}
            </p>
            <p>
              <strong>Description:</strong> {request.description}
            </p>
            <p>
              <strong>Dtae of Moving in:</strong> {request.date_of_moving_in}
            </p>
            <p>
              <strong>Date:</strong> {formatDateTime(request.created_at)}
            </p>
            <p>
              <strong>Price:</strong> N${request.price}
            </p>
          </div>

          {request.Images && request.Images.length > 0 && (
            <div className='w3-margin-bottom'>
              <h3>Attached Pictures</h3>
              <div className='w3-row-padding'>
                {request.Images.map((image, index) => (
                  <div key={index} className='w3-col s4 m4 l4'>
                    <img
                      src={image.url}
                      alt={image.name}
                      className='w3-image w3-round'
                      style={{ height: '120px', width: '450px' }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <footer className='w3-container w3-light-grey w3-padding w3-margin-bottom'>
          <button
            className='w3-button w3-red w3-margin-top'
            onClick={onRequestClose}>
            Close
          </button>
        </footer>
      </div>
    </div>
  );
};

export default RequestModal;
