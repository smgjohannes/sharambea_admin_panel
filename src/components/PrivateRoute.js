import React from 'react';
import { Navigate } from 'react-router-dom';
import { Token } from '../utils/Token';

const PrivateRoute = ({ children }) => {
  const userToken = new Token();
  userToken.init();

  const isAuthenticated = userToken.isConnected();

  return isAuthenticated ? children : <Navigate to='/' />;
};

export default PrivateRoute;
