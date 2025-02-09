import React , {useEffect, useState} from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch, useHistory} from 'react-router-dom';
import Login from './Users/Login';
import SignUp from './Users/SingnUp';
import UserDashboard from './Dashboard/UserDashboard';
import PrivateRoute from "./PrivateRoute";
import _ from "lodash";

function App() {
  const history = useHistory();
  const [location,setLocation] = useState("")
  // Load user data from localStorage on page load
  useEffect(() => {
    const currentLocation = window.location.pathname;
    setLocation(currentLocation);
  },[]);

  const getUser = () => {
    const user = localStorage.getItem("user");
    return _.isEmpty(user) || _.isNil(user);
  }

  return (
    <div className="flex items-center justify-center h-screen">
      {/* <UserContext.Provider value = {{user,handleLogin}} > */}
        <Router>
          <Switch>
            {getUser() && <Route path="/login" render={() => <Login/>} />}
            <PrivateRoute path="/dashboard" component={UserDashboard} />
            {/* <Route
              render={(props) =>
               getUser() && !getPath() ? <Redirect to="/login" /> : <UserDashboard {...props} />
              }
            /> */}
            {/* <Route path="/dashboard/notes/:id" component={UserDashboard} /> */}
            {getUser() && <Route path="/signup" component={SignUp}/>}
            {getUser() && <Redirect from="/" to="/login" />}
          </Switch>
        </Router>
      {/* </UserContext.Provider> */}
     
    </div>
  );
}

export default App
