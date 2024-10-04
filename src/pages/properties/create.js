import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../styles/FormProperty.css';

const CreateProperty = () => {
  const initialState = {
    property_name: '',
    name: '',
    house_number: '',
    street_name: '',
    suburb: '',
    town: '',
    region: '',
    property_type: '',
    description: '',
    bedrooms: '',
    bathrooms: '',
    kitchens: '',
    toilets: '',
    dining_rooms: '',
    sitting_rooms: '',
    land_size: '',
    outside_building: false, // Set to false
    flatlet: false, // Set to false
    price: '',
    category: '',
    monthly_levy: '',
    monthly_rates: '',
    kitchenette: false, // Set to false
    parking: false, // Set to false
    images: [],
  };

  const [property, setProperty] = useState(initialState);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;
    setProperty((prev) => ({ ...prev, [name]: fieldValue }));
  };
  const renderCheckbox = (label, name) => (
    <div className='w3-third'>
      <label>{label}</label>
      <input
        className='w3-check'
        type='checkbox'
        name={name}
        checked={!!property[name]}
        onChange={handleChange}
      />
    </div>
  );
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const maxSize = 1 * 1024 * 1024; // 1MB
    const validFiles = files.filter((file) => file.size <= maxSize);

    setError(
      validFiles.length !== files.length
        ? 'Some files are larger than 1MB and were not added.'
        : ''
    );

    setProperty((prev) => ({ ...prev, images: validFiles }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const formData = new FormData();

    Object.entries(property).forEach(([key, value]) => {
      if (key === 'images') {
        value.forEach((file) => formData.append('images', file));
      } else {
        formData.append(key, value);
      }
    });

    try {
      const response = await axios.post(
        'http://127.0.0.1:4343/api/v1/properties',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      if (response.status === 201) {
        setIsSubmitted(true);
        alert('Form submitted successfully!');
        navigate('/properties');
      }
    } catch (err) {
      console.error('Error submitting form:', err);
    }
  };

  const renderInput = (label, name, type = 'text', placeholder = '') => (
    <div className='w3-third'>
      <label>{label}</label>
      <input
        className='w3-input'
        type={type}
        name={name}
        value={property[name]}
        onChange={handleChange}
        placeholder={placeholder}
      />
    </div>
  );

  const renderSelect = (label, name, options) => (
    <div className='w3-third'>
      <label>{label}</label>
      <select
        className='w3-select'
        name={name}
        value={property[name]}
        onChange={handleChange}>
        <option value=''>Select {label.toLowerCase()}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <div className='form-container'>
      <h1>Add New Property</h1>
      {isSubmitted && (
        <p className='success-message'>Property added successfully!</p>
      )}
      {error && <p className='error-message'>{error}</p>}

      <form onSubmit={handleSubmit} className='w3-container'>
        <div className='w3-section infor-category--container'>
          <h3>Basic Information</h3>
          <div className='w3-row-padding'>
            {renderInput('Seller or Buyer Name', 'name')}
            {renderInput('Property Name', 'property_name')}
          </div>
          <div className='w3-row-padding'>
            {renderInput('Price', 'price')}
            {renderInput('Monthly Rates', 'monthly_rates', 'text', '%')}
            {renderInput('Monthly Levy', 'monthly_levy')}
          </div>
          <div className='w3-row-padding'>
            {renderInput('Land Size', 'land_size')}{' '}
            {renderSelect('Property Type', 'property_type', ['sell', 'rent'])}
            {renderSelect('Category', 'category', [
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
              name='description'
              value={property.description}
              onChange={handleChange}></textarea>
          </div>
        </div>

        {/* Property Features */}
        <div className='w3-section infor-category--container'>
          <h3>Property Features</h3>
          <div className='w3-row-padding'>
            {renderInput('Bedrooms', 'bedrooms')}
            {renderInput('Bathrooms', 'bathrooms')}
            {renderInput('Kitchens', 'kitchens')}
          </div>
          <div className='w3-row-padding'>
            {renderInput('Dining Rooms', 'dining_rooms')}
            {renderInput('Sitting Rooms', 'sitting_rooms')}
            {renderInput('Toilets', 'toilets')}
          </div>
        </div>

        {/* Backyard Features */}
        <div className='w3-section infor-category--container'>
          <h3>Backyard Property Features</h3>
          <div className='w3-row-padding'>
            {renderCheckbox('Outside Building', 'outside_building')}
            {renderCheckbox('Flatlet', 'flatlet')}
            {renderCheckbox('Kitchenette', 'kitchenette')}
            {renderCheckbox('Parking', 'parking')}
          </div>
        </div>

        {/* Location Details */}
        <div className='w3-section infor-category--container'>
          <h3>Location Details</h3>
          <div className='w3-row-padding'>
            {renderInput('House Number', 'house_number')}
            {renderInput('Street Name', 'street_name')}
            {renderInput('Region', 'region')}
          </div>
          <div className='w3-row-padding'>
            {renderInput('Town', 'town')}
            {renderInput('Suburb', 'suburb')}
          </div>
        </div>

        <div className='w3-section'>
          <h3>Upload Images</h3>
          <input
            type='file'
            multiple
            accept='image/*'
            onChange={handleImageChange}
          />
        </div>

        <button className='w3-button w3-green' type='submit'>
          Submit
        </button>
      </form>
    </div>
  );
};

export default CreateProperty;
