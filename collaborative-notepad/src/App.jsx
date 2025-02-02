import React , {useEffect, useState} from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import Login from './Users/Login';
import SignUp from './Users/SingnUp';
import UserDashboard from './Dashboard/UserDashboard';
import PrivateRoute from "./PrivateRoute";

import { UserContext } from './Context';

function App() {
  const [user,setUser] = useState("");

  // Load user data from localStorage on page load
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Update the state and localStorage when the user logs in
  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));  // Save to localStorage
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <UserContext.Provider value = {{user,handleLogin}} >
        <Router>
          <Switch>
            <Route path="/login" render={() => <Login/>} />
            <PrivateRoute path="/dashboard" component={UserDashboard} />
            {/* <Route path="/dashboard/notes/:id" component={UserDashboard} /> */}
            <Route path="/signup" render={() => <SignUp/>} />
            <Redirect from="/" to="/login" />
          </Switch>
        </Router>
      </UserContext.Provider>
     
    </div>
  );
}

export default App
