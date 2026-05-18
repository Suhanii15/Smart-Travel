import React from 'react'
import loginp from '../assets/login.jpeg'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'  
import { AuthContext } from '../context/AuthContext';
import { useContext } from 'react';

const LoginPage = () => {
    const Navigate=useNavigate();
    const {loginUser}=useContext(AuthContext);

const[currState, setcurrState]=useState("Sign Up")
  const[name, setName]=useState("");
  const[email,setEmail]=useState("");
  const[password,setPassword]=useState("");
  const[loading, setLoading]=useState(false);

  const handleAuth = async () =>{
    setLoading(true);
    const url=currState === "Sign Up" ? "http://localhost:5000/api/user/signup" : "http://localhost:5000/api/user/login";
    const body=currState === "Sign Up" ? {name,email,password} : {email,password};

    try{
 const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({name,email,password}),
    });
    const data = await res.json();

      if (data.success) {
        loginUser(data.userData, data.token);
        Navigate("/dashboard"); // redirect after login/signup
      } else {
        alert(data.message);
}
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const onSubmitHandler=(event)=>{
  event.preventDefault();
  handleAuth();


  } 



  return (
    <div className="min-h-screen flex items-center">
        <div className="hidden h-180 lg:flex lg:w-1/2 relative bg-cover bg-center items-center justify-center px-12" 
       style={{ backgroundImage: `url('${loginp}')` }}>
    
    <div className="absolute inset-0 bg-black/40"></div>
    
    <div className="relative z-10 text-white max-w-md">
      <h1 className="text-5xl font-bold leading-tight">
        Let's start your journey!
      </h1>
      <p className="mt-4 text-lg text-gray-200">
        Join SmartTravel and turn your travel dreams into reality.
      </p>
    </div>
  </div>


  <div className="flex-1 flex items-center justify-center px-6 py-12">
          <form onSubmit={onSubmitHandler}
       className="bg-white lg:w-1/2 rounded-lg shadow-md px-8 py-8 flex flex-col gap-6 hover:shadow-lg cursor-pointer transition">
        <h1 className=" font-md font-bold text-xl text-gray-700">{currState}</h1>
        {
          currState === 'Sign Up' && (
            <input onChange={(e)=>setName(e.target.value)} type="text" placeholder='Full Name' value={name}  className="w-full mb-4 px-3 py-2 border border-gray-200 ronded-md hover:cursor-pointer transition"/>

          )
        }
        
      
        <input onChange={(e)=>setEmail(e.target.value)} type="email" placeholder='Email' value={email}  className="w-full mb-4 px-3 py-2 border border-gray-200 ronded-md hover:cursor-pointer transition"/>
        <input onChange={(e)=>setPassword(e.target.value)} type="password" placeholder='Password' value={password}  className="w-full mb-4 px-3 py-2 border border-gray-200 ronded-md hover:cursor-pointer transition"/>
        
      
<button type="submit" className="mt-8 rounded-md  bg-blue-600 text-white px-8 py-3 hover:bg-blue-500 cursor-pointer transition">
  { loading ? "processing.." : currState==="Sign Up" ? "Create Account" : "Login"}
</button>
<div className="flex flex-col gap-2">
  {
    currState === "Sign Up" ? (
      <p className="text-sm text-gray-700">Already Have an Account? <span
      onClick={()=>{setcurrState("Login")}}
      className="font-medium text-blue-500 cursor-pointer">Login Here</span></p>
    ) : (
      <p className="text-sm text-gray-700">Create an account.<span
      onClick={()=>setcurrState("Sign Up")}
      className="font-medium text-blue-500 cursor-pointer">Click Here</span></p>
    )
  } 
</div>
  

      </form>


  </div>
    </div>
  )
}

export default LoginPage