import React, { useState, useRef, useEffect } from 'react';
import { FaEllipsisV, FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import '../styles/PropertyCard.css';

const PropertyCard = ({ property, onDelete }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleView = () => {
    navigate(`/view/${property.id}`); // Navigate to view page
    setMenuOpen(false);
  };

  const handleEdit = () => {
    navigate(`/edit/${property.id}`); // Navigate to edit page
    setMenuOpen(false);
  };

  const handleDelete = () => {
    onDelete(property.id);
    setMenuOpen(false);
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
          <h3>{property.description}</h3>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
