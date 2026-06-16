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
    const url=currState === "Sign Up" ? "https://smart-travel-hvla.onrender.com/api/user/signup" : "https://smart-travel-hvla.onrender.com/api/user/login";
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
    <div className="min-h-screen flex items-center dark:bg-slate-900">
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
       className="bg-white lg:w-1/2 rounded-lg shadow-md px-8 py-8 flex flex-col gap-6 hover:shadow-lg cursor-pointer transition dark:bg-slate-800 dark:border dark:border-gray-700">
        <h1 className=" font-md font-bold text-xl text-gray-700 dark:text-gray-100">{currState}</h1>
        {
          currState === 'Sign Up' && (
            <input onChange={(e)=>setName(e.target.value)} type="text" placeholder='Full Name' value={name}  className="w-full mb-4 px-3 py-2 border border-gray-200 ronded-md hover:cursor-pointer transition dark:bg-slate-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400"/>

          )
        }
        
      
        <input onChange={(e)=>setEmail(e.target.value)} type="email" placeholder='Email' value={email}  className="w-full mb-4 px-3 py-2 border border-gray-200 ronded-md hover:cursor-pointer transition dark:bg-slate-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400"/>
        <input onChange={(e)=>setPassword(e.target.value)} type="password" placeholder='Password' value={password}  className="w-full mb-4 px-3 py-2 border border-gray-200 ronded-md hover:cursor-pointer transition dark:bg-slate-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400"/>
    <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
            <span className="text-sm text-gray-400">or</span>
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
          </div>

          <button
            type="button"
            onClick={() => window.location.href = "https://smart-travel-hvla.onrender.com/api/auth/google"}
            className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-md py-2.5 font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer transition dark:border-gray-600 dark:text-gray-200 dark:hover:bg-slate-700"
          >
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              className="w-5 h-5"
              alt="Google"
            />
            {currState === "Sign Up" ? "Sign up with Google" : "Login with Google"}
          </button>
    
      
<button type="submit" className="mt-8 rounded-md  bg-blue-600 dark:bg-blue-500 text-white px-8 py-3 hover:bg-blue-500 dark:hover:bg-blue-400 cursor-pointer transition">
  { loading ? "processing.." : currState==="Sign Up" ? "Create Account" : "Login"}
</button>
<div className="flex flex-col gap-2">
  {
      currState === "Sign Up" ? (
      <p className="text-sm text-gray-700 dark:text-gray-300">Already Have an Account? <span
      onClick={()=>{setcurrState("Login")}}
      className="font-medium text-blue-500 dark:text-blue-400 cursor-pointer">Login Here</span></p>
    ) : (
      <p className="text-sm text-gray-700 dark:text-gray-300">Create an account.<span
      onClick={()=>setcurrState("Sign Up")}
      className="font-medium text-blue-500 dark:text-blue-400 cursor-pointer">Click Here</span></p>
    )
  } 
</div>
  

      </form>


  </div>
    </div>
  )
}

export default LoginPage