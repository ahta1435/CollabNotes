import React , {useState,useContext} from 'react';
import { Button } from '../components/ui/button';
import { Input } from "../components/ui/input";
import { useHistory } from 'react-router-dom';
import { UserContext } from '../Context';
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
  const [password,setPassword] = useState("");
  const history = useHistory();
  const { user, handleLogin } = useContext(UserContext);
  const handleEmailChange = (e) => {
    const val = e.target.value;
    setEmail(val);
  }

  const handlePasswordChange = (e) => {
    const val = e.target.value;
    setPassword(val);
  }

  const handleSignUp = (e) => {
    history.push("/signup");
  }

  const handleSubmit = () => {
    if (email && password) {
        try {
            const dataObj = {
                email : email,
                password: password
            };
            console.log(JSON.stringify(dataObj));
            fetch("http://localhost:8000/user/signIn",{
                method : "POST",
                headers : {
                    'Content-type' : "application/json"
                },
                body : JSON.stringify(dataObj)
            }).then(res => res.json())
            .then(data =>{
                const sessionId = data?.sessionId;
                handleLogin(data);
                if (sessionId) {
                  history.push('/dashboard');
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