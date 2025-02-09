import React , {useState} from 'react';
import { Button } from '../components/ui/button';
import { Input } from "../components/ui/input";
import { useHistory } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Label } from "../components/ui/label";

function SignUp() {
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [firstName,setFirstName] = useState("");
  const [lastName,setLastName] = useState("");
   const history = useHistory();


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
  
  const handleSubmit = () => {
    if (email && password && firstName) {
      try {
          const dataObj = {
              email : email,
              password: password,
              firstName : firstName,
              lastName: lastName || ""
          };
          fetch(`https://collab-notes-5lcc.vercel.app/api/user/signup`,{
            method : "POST",
            mode: 'no-cors',
            headers : {
              'Content-type' : "application/json"
            },
            body : JSON.stringify(dataObj)
          }).then(res => res.json())
          .then(data =>{
            const state = history.location.state || {};
            history.push("/login",state);
          });
      } catch (e) {
          
      }
    }
  }

  return (  
    <Card className="w-200 h-250 items-center justify-center flex-row">
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