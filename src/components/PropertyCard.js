import React, { useState, useEffect, useRef } from 'react';
import { FaEllipsisV, FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import PropertyDetailsModal from './PropertyDetailsModal';
import PropertyFormModal from './PropertyModal';
import '../styles/PropertyCard.css';

const PropertyCard = ({ property, onDelete }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showPropertyDetailsModal, setShowPropertyDetailsModal] =
    useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [propertyToEdit, setPropertyToEdit] = useState(null);
  const menuRef = useRef(null);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleView = () => {
    setShowPropertyDetailsModal(true);
    setMenuOpen(false);
  };

  const handleEdit = () => {
    setPropertyToEdit(property);
    setShowFormModal(true);
    setMenuOpen(false);
  };

  const handleDelete = () => {
    onDelete(property.id);
    setMenuOpen(false);
  };

  const handleClosePropertyDetailsModal = () => {
    setShowPropertyDetailsModal(false);
  };

  const handleSaveProperty = (updatedProperty) => {
    // Call your API or update the state to save the updated property details
    console.log('Saving property:', updatedProperty);
    // Refresh the property list if needed
    setShowFormModal(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuRef]);

  return (
    <div className='property-card'>
      <div className='property-info'>
        <h3>{property.property_name}</h3>
        <hr />
        <div className='menu-container'>
          <FaEllipsisV onClick={toggleMenu} className='menu-icon' />
          {menuOpen && (
            <div className='menu' ref={menuRef}>
              <div className='menu-item' onClick={handleView}>
                <FaEye className='icon view' /> View
              </div>
              <div className='menu-item' onClick={handleEdit}>
                <FaEdit className='icon edit' /> Edit
              </div>
              <div className='menu-item' onClick={handleDelete}>
                <FaTrash className='icon delete' /> Delete
              </div>
            </div>
          )}
        </div>
        <div className='property-description'>
          <h3>{property.name}</h3>
          <h3>{property.suburb}</h3>
        </div>
        <div className='property-description'>
          <h3>{property.property_description}</h3>
        </div>
      </div>
      <PropertyDetailsModal
        show={showPropertyDetailsModal}
        onClose={handleClosePropertyDetailsModal}
        property={property}
      />
      <PropertyFormModal
        show={showFormModal}
        onClose={() => setShowFormModal(false)}
        propertyData={propertyToEdit}
        onSubmit={handleSaveProperty} // Update or add the property
      />
    </div>
  );
};
export default PropertyCard;
