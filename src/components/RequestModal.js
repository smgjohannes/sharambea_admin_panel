import React from 'react';
import { formatDateTime } from './CommonFunctions';
import '../styles/RequestModal.css';
import { FaDownload } from 'react-icons/fa'; // Import a download icon (Font Awesome or other)

const RequestModal = ({ isOpen, onRequestClose, request }) => {
  if (!request) return null;

  return (
    <div className={`w3-modal ${isOpen ? 'w3-show' : 'w3-hide'} modal`}>
      <div className='w3-modal-content w3-card-4 w3-animate-top'>
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
              <strong>Date of Moving in:</strong> {request.date_of_moving_in}
            </p>
            <p>
              <strong>Date:</strong> {formatDateTime(request.created_at)}
            </p>
            <p>
              <strong>Price:</strong> N${request.price}
            </p>
          </div>

          {/* Display Images if available */}
          {request.Images && request.Images.length > 0 && (
            <div className='w3-margin-bottom'>
              <h3>Attached Images</h3>
              <div className='w3-row-padding'>
                {request.Images.map((image, index) => (
                  <div key={index} className='w3-col s4 m4 l4 image-container'>
                    <div className='image-wrapper'>
                      {/* Display the image */}
                      <img
                        src={image.url}
                        alt={image.name}
                        className='w3-image w3-round'
                        style={{
                          height: '150px',
                          width: '100%',
                          objectFit: 'cover',
                        }}
                      />
                      {/* Download button placed below the image */}
                      <a
                        href={image.url}
                        download={image.name} // Use the 'download' attribute for direct download
                        className='download-icon w3-button w3-green w3-margin-top'>
                        <FaDownload /> Download
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Display Files if available */}
          {request.Files && request.Files.length > 0 && (
            <div className='w3-margin-bottom'>
              <h3>Attached Files</h3>
              <div className='w3-row-padding'>
                {request.Files.map((file, index) => (
                  <div
                    key={index}
                    className='w3-col s4 m6 l11 w3-card-4 w3-center'>
                    <h4>{file.name}</h4>
                    <a
                      href={file.url}
                      download={file.name}
                      className='w3-button w3-green w3-margin-bottom downloadicon '>
                      <FaDownload /> Download
                    </a>
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
