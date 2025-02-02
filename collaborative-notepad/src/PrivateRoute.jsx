import React from 'react';
import { Route, Redirect, useHistory } from 'react-router-dom';
function PrivateRoute({ component: Component, ...rest }) {
  const history = useHistory();
  const isAuthenticated = localStorage.getItem("collabeditorSession") || history.location.pathname.includes("share");
  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? <Component {...props} /> : <Redirect to="/login" />
      }
    />
  );
}
export default PrivateRoute;