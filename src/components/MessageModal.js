import React from 'react';
import { formatDateTime } from './CommonFunctions';
import '../styles/RequestModal.css';
const MessageModal = ({ isOpen, onMessageClose, request }) => {
  if (!request) return null;

  const { Property } = request;

  return (
    <div className={`w3-modal ${isOpen ? 'w3-show' : 'w3-hide'} modal`}>
      <div className='w3-modal-content w3-card-4 w3-animate-top'>
        <header className='w3-container w3-light-grey'>
          <h2>Full details for {request.name}'s Request</h2>
          <button
            className='w3-button w3-red w3-display-topright w3-margin-top w3-margin-right'
            onClick={onMessageClose}>
            &times;
          </button>
        </header>

        <div className='w3-container w3-padding info-property-content'>
          <div className='w3-margin-bottom info-section'>
            <p>
              <strong>Phone:</strong> {request.phone}
            </p>
            <p>
              <strong>Email:</strong> {request.email}
            </p>
            <p>
              <strong>Viewing Date & Time:</strong>{' '}
              {formatDateTime(request.viewing_date_time)}
            </p>
            <p>
              <strong>Message:</strong> {request.message}
            </p>
            <p>
              <strong>Date:</strong> {formatDateTime(request.created_at)}
            </p>
            {Property && (
              <div className='w3-margin-bottom info-section'>
                <h3>Property Details</h3>
                <p>
                  <strong>Property Name:</strong> {Property.name}
                </p>
                <p>
                  <strong>Price:</strong> N${Property.price}
                </p>
              </div>
            )}
          </div>

          {Property && Property.Images && Property.Images.length > 0 && (
            <div className='w3-margin-bottom property-info-section '>
              <h3>Attached Pictures</h3>
              <div className='w3-row-padding'>
                {Property.Images.map((image, index) => (
                  <div key={index} className='w3-col s4 m4 l4 '>
                    <img
                      src={image.url}
                      alt={image.name}
                      className='w3-image w3-round w3-margin-bottom '
                      style={{ height: '120px', width: '450px' }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <footer className='w3-container w3-light-grey w3-padding w3-margin-bottom'>
          <h3>Safe & Secure</h3>
        </footer>
      </div>
    </div>
  );
};

export default MessageModal;
