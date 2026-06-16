import React from 'react'
import {Compass} from 'lucide-react'
import Sidebar from '../components/Sidebar'
import { Sparkles, Users } from 'lucide-react';
import { MapPin } from 'lucide-react';
import { CalendarFold } from 'lucide-react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

import {useNavigate} from 'react-router-dom';
import {X} from 'lucide-react'
import axios from 'axios'

const Planner = () => {

  const navigate = useNavigate();

 

  const [startDate, setStartDate] =useState(null);
  const [endDate,setEndDate]=useState(null);

  const onChange =(dates)=>{
    const [start,end] =dates;
    setStartDate(start);
    setEndDate(end);
  }

  const [companion,setCompanion]=useState('Friends');
  const [peopleCount,setPeopleCount]=useState(1);

  const handleCompanion = (e) =>{
    const value=e.target.value;
    setCompanion(value);

    if(value == 'Solo'){
      setPeopleCount(1);
    }
    if(value == 'Couple'){
      setPeopleCount(2);
    }
  }

  const [loading,setLoading]=useState(false);
  const [error,setError]=useState("");

  const [destination,setDestination]=useState("");
  const [travelStyle,setTravelStyle]=useState("Adventure");
  const [preferences,setPreferences]=useState("Cheapest");
  const [interests,setInterests]=useState("Night Life");

  const handleClick=  async() =>{
    if(!destination || !startDate || !endDate){
      setError("Please fill out destination and date range");
      return;
    }
    const token= localStorage.getItem("token");

    setLoading(true);
    setError("");

    try{
      
      const config={
        headers:{
          "Content-type":"application/json",
         token:token
        }

      };

      const payload={
        destination,
        startDate:startDate.toISOString(),
        endDate:endDate.toISOString(),
        peopleCount:Number(peopleCount),
        preferences,
        travelStyle,
        interests,
        companions:companion
       

      }
      const response=await axios.post(
        "https://smart-travel-hvla.onrender.com/api/trips/create",
        payload,
        config
      );
     
      if(response.data.success){
        console.log("Trip ID:", response.data.trip._id);
        navigate(`/itinerary/${response.data.trip._id}`);
      }
    }
    catch(err){
console.log(err);
setError(err.response?.data?.message || "Something went wrong while AI was compiling your itinerary.");
    }
    finally{
      setLoading(false);
    }

  }

  return (
    <div className="flex flex-row min-h-screen justify-between w-full ">
        {/* left*/}
        <div className="flex flex-col gap-3 bg-slate-100 dark:bg-slate-800 min-h-screen w-72">
        <div className="flex gap-2 my-2 gap-5">
                    <div className="p-2 ml-2 h-10 bg-blue-500/10 top-2 rounded-full dark:bg-blue-400/20">
                     <Compass className="text-blue-500 dark:text-blue-400" strokeWidth={2.5} />
                     </div>
                     <span className="text-xl mt-2 font-bold tracking-tight text-gray-600 dark:text-gray-300">
              Smart<span className="text-blue-500 dark:text-blue-400">Travel</span>
            </span>
        </div>
<Sidebar />
</div>
{/* righside*/}

<div className="flex-1 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
  {/*header section*/}
  <div className="flex flex-row justify-between w-full ">
    {/*headingg*/}
    <div className="flex flex-col gap-1 mx-3 mt-4 ">
      <h1 className="font-bold text-gray-700 dark:text-gray-100 text-2xl ">Plan Your New Trip</h1>
      <h3 className="text-gray-400 dark:text-gray-500 text-sm">Tell us your Preferences and get your Itenary in a few seconds</h3>
    </div>

    
  </div>
{/* left part of right */}
  <div className="flex flex-col  gap-4 p-6 max-w-2xl">
    {error && (
            <div className="bg-red-50 text-red-600 border border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800 p-3 mx-4 rounded-xl text-sm font-medium">
               {error}
            </div>
          )}
    {/* Destination */}

     <div className="flex flex-col gap-3 p-4 lg:w-full">
      <label className="text-gray-700 dark:text-gray-200 text-md font-semibold">
        Destination
      </label>
      <div className="flex items-center justify-between w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2  ">
        <input
          placeholder="Manali"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          className="text-gray-700 dark:text-gray-200 w-full outline-none"
        />
        <MapPin className="text-gray-700 bg-white dark:text-gray-200 dark:bg-slate-800" strokeWidth={1.5} />
      </div>
      </div>
      {/* Dates */}
      <div className="flex flex-col gap-3 p-4 w-full">
      <label className="text-gray-700 dark:text-gray-200 text-md font-semibold">
        Start date-End date
      </label>
      <div className="flex items-center justify-between w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2">
      <DatePicker startDate={startDate} endDate={endDate} onChange={onChange} selectsRange dateFormat="dd/MM/yyyy" className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 outline-none border-none dark:text-gray-200 dark:placeholder-gray-400" placeholderText="Select your travel dates" />
        <CalendarFold className="text-gray-700 bg-white outline-none border-none dark:text-gray-200 dark:bg-slate-800" strokeWidth={1.5} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 max-w-2xl">
      
     

      {/* Travel Style Select */}
      <div className="flex flex-col gap-2">
        <label className="text-slate-700 dark:text-gray-200 text-sm font-bold">Travel Style</label>
        <div className="relative">
          <select value={travelStyle} onChange={(e)=>setTravelStyle(e.target.value)}
          className="w-full appearance-none border border-slate-200 dark:border-gray-600 rounded-xl px-4 py-3 outline-none focus:border-blue-500 text-slate-600 dark:text-gray-300 bg-white dark:bg-slate-800 cursor-pointer">
            <option>Adventure</option>
            <option>Luxury</option>
            <option>Relaxation</option>
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
        </div>
      </div>

      {/* Companions Select */}
      <div className="flex flex-col gap-2">
        <label className="text-slate-700 dark:text-gray-200 text-sm font-bold">Companions</label>
        <div className="relative">
          <select value={companion} onChange={handleCompanion}
           className="w-full appearance-none border border-slate-200 dark:border-gray-600 rounded-xl px-4 py-3 outline-none focus:border-blue-500 text-slate-600 dark:text-gray-300 bg-white dark:bg-slate-800 cursor-pointer">
            <option>Friends</option>
            <option>Family</option>
            <option>Solo</option>
            <option>Couple</option>
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
        </div>
      </div>

<div className="flex flex-col gap-2">
  <label className="text-slate-700 dark:text-gray-200 text-sm font-bold">Number of People</label> 
   <div className="relative">
    <input type="number" min="1" value={peopleCount} disabled={companion == 'Solo' || companion == 'Couple'}
    onChange={(e) => setPeopleCount(e.target.value)}
            className={`w-full border border-slate-200 dark:border-gray-600 rounded-xl px-4 py-3 outline-none focus:border-blue-500 text-slate-600 dark:text-gray-300 
              ${(companion === 'Solo' || companion === 'Couple') ? 'bg-slate-50 dark:bg-slate-700 cursor-not-allowed' : 'bg-white dark:bg-slate-800'}`}
            placeholder="How many people?"
    />
   </div>
{(companion === 'Solo' || companion === 'Couple') && (
          <p className="text-[10px] text-blue-500 font-medium italic dark:text-blue-400">
            Count is locked for {companion} selection.
          </p>
        )}
      

</div>

      {/* Transport Preferences */}
      <div className="flex flex-col gap-2">
        <label className="text-slate-700 dark:text-gray-200 text-sm font-bold">Travel Preferences</label>
        <div className="relative">
          <select value={preferences} onChange={(e) => setPreferences(e.target.value)}
           className="w-full appearance-none border border-slate-200 dark:border-gray-600 rounded-xl px-4 py-3 outline-none focus:border-blue-500 text-slate-600 dark:text-gray-300 bg-white dark:bg-slate-800 cursor-pointer">
            <option>Cheapest</option>
            <option>Fastest</option>
            <option>Comfortable</option>
            <option>Balanced</option>
            
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
        </div>
      </div>
 
 {/* Intersets*/}
      <div className="flex flex-col gap-2">
        <label className="text-slate-700 dark:text-gray-200 text-sm font-bold">Interests</label>
        <div className="relative">
          <select value={interests}
                  onChange={(e) => setInterests(e.target.value)}
          className="w-full appearance-none border border-slate-200 dark:border-gray-600 rounded-xl px-4 py-3 outline-none focus:border-blue-500 text-slate-600 dark:text-gray-300 bg-white dark:bg-slate-800 cursor-pointer">
            <option>Night Life</option>
            <option>Spiritual</option>
            <option>History</option>
            <option>Shopping</option>
             <option>Food</option>
              <option>Nature</option>
            
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
        </div>
      </div>

    </div>


   

    </div>

<button 
            onClick={handleClick} 
            disabled={loading}
            className={`bg-blue-600 lg:w-1/2 text-white font-semibold px-6 ml-6 rounded-[2rem] py-2 shadow-md hover:-translate-y-1 transition duration-300 cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed dark:bg-blue-500`}
          >
            {loading ? "Generating your plan... " : "Generate Itinerary"}
          </button>
        




  </div>

  <div className="hidden lg:flex lg:w-1/2 p-10 items-center justify-center">
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-10 shadow-lg border border-gray-100 dark:border-gray-700 max-w-md w-full space-y-10">
      <div className="text-center">
        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/40 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <Sparkles className="text-blue-600 dark:text-blue-400" size={32} />
        </div>
        <h3 className="font-bold text-gray-800 dark:text-gray-100 text-xl">AI-Powered Planning</h3>
        <p className="text-base text-gray-500 dark:text-gray-400 mt-1">Personalized itineraries crafted by AI in seconds</p>
      </div>
      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/40 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <CalendarFold className="text-green-600 dark:text-green-400" size={32} />
        </div>
        <h3 className="font-bold text-gray-800 dark:text-gray-100 text-xl">Smart Budget Tracking</h3>
        <p className="text-base text-gray-500 dark:text-gray-400 mt-1">Stay on top of your trip expenses effortlessly</p>
      </div>
      <div className="text-center">
        <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/40 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <Users className="text-purple-600 dark:text-purple-400" size={32} />
        </div>
        <h3 className="font-bold text-gray-800 dark:text-gray-100 text-xl">Real-time Collaboration</h3>
        <p className="text-base text-gray-500 dark:text-gray-400 mt-1">Plan trips together with friends and family</p>
      </div>
    </div>
  </div>
</div>

    
  )
}

export default Planner