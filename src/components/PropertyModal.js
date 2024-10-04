import React, { useState, useEffect } from 'react';
import '../styles/AddEditFormProperty.css';
import axios from 'axios';

const PropertyModal = ({ show, onClose, onSubmit, propertyData }) => {
  const [property, setProperty] = useState(propertyData || {});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (propertyData) {
      setProperty(propertyData);
    } else {
      setProperty({
        property_name: '',
        name: '',
        price: '',
        property_description: '',
        area_measurement: '',
        bedrooms: '',
        suburb: '',
        region: '',
        bathrooms: '',
        kitchens: '',
        dinning_rooms: '',
        description: '',
        category: '',
        images: [],
        town: '',
        property_type: '',
        roof_type: '',
        monthky_levy: '',
        monthly_rates: '',
        window_type: '',
        swimming_pool: '',
        garden: '',
        garage: '',
        carports: '',
        ready_to_occupy: '',
      });
    }
  }, [propertyData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProperty({ ...property, [name]: value });
  };

  const handleImageChange = (e) => {
    const files = e.target.files;
    const maxSize = 1 * 1024 * 1024; // 1MB in bytes
    const validFiles = Array.from(files).filter((file) => file.size <= maxSize);

    if (validFiles.length !== files.length) {
      alert('Some files are larger than 1MB and were not added.');
    }

    setProperty({ ...property, images: validFiles });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    const formData = new FormData();
    for (const key in property) {
      if (key === 'images') {
        property.images.forEach((file) => {
          formData.append('images', file);
        });
      } else {
        formData.append(key, property[key]);
      }
    }

    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    };

    try {
      let response;
      if (propertyData && propertyData.id) {
        response = await axios.patch(
          `http://127.0.0.1:4343/api/v1/properties/${propertyData.id}`,
          formData,
          { headers }
        );
      } else {
        response = await axios.post(
          'http://127.0.0.1:4343/api/v1/properties',
          formData,
          { headers }
        );
      }

      if (response.status === 200 || response.status === 201) {
        setIsSubmitted(true);
        onSubmit();
        onClose();
      }
    } catch (error) {
      setError('Error submitting form.');
    }
  };

  if (!show) {
    return null;
  }

  return (
    <div
      className='w3-modal modal'
      style={{ display: show ? 'block' : 'none' }}>
      <div className='w3-modal-overlay' onClick={onClose}></div>
      <div className='w3-modal-content w3-animate-top w3-card-4'>
        <header className='w3-container w3-dark-grey'>
          <span
            onClick={onClose}
            className='w3-button w3-display-topright w3-margin-top w3-red'>
            &times;
          </span>
          <h2>{propertyData ? 'Edit Property' : 'Add New Property'}</h2>
          {isSubmitted && (
            <p className='w3-text-green'>Property added successfully!</p>
          )}
          {error && <p className='w3-text-red'>{error}</p>}
        </header>
        <form onSubmit={handleSubmit} className='w3-container'>
          <div className='w3-section infor-category--container'>
            {/* Basic Information */}
            <h3>Basic Information</h3>
            <div className='w3-row-padding'>
              <div className='w3-half'>
                <label>Seller or Buyer Name</label>
                <input
                  className='w3-input'
                  type='text'
                  name='name'
                  value={property.name}
                  onChange={handleChange}
                />
              </div>
              <div className='w3-half'>
                <label>Property Name</label>
                <input
                  className='w3-input'
                  type='text'
                  name='property_name'
                  value={property.property_name}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className='w3-row-padding'>
              <div className='w3-third'>
                <label>Price</label>
                <input
                  className='w3-input'
                  type='text'
                  name='price'
                  value={property.price}
                  onChange={handleChange}
                />
              </div>
              <div className='w3-third'>
                <label>monthly Rates</label>
                <input
                  className='w3-input'
                  type='text'
                  name='monthly_rates'
                  value={property.monthly_rates}
                  onChange={handleChange}
                  placeholder='%'
                />
              </div>
              <div className='w3-third'>
                <label> monthky_levy</label>
                <input
                  className='w3-input'
                  type='text'
                  name='monthky_levy'
                  value={property.monthky_levy}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className='w3-row-padding'>
              <div className='w3-third'>
                <label>Size (sq ft)</label>
                <input
                  className='w3-input'
                  type='text'
                  name='area_measurement'
                  value={property.area_measurement}
                  onChange={handleChange}
                />
              </div>
              <div className='w3-third'>
                <label>Property Type</label>
                <select
                  className='w3-select'
                  name='property_type'
                  value={property.property_type}
                  onChange={handleChange}>
                  <option value=''>Select type</option>
                  <option value='sell'>Sell</option>
                  <option value='rent'>Rent</option>
                </select>
              </div>
              <div className='w3-third'>
                <label>Category</label>
                <select
                  className='w3-select'
                  name='category'
                  value={property.category}
                  onChange={handleChange}>
                  <option value=''>Select Category</option>
                  <option value='house'>House</option>
                  <option value='apartment/flat'>Apartment/flat</option>
                  <option value='farm'>Farm</option>
                  <option value='vacant land/plot'>Vacant land/plot</option>
                  <option value='townhouse'>Townhouse</option>
                  <option value='industrial property'>
                    Industrial property
                  </option>
                  <option value='comercial property'>Comercial property</option>
                </select>
              </div>
            </div>

            <div className='w3-row-padding'>
              <div className='w3-col'>
                <label>Property Description</label>
                <textarea
                  className='w3-input'
                  name='property_description'
                  value={property.property_description}
                  onChange={handleChange}></textarea>
              </div>
            </div>
          </div>

          {/* Property Features */}
          <div className='w3-section infor-category--container'>
            <h3>Property Features</h3>
            <div className='w3-row-padding'>
              <div className='w3-third'>
                <label>Bedrooms</label>
                <input
                  className='w3-input'
                  type='text'
                  name='bedrooms'
                  value={property.bedrooms}
                  onChange={handleChange}
                />
              </div>
              <div className='w3-third'>
                <label>Bathrooms</label>
                <input
                  className='w3-input'
                  type='text'
                  name='bathrooms'
                  value={property.bathrooms}
                  onChange={handleChange}
                />
              </div>
              <div className='w3-third'>
                <label>Kitchens</label>
                <input
                  className='w3-input'
                  type='text'
                  name='kitchens'
                  value={property.kitchens}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className='w3-row-padding'>
              <div className='w3-third'>
                <label>Dining Rooms</label>
                <input
                  className='w3-input'
                  type='text'
                  name='dinning_rooms'
                  value={property.dinning_rooms}
                  onChange={handleChange}
                />
              </div>
              <div className='w3-third'>
                <label>Garage</label>
                <select
                  className='w3-select'
                  name='garage'
                  value={property.garage}
                  onChange={handleChange}>
                  <option value=''>Select</option>
                  <option value='Yes'>Yes</option>
                  <option value='No'>No</option>
                </select>
              </div>
              <div className='w3-third'>
                <label>Carports</label>
                <input
                  className='w3-input'
                  type='text'
                  name='carports'
                  value={property.carports}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className='w3-row-padding'>
              <div className='w3-third'>
                <label>Garden</label>
                <select
                  className='w3-select'
                  name='garden'
                  value={property.garden}
                  onChange={handleChange}>
                  <option value=''>Select</option>
                  <option value='Yes'>Yes</option>
                  <option value='No'>No</option>
                </select>
              </div>

              <div className='w3-third'>
                <label>Swimming Pool</label>
                <select
                  className='w3-select'
                  name='swimming_pool'
                  value={property.swimming_pool}
                  onChange={handleChange}>
                  <option value=''>Select</option>
                  <option value='Yes'>Yes</option>
                  <option value='No'>No</option>
                </select>
              </div>
            </div>
          </div>
          {/* backyard */}
          <div className='w3-section infor-category--container'>
            <h3>Backyard Property Features</h3>
            <div className='w3-row-padding'>
              <div className='w3-third'>
                <label>Backyard flat</label>
                <select
                  className='w3-select'
                  name='outside_flat'
                  value={property.outside_flat}
                  onChange={handleChange}>
                  <option value=''>Select</option>
                  <option value='true'>Yes</option>
                  <option value='false'>No</option>
                </select>
              </div>

              <div className='w3-third'>
                <label>TV Space</label>
                <input
                  className='w3-input'
                  type='text'
                  name='tv_space'
                  value={property.tv_space}
                  onChange={handleChange}
                />
              </div>
              <div className='w3-third'>
                <label>Kitchenette</label>
                <input
                  className='w3-input'
                  type='text'
                  name='kitchenette'
                  value={property.kitchenette}
                  onChange={handleChange}
                />
              </div>
              <div className='w3-third'>
                <label>Parking</label>
                <input
                  className='w3-input'
                  type='text'
                  name='parking'
                  value={property.parking}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Location Details */}
          <div className='w3-section infor-category--container'>
            <h3>Location Details</h3>
            <div className='w3-row-padding'>
              <div className='w3-third'>
                <label>House Number</label>
                <input
                  className='w3-input'
                  type='text'
                  name='house_number'
                  value={property.house_number}
                  onChange={handleChange}
                />
              </div>
              <div className='w3-third'>
                <label>street Name:</label>
                <input
                  className='w3-input'
                  type='text'
                  name='street_name'
                  value={property.street_name}
                  onChange={handleChange}
                />
              </div>
              <div className='w3-third'>
                <label>Region</label>
                <input
                  className='w3-input'
                  type='text'
                  name='region'
                  value={property.region}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className='w3-row-padding'>
              <div className='w3-half'>
                <label>Town</label>
                <input
                  className='w3-input'
                  type='text'
                  name='town'
                  value={property.town}
                  onChange={handleChange}
                />
              </div>
              <div className='w3-half'>
                <label>Suburb</label>
                <input
                  className='w3-input'
                  type='text'
                  name='suburb'
                  value={property.suburb}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Additional Features */}
          <div className='w3-section infor-category--container'>
            <h3>Additional Features</h3>
            <div className='w3-row-padding'>
              <div className='w3-third'>
                <label>Roof Type</label>
                <input
                  className='w3-input'
                  type='text'
                  name='roof_type'
                  value={property.roof_type}
                  onChange={handleChange}
                />
              </div>
              <div className='w3-third'>
                <label>Floor Cover</label>
                <input
                  className='w3-input'
                  type='text'
                  name='floor_cover'
                  value={property.floor_cover}
                  onChange={handleChange}
                />
              </div>
              <div className='w3-third'>
                <label>Window Type</label>
                <input
                  className='w3-input'
                  type='text'
                  name='window_type'
                  value={property.window_type}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className='w3-row-padding'>
              <div className='w3-third'>
                <label>Ready to Occupy</label>
                <select
                  className='w3-select'
                  name='ready_to_occupy'
                  value={property.ready_to_occupy}
                  onChange={handleChange}>
                  <option value=''>Select</option>
                  <option value={true}>Yes</option>
                  <option value={false}>No</option>
                </select>
              </div>
            </div>
          </div>

          {/* Image Upload */}
          <div className='w3-section infor-category--container'>
            <h3>Upload Images (max size 1MB each)</h3>
            <div className='w3-row'>
              <div className='w3-col'>
                <input
                  className='w3-input'
                  type='file'
                  name='images'
                  multiple
                  accept='image/*'
                  onChange={handleImageChange}
                />
              </div>
            </div>
          </div>

          <footer className='w3-container w3-light-grey w3-padding w3-margin-bottom '>
            <button type='submit' className='w3-button w3-yellow '>
              {propertyData ? 'Update Property' : 'Add Property'}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
};

export default PropertyModal;
