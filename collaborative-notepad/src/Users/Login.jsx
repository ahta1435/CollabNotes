import React , {useState,useContext, useEffect} from 'react';
import { Button } from '../components/ui/button';
import { Input } from "../components/ui/input";
import { useHistory,useLocation } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Label } from "../components/ui/label";
import Loader from '../Loader/Loader';


function Login({}) {
  const [email,setEmail] = useState("");
  const [showLoader,setShowLoader] = useState(false);
  const location = useLocation();
  const [password,setPassword] = useState("");
  const [showToast,setShowToast] = useState(false);
  const [toastMessage,setToastMessage] = useState("");
  const history = useHistory();
  const handleEmailChange = (e) => {
    const val = e.target.value;
    setEmail(val);
  }

  useEffect(() => {
    if (showToast) {
      setTimeout(()=>{
        setShowToast(false)
      },2500);
    }
  },[showToast]);
  
  const {from}  = location.state || { from: { pathname: "/dashboard" } }; 
  const handlePasswordChange = (e) => {
    const val = e.target.value;
    setPassword(val);
  }

  const handleSignUp = (e) => {
    const state = history.location.state || {};
    history.push("/signup",state);
  }

  const handleSubmit =async () => {
    if (email && password) {
      try {
        const dataObj = {
          email : email,
          password: password
        };
        setShowLoader(true);
        const res = await fetch(`https://collabnotes-uj7x.onrender.com/user/signIn`,{
          method : "POST",
          headers : {
              'Content-type' : "application/json"
          },
          body : JSON.stringify(dataObj)
        })
        try {
          const data = await res.json();
          const sessionId = data?.sessionId;
          if (sessionId) {
            localStorage.setItem("user",JSON.stringify(data));
            history.replace(from);
          } else {
            setShowToast(true);
            setToastMessage(data.message);
          }
          setShowLoader(false);
        } catch(error) {
          setShowLoader(false);
        }
      } catch (e) {
        console.log(e)
        setShowToast(true);
        setToastMessage(e);
        setShowLoader(false);
      }
    }
  }

  return (
    <Card className="w-250 h-250 items-center justify-center flex-row">
      {showLoader && <Loader/>}
      {showToast && <Toaster description={toastMessage}/>}
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