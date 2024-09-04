import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PropertyCard from './PropertyCard';
import PropertyModal from './PropertyModal';

import '../styles/Advertisement.css';

const Advertisement = () => {
  const [properties, setProperties] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const token = localStorage.getItem('token'); // Retrieve the token from storage
        const response = await axios.get(
          'http://127.0.0.1:4343/api/v1/properties',
          {
            headers: {
              Authorization: `Bearer ${token}`, // Set the authorization header
            },
          }
        );
        console.log(response.data);
        setProperties(response.data); // Set the properties state with the fetched data
      } catch (error) {
        console.error('Error fetching properties:', error.response.data);
      }
    };

    fetchProperties();
  }, []);

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://127.0.0.1:4343/api/v1/properties/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Set the authorization header
        },
      });
      setProperties(properties.filter((property) => property.id !== id));
    } catch (error) {
      console.error('Error deleting property', error);
    }
  };

  const handleAddProperty = () => {
    setSelectedProperty(null); // Clear selected property
    setShowModal(true); // Open modal
  };

  const handleEditProperty = (property) => {
    setSelectedProperty(property); // Set the property to be edited
    setShowModal(true); // Open modal
  };

  const handleModalClose = () => {
    setShowModal(false); // Close modal
  };

  const handleFormSubmit = async (property) => {
    const token = localStorage.getItem('token');

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    if (selectedProperty) {
      // Update logic
      try {
        const response = await axios.put(
          `http://127.0.0.1:4343/api/v1/properties/${selectedProperty.id}`,
          property,
          config
        );
        setProperties(
          properties.map((p) =>
            p.id === selectedProperty.id ? response.data : p
          )
        );
      } catch (error) {
        console.error('Error updating property', error);
      }
    } else {
      // Add logic
      try {
        const response = await axios.post(
          'http://127.0.0.1:4343/api/v1/properties',
          property,
          config
        );
        setProperties([...properties, response.data]);
      } catch (error) {
        console.error('Error adding property', error);
      }
    }

    setShowModal(false); // Close modal
  };

  return (
    <>
      <div className='listed-properties-container'>
        <div className='header-container'>
          <h1>Listed Properties</h1>
          <button onClick={handleAddProperty}>+ Add Property</button>
        </div>

        <div className='property-list'>
          {properties.map((property, index) => (
            <PropertyCard
              key={index}
              property={property}
              onDelete={handleDelete}
              onEdit={() => handleEditProperty(property)}
            />
          ))}
        </div>

        <PropertyModal
          show={showModal}
          onClose={handleModalClose}
          onSubmit={handleFormSubmit}
          propertyData={selectedProperty}
        />
      </div>
    </>
  );
};

export default Advertisement;
