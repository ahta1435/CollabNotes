import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const isAuthenticated = localStorage.getItem("user");
  const currentLocation = window.location.pathname; // Capture the current URL
  return (
    <Route
      {...rest}
      render={props =>
        isAuthenticated ? (
          <Component {...props} />
        ) : (
          // If not authenticated, store the current location in the state and redirect to /login
          <Redirect 
            to={{
              pathname: "/login",
              state: { from: currentLocation } // Pass the intended URL as state
            }} 
          />
        )
      }
    />
  );
};

export default PrivateRoute;
