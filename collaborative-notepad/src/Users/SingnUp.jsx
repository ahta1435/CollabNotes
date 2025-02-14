import React , {useEffect, useState} from 'react';
import { Button } from '../components/ui/button';
import { Input } from "../components/ui/input";
import { useHistory } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Label } from "../components/ui/label";
import Loader from '../Loader/Loader';

function SignUp() {
  const [email,setEmail] = useState("");
  const [showLoader,setShowLoader] = useState(false);
  const [showToast,setShowToast] = useState(false);
  const [password,setPassword] = useState("");
  const [toastMessage,setToastMessage] = useState("");
  const [firstName,setFirstName] = useState("");
  const [lastName,setLastName] = useState("");
  const history = useHistory();


  useEffect(() => {
    if (showToast) {
      setTimeout(()=>{
        setShowToast(false)
      },2500);
    }
  },[showToast]);

  const handleEmailChange = (e) => {
    const val = e.target.value;
    setEmail(val);
  }

  const handleLogin = () => {
    history.push("/");
  }

  const handlePasswordChange = (e) => {
    const val = e.target.value;
    setPassword(val);
  }

  const handleFirstName = (e) => {
    const val = e.target.value;
    setFirstName(val);
  }

  const handleLastName = (e) => {
    const val = e.target.value;
    setLastName(val);
  }
  
  const handleSubmit = async () => {
    if (email && password && firstName) {
      try {
          const dataObj = {
              email : email,
              password: password,
              firstName : firstName,
              lastName: lastName || ""
          };
          setShowLoader(true);
          const res = await fetch(`https://collabnotes-uj7x.onrender.com/user/signup`,{
            method : "POST",
            headers : {
              'Content-type' : "application/json"
            },
            body : JSON.stringify(dataObj)
          })
          const data = await res.json();
          const state = history.location.state || {};
          setShowLoader(false);
          history.push("/login",state);
      } catch (e) {
          console.log(e);
          setShowToast(true);
          setToastMessage(e);
          setShowLoader(false)
      }
    }
  }

  return (  
    <Card className="w-200 h-250 items-center justify-center flex-row">
      {showLoader && <Loader/>}
      {showToast && <Toaster description={toastMessage}/>}
      <CardHeader>
        <CardTitle>Welcome To Collaborative Note App</CardTitle>
      </CardHeader>
      <CardContent>
        <Label htmlFor="email">Email</Label>
        <Input type="email" id="email" placeholder="email" onChange={handleEmailChange}/>
        <Label htmlFor="firstName">First Name</Label>
        <Input type="text" id="firstName" placeholder="first name" onChange={handleFirstName}/>
        <Label htmlFor="lastName">Last Name</Label>
        <Input type="text" id="lastName" placeholder="last name" onChange={handleLastName}/>
        <Label htmlFor="password">Password</Label>
        <Input type="password" id="password" placeholder="password" onChange={handlePasswordChange}/>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSubmit}>SignUp</Button>
         <Button className="mx-10" onClick={handleLogin}>Already Have an Account? Login </Button>
      </CardFooter>
    </Card>
  )
}

export default SignUp