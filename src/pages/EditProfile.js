import React, { useState } from 'react';
import '../styles/EditProfile.css'; // Add your CSS file
import { useNavigate } from 'react-router-dom';
import { HttpClient } from '../utils/HttpClient';

const EditProfile = () => {
  const [profilePicture, setProfilePicture] = useState(null);
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [address, setAddress] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const navigate = useNavigate();

  const handleProfilePictureChange = (e) => {
    setProfilePicture(URL.createObjectURL(e.target.files[0]));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const httpClient = new HttpClient();
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('name', name);
    formData.append('dob', dob);
    formData.append('address', address);
    formData.append('oldPassword', oldPassword);
    formData.append('newPassword', newPassword);
    if (profilePicture) {
      formData.append('profilePicture', e.target.profilePicture.files[0]);
    }

    try {
      const response = await httpClient.fetch('/me', {
        method: 'PATCH',
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        navigate('/dashboard');
      } else {
        // Handle errors
        console.error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className='edit-profile-container'>
      <h2>Edit Profile</h2>
      <form onSubmit={handleSubmit} encType='multipart/form-data'>
        <div className='form-group'>
          <label htmlFor='profilePicture'>Profile Picture</label>
          <input
            type='file'
            id='profilePicture'
            accept='image/*'
            onChange={handleProfilePictureChange}
          />
          {profilePicture && (
            <img
              src={profilePicture}
              alt='Profile Preview'
              className='profile-preview'
            />
          )}
        </div>

        <div className='form-group'>
          <label htmlFor='name'>Name</label>
          <input
            type='text'
            id='name'
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className='form-group'>
          <label htmlFor='dob'>Date of Birth</label>
          <input
            type='date'
            id='dob'
            value={dob}
            onChange={(e) => setDob(e.target.value)}
          />
        </div>

        <div className='form-group'>
          <label htmlFor='address'>Address</label>
          <input
            type='text'
            id='address'
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        <div className='form-group'>
          <label htmlFor='oldPassword'>Old Password</label>
          <input
            type='password'
            id='oldPassword'
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
        </div>

        <div className='form-group'>
          <label htmlFor='newPassword'>New Password</label>
          <input
            type='password'
            id='newPassword'
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>

        <button type='submit' className='submit-button'>
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
