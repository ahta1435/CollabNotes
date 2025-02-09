import React , {useState,useContext} from 'react';
import { Button } from '../components/ui/button';
import { Input } from "../components/ui/input";
import { useHistory,useLocation } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Label } from "../components/ui/label";

function Login({}) {
  const [email,setEmail] = useState("");
  const location = useLocation();
  const [password,setPassword] = useState("");
  const history = useHistory();
  const handleEmailChange = (e) => {
    const val = e.target.value;
    setEmail(val);
  }

  const {from}  = location.state || { from: { pathname: "/dashboard" } }; 
  const handlePasswordChange = (e) => {
    const val = e.target.value;
    setPassword(val);
  }

  const handleSignUp = (e) => {
    const state = history.location.state || {};
    history.push("/signup",state);
  }

  const handleSubmit = () => {
    if (email && password) {
      try {
        const dataObj = {
          email : email,
          password: password
        };
        fetch(`/user/signIn`,{
          method : "POST",
          headers : {
              'Content-type' : "application/json"
          },
          body : JSON.stringify(dataObj)
        }).then(res => res.json())
        .then(data =>{
          const sessionId = data?.sessionId;
          localStorage.setItem("user",JSON.stringify(data));
          if (sessionId) {
            history.replace(from);
          }
        });
      } catch (e) {
          
      }
    }
  }

  return (  
    <Card className="w-250 h-250 items-center justify-center flex-row">
      <CardHeader>
        <CardTitle>Welcome To Collaborative Note App</CardTitle>
      </CardHeader>
      <CardContent>
        <Label htmlFor="email">Email</Label>
        <Input type="email" id="email" placeholder="email" onChange={handleEmailChange}/>
        <Label htmlFor="password">Password</Label>
        <Input type="password" id="password" placeholder="password" onChange={handlePasswordChange}/>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSubmit}>Login</Button>
        <Button className="mx-10" onClick={handleSignUp}>New Here? SignUp</Button>
      </CardFooter>
    </Card>
  )
}

export default Login