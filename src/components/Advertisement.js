import React, { useEffect, useState } from 'react';

import PropertyCard from './PropertyCard';
import PropertyModal from './PropertyModal';

import '../styles/Advertisement.css';
import { HttpClient } from '../utils/HttpClient';

const Advertisement = () => {
  const [properties, setProperties] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);

  useEffect(() => {
    const fetchProperties = async () => {
      const httpClient = new HttpClient();
      try {
        const token = localStorage.getItem('token');
        const response = await httpClient.get('/properties', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProperties(response.data);
      } catch (error) {
        console.error('Error fetching properties:', error.response.data);
      }
    };

    fetchProperties();
  }, []);

  const handleDelete = async (id) => {
    const httpClient = new HttpClient();
    const token = localStorage.getItem('token');
    try {
      await httpClient.delete(`/properties/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProperties(properties.filter((property) => property.id !== id));
    } catch (error) {
      console.error('Error deleting property', error);
    }
  };

  const handleAddProperty = () => {
    setSelectedProperty(null);
    setShowModal(true);
  };

  const handleEditProperty = (property) => {
    setSelectedProperty(property);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleFormSubmit = async (property) => {
    const token = localStorage.getItem('token');
    const httpClient = new HttpClient();
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    if (selectedProperty) {
      try {
        const response = await httpClient.post(
          `/${selectedProperty.id}`,
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
      try {
        const response = await httpClient.post('/properties', property, config);
        setProperties([...properties, response.data]);
      } catch (error) {
        console.error('Error adding property', error);
      }
    }

    setShowModal(false);
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
