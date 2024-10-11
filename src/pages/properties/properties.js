import React, { useEffect, useState } from 'react';
import PropertyCard from '../../components/PropertyCard';
import PropertyModal from '../../components/PropertyModal';

import { useNavigate } from 'react-router-dom';
import { HttpClient } from '../../utils/HttpClient';
const Properties = () => {
  const [properties, setProperties] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const navigate = useNavigate(); // Get navigate object for navigation
  useEffect(() => {
    const httpClient = new HttpClient();
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    const fetchProperties = async () => {
      try {
        const response = await httpClient.get(`/properties?search=${user.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(response.data);
        setProperties(response.data);
      } catch (error) {
        console.error('Error fetching property:', error);
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
          Authorization: `Bearer ${token}`, // Set the authorization header
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
    const httpClient = new HttpClient();
    const token = localStorage.getItem('token');

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    if (selectedProperty) {
      // Update logic
      try {
        const response = await httpClient.post(
          `/properties/${selectedProperty.id}`,
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
        const response = await httpClient.post('/properties', property, config);
        setProperties([...properties, response.data]);
      } catch (error) {
        console.error('Error adding property', error);
      }
    }

    setShowModal(false); // Close modal
  };
  const handleCreate = () => {
    navigate(`/create_property`); // Navigate to edit page
  };

  return (
    <>
      <div className='listed-properties-container'>
        <div className='header-container'>
          <h1>Listed Properties</h1>
          <button onClick={handleCreate}>+ Add Property</button>
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

export default Properties;
