import React from 'react';
import { Route, Navigate } from 'react-router-dom';

const PrivateRoute = ({ element, isAuthenticated, fallbackPath }) => {
  console.log('element, isAuthenticated, fallbackPath-------------',element, isAuthenticated, fallbackPath)
  return isAuthenticated ? (
    element
  ) : (
    <Navigate to={fallbackPath || '/login'} />
  );
};

export default PrivateRoute;
