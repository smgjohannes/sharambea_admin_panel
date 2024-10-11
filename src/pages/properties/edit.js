import React, { useEffect, useState } from 'react';

import { useParams } from 'react-router-dom';
import { HttpClient } from '../../utils/HttpClient';

const EditProperty = () => {
  const { propertyId } = useParams();
  const [property, setProperty] = useState(null);

  // Fetch property data
  useEffect(() => {
    const httpClient = new HttpClient();
    const fetchProperty = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await httpClient.get(`/properties/${propertyId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProperty(response.data);
      } catch (error) {
        console.error('Error fetching property:', error);
      }
    };

    fetchProperty();
  }, [propertyId]);

  // Handle property save
  const handleSave = async (e) => {
    const httpClient = new HttpClient();
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await httpClient.patch(`/properties/${propertyId}`, property, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Handle successful save (e.g., navigate back to property list)
    } catch (error) {
      console.error('Error saving property:', error);
    }
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Directly set the value for string fields
    setProperty((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle image change with file size validation
  const handleImageChange = (e) => {
    const files = e.target.files;
    const maxSize = 1 * 1024 * 1024; // 1MB
    const validFiles = Array.from(files).filter((file) => file.size <= maxSize);

    if (validFiles.length !== files.length) {
      alert('Some files are larger than 1MB and were not added.');
    }

    setProperty((prevState) => ({
      ...prevState,
      images: validFiles,
    }));
  };

  if (!property) return <div>Loading...</div>;

  // Form input fields generation
  const renderInput = (label, name, value, type = 'text', placeholder = '') => (
    <div className='w3-third'>
      <label>{label}</label>
      <input
        className='w3-input'
        type={type}
        name={name}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
      />
    </div>
  );

  const renderSelect = (label, name, value, options) => (
    <div className='w3-third'>
      <label>{label}</label>
      <select
        className='w3-select'
        name={name}
        value={value}
        onChange={handleChange}>
        <option value=''>Select</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <div>
      <h1>Edit {property.property_name}</h1>
      <form onSubmit={handleSave} className='w3-container'>
        {/* Basic Information */}
        <section className='w3-section infor-category--container'>
          <h3>Basic Information</h3>
          <div className='w3-row-padding'>
            {renderInput('Seller or Buyer Name', 'name', property.name)}
            {renderInput(
              'Property Name',
              'property_name',
              property.property_name
            )}
          </div>
          <div className='w3-row-padding'>
            {renderInput('Price', 'price', property.price)}
            {renderInput(
              'Monthly Rates (%)',
              'monthly_rates',
              property.monthly_rates,
              'text',
              '%'
            )}
            {renderInput('Monthly Levy', 'monthky_levy', property.monthky_levy)}
          </div>
          <div className='w3-row-padding'>
            {renderInput(
              'Size (sq ft)',
              'area_measurement',
              property.area_measurement
            )}
            {renderSelect(
              'Property Type',
              'property_type',
              property.property_type,
              ['sell', 'rent']
            )}
            {renderSelect('Category', 'category', property.category, [
              'house',
              'apartment/flat',
              'farm',
              'vacant land/plot',
              'townhouse',
              'industrial property',
              'commercial property',
            ])}
          </div>
          <div className='w3-row-padding'>
            <label>Property Description</label>
            <textarea
              className='w3-input'
              name='property_description'
              value={property.property_description}
              onChange={handleChange}></textarea>
          </div>
        </section>

        {/* Property Features */}
        <section className='w3-section infor-category--container'>
          <h3>Property Features</h3>
          <div className='w3-row-padding'>
            {renderInput('Bedrooms', 'bedrooms', property.bedrooms)}
            {renderInput('Bathrooms', 'bathrooms', property.bathrooms)}
            {renderInput('Kitchens', 'kitchens', property.kitchens)}
          </div>
          <div className='w3-row-padding'>
            {renderInput(
              'Dining Rooms',
              'dinning_rooms',
              property.dinning_rooms
            )}
            {renderSelect('Garage', 'garage', property.garage, ['Yes', 'No'])}
            {renderInput('Carports', 'carports', property.carports)}
          </div>
          <div className='w3-row-padding'>
            {renderSelect('Garden', 'garden', property.garden, ['Yes', 'No'])}
            {renderSelect(
              'Swimming Pool',
              'swimming_pool',
              property.swimming_pool,
              ['Yes', 'No']
            )}
          </div>
        </section>

        {/* Backyard Property Features */}
        <section className='w3-section infor-category--container'>
          <h3>Backyard Property Features</h3>
          <div className='w3-row-padding'>
            {renderSelect(
              'Backyard Flat',
              'outside_flat',
              property.outside_flat,
              ['true', 'false']
            )}
            {renderInput('TV Space', 'tv_space', property.tv_space)}
            {renderInput('Kitchenette', 'kitchenette', property.kitchenette)}
            {renderInput('Parking', 'parking', property.parking)}
          </div>
        </section>

        {/* Location Details */}
        <section className='w3-section infor-category--container'>
          <h3>Location Details</h3>
          <div className='w3-row-padding'>
            {renderInput('House Number', 'house_number', property.house_number)}
            {renderInput('Street Name', 'street_name', property.street_name)}
            {renderInput('Region', 'region', property.region)}
          </div>
          <div className='w3-row-padding'>
            {renderInput('Town', 'town', property.town)}
            {renderInput('Suburb', 'suburb', property.suburb)}
          </div>
        </section>

        {/* Additional Features */}
        <section className='w3-section infor-category--container'>
          <h3>Additional Features</h3>
          <div className='w3-row-padding'>
            {renderInput('Roof Type', 'roof_type', property.roof_type)}
            {renderInput('Floor Cover', 'floor_cover', property.floor_cover)}
            {/* Continue with additional inputs as needed */}
          </div>
        </section>

        {/* Image Upload */}
        <section className='w3-section infor-category--container'>
          <h3>Property Images</h3>
          <input type='file' multiple onChange={handleImageChange} />
        </section>

        {/* Submit Button */}
        <div className='w3-section'>
          <button type='submit' className='w3-button w3-green'>
            Save Property
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProperty;
