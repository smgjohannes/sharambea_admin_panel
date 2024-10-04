// import React, { useState } from 'react';
// import axios from 'axios';
// import '../styles/FormProperty.css';

// const NewProperty = () => {
//   const [property, setProperty] = useState({
//     property_name: '',
//     name: '',
//     price: '',
//     property_description: '',
//     area_measurement: '',
//     bedrooms: '',
//     suburb: '',
//     bathrooms: '',
//     kitchens: '',
//     dinning_rooms: '',
//     description: '',
//     category: '',
//     images: [], // Store images here
//     town: '',
//     property_type: '',
//     property_status: '',
//     ownership: '',
//     latitude: '',
//     longitude: '',
//     roof_type: '',
//     floor_cover: '',
//     window_type: '',
//     braai: '',
//     swimming_pool: '',
//     garden: '',
//     garage: '',
//     carports: '',
//     ready_to_occupy: '',
//   });

//   const [isSubmitted, setIsSubmitted] = useState(false);
//   const [error, setError] = useState('');

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setProperty({ ...property, [name]: value });
//   };

//   const handleImageChange = (e) => {
//     const files = e.target.files;
//     const maxSize = 1 * 1024 * 1024; // 1MB in bytes
//     const validFiles = Array.from(files).filter((file) => file.size <= maxSize);

//     if (validFiles.length !== files.length) {
//       setError('Some files are larger than 1MB and were not added.');
//     } else {
//       setError('');
//     }

//     setProperty({ ...property, images: validFiles });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const token = localStorage.getItem('token');
//     const formData = new FormData();
//     for (const key in property) {
//       if (key === 'images') {
//         property.images.forEach((file) => {
//           formData.append('images', file);
//         });
//       } else {
//         formData.append(key, property[key]);
//       }
//     }

//     try {
//       const response = await axios.post(
//         'http://127.0.0.1:4343/api/v1/properties',
//         formData,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'multipart/form-data',
//           },
//         }
//       );

//       if (response.status === 200) {
//         setIsSubmitted(true);
//         console.log('Form submitted successfully!');
//       }
//     } catch (error) {
//       console.error('Error submitting form:', error);
//     }
//   };

//   return (
//     <div className='form-container'>
//       <h1>Add New Property</h1>
//       {isSubmitted && (
//         <p className='success-message'>Property added successfully!</p>
//       )}
//       {error && <p className='error-message'>{error}</p>}{' '}
//       {/* Display error message */}
//       <form onSubmit={handleSubmit}>
//         {/* Basic Information */}
//         <div className='form-row'>
//           <label className='form-label'>
//             Seller or buyer Name:
//             <input
//               type='text'
//               name='name'
//               value={property.name}
//               onChange={handleChange}
//             />
//           </label>
//           <label className='form-label'>
//             Property Name:
//             <input
//               type='text'
//               name='property_name'
//               value={property.property_name}
//               onChange={handleChange}
//             />
//           </label>
//           <label className='form-label'>
//             Price:
//             <input
//               type='text'
//               name='price'
//               value={property.price}
//               onChange={handleChange}
//             />
//           </label>
//         </div>
//         <div className='form-row'>
//           <label className='form-label'>
//             Size (sq ft):
//             <input
//               type='text'
//               name='area_measurement'
//               value={property.area_measurement}
//               onChange={handleChange}
//             />
//           </label>
//           <label className='form-label'>
//             Property Type:
//             <input
//               type='text'
//               name='property_type'
//               value={property.property_type}
//               onChange={handleChange}
//             />
//           </label>
//         </div>
//         <div className='form-row'>
//           <label className='form-label'>
//             Property Status:
//             <input
//               type='text'
//               name='property_status'
//               value={property.property_status}
//               onChange={handleChange}
//             />
//           </label>
//           <label className='form-label'>
//             Property Description:
//             <input
//               type='text'
//               name='property_description'
//               value={property.property_description}
//               onChange={handleChange}
//             />
//           </label>
//         </div>
//         <div className='form-row'>
//           <label className='form-label'>
//             Ownership:
//             <select
//               name='ownership'
//               value={property.ownership}
//               onChange={handleChange}>
//               <option value=''>Select Ownership</option>
//               <option value={true}>Owned</option>
//               <option value={false}>Rented</option>
//             </select>
//           </label>
//           <label className='form-label'>
//             Category:
//             <select
//               name='category'
//               value={property.category}
//               onChange={handleChange}>
//               <option value=''>Select Category</option>
//               <option value='rent'>To Rent</option>
//               <option value='buy'>To Buy</option>
//               <option value='sell'>To Sell</option>
//             </select>
//           </label>
//         </div>

//         {/* Address Information */}
//         <div className='form-row'>
//           <label className='form-label'>
//             House Number:
//             <input
//               type='text'
//               name='house_number'
//               value={property.house_number}
//               onChange={handleChange}
//             />
//           </label>

//           <label className='form-label'>
//             street Name:
//             <input
//               type='text'
//               name='street_name'
//               value={property.street_name}
//               onChange={handleChange}
//             />
//           </label>

//           <label className='form-label'>
//             suburb:
//             <input
//               type='text'
//               name='suburb'
//               value={property.suburb}
//               onChange={handleChange}
//             />
//           </label>

//           <label className='form-label'>
//             Town:
//             <input
//               type='text'
//               name='town'
//               value={property.town}
//               onChange={handleChange}
//             />
//           </label>
//           <label className='form-label'>
//             Region:
//             <input
//               type='text'
//               name='region'
//               value={property.region}
//               onChange={handleChange}
//             />
//           </label>
//           <label className='form-label'>
//             Latitude:
//             <input
//               type='text'
//               name='latitude'
//               value={property.latitude}
//               onChange={handleChange}
//             />
//           </label>

//           <label className='form-label'>
//             Longitude:
//             <input
//               type='text'
//               name='longitude'
//               value={property.longitude}
//               onChange={handleChange}
//             />
//           </label>
//         </div>

//         {/* Property Features */}
//         <div className='form-row'>
//           <label className='form-label'>
//             Bedrooms:
//             <input
//               type='text'
//               name='bedrooms'
//               value={property.bedrooms}
//               onChange={handleChange}
//             />
//           </label>
//           <label className='form-label'>
//             Bathrooms:
//             <input
//               type='text'
//               name='bathrooms'
//               value={property.bathrooms}
//               onChange={handleChange}
//             />
//           </label>
//           <label className='form-label'>
//             Kitchens:
//             <input
//               type='text'
//               name='kitchens'
//               value={property.kitchens}
//               onChange={handleChange}
//             />
//           </label>
//           <label className='form-label'>
//             toilets:
//             <input
//               type='text'
//               name='toilets'
//               value={property.toilets}
//               onChange={handleChange}
//             />
//           </label>
//           <label className='form-label'>
//             Dinning Rooms:
//             <input
//               type='text'
//               name='dinning_rooms'
//               value={property.dinning_rooms}
//               onChange={handleChange}
//             />
//           </label>
//           <label className='form-label'>
//             Sitting Rooms:
//             <input
//               type='text'
//               name='sitting_rooms'
//               value={property.sitting_rooms}
//               onChange={handleChange}
//             />
//           </label>
//           <label className='form-label'>
//             Store Rooms:
//             <input
//               type='text'
//               name='store_room'
//               value={property.store_rooms}
//               onChange={handleChange}
//             />
//           </label>
//         </div>
//         <div className='form-row'>
//           <label className='form-label'>
//             Roof Type:
//             <input
//               type='text'
//               name='roof_type'
//               value={property.roof_type}
//               onChange={handleChange}
//             />
//           </label>
//         </div>

//         {/* Amenities */}
//         <div className='form-row'>
//           <label className='form-label'>
//             Floor Cover:
//             <input
//               type='text'
//               name='floor_cover'
//               value={property.floor_cover}
//               onChange={handleChange}
//             />
//           </label>
//           <label className='form-label'>
//             Window Type:
//             <input
//               type='text'
//               name='window_type'
//               value={property.window_type}
//               onChange={handleChange}
//             />
//           </label>
//         </div>
//         <div className='form-row'>
//           <label className='form-label'>
//             Braai:
//             <input
//               type='text'
//               name='braai'
//               value={property.braai}
//               onChange={handleChange}
//             />
//           </label>
//           <label className='form-label'>
//             Swimming Pool:
//             <input
//               type='text'
//               name='swimming_pool'
//               value={property.swimming_pool}
//               onChange={handleChange}
//             />
//           </label>
//         </div>
//         <div className='form-row'>
//           <label className='form-label'>
//             Garden:
//             <input
//               type='checkbox'
//               name='garden'
//               checked={property.garden}
//               onChange={(e) =>
//                 setProperty({ ...property, garden: e.target.checked })
//               }
//             />
//           </label>
//           <label className='form-label'>
//             Garage:
//             <input
//               type='text'
//               name='garage'
//               value={property.garage}
//               onChange={handleChange}
//             />
//           </label>
//           <label className='form-label'>
//             Carports:
//             <input
//               type='number'
//               name='carports'
//               value={property.carports}
//               onChange={(e) =>
//                 handleChange({
//                   target: { name: 'carports', value: Number(e.target.value) },
//                 })
//               }
//             />
//           </label>
//         </div>
//         <div className='form-row'>
//           <label className='form-label'>
//             Ready to Occupy:
//             <input
//               type='text'
//               name='ready_to_occupy'
//               value={property.ready_to_occupy}
//               onChange={handleChange}
//             />
//           </label>
//         </div>

//         <div className='form-row'>
//           <label className='form-label'>
//             Upload Images:
//             <input
//               type='file'
//               name='images'
//               accept='image/*'
//               multiple
//               onChange={handleImageChange}
//             />
//           </label>
//         </div>

//         <button type='submit' className='submit-button'>
//           Add Property
//         </button>
//       </form>
//     </div>
//   );
// };

// export default NewProperty;
