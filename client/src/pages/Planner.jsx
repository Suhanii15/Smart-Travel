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
import plans from '../assets/plannersss.png';
import {useNavigate} from 'react-router-dom';
import {X} from 'lucide-react'

const Planner = () => {

  const naviagte=useNavigate();

  const handleClick = () => {
    naviagte('/itinerary');
  }

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

  return (
    <div className="flex flex-row min-h-screen justify-between w-full ">
        {/* left*/}
        <div className="flex flex-col gap-3 bg-slate-100 min-h-screen w-72">
        <div className="flex gap-2 my-2 gap-5">
                    <div className="p-2 ml-2 h-10 bg-blue-500/10 top-2 rounded-full">
                     <Compass className="text-blue-500" strokeWidth={2.5} />
                     </div>
                     <span className="text-xl mt-2 font-bold tracking-tight text-gray-600">
              Smart<span className="text-blue-500">Travel</span>
            </span>
        </div>
<Sidebar />
</div>
{/* righside*/}

<div className="flex-1 bg-gradient-to-br from-slate-50 to-blue-50">
  {/*header section*/}
  <div className="flex flex-row justify-between w-full ">
    {/*headingg*/}
    <div className="flex flex-col gap-1 mx-3 mt-4 ">
      <h1 className="font-bold text-gray-700 text-2xl ">Plan Your New Trip</h1>
      <h3 className="text-gray-400 text-sm">Tell us your Preferences and get your Itenary in a few seconds</h3>
    </div>

    
  </div>
{/* left part of right */}
  <div className="flex flex-col  gap-4 p-6 max-w-2xl">
    {/* Destination */}

     <div className="flex flex-col gap-3 p-4 lg:w-full">
      <label className="text-gray-700 text-md font-semibold">
        Destination
      </label>
      <div className="flex items-center justify-between w-full border border-gray-300 rounded-lg px-3 py-2  ">
        <input placeholder="Manali" className="text-gray-700  outline-none" />
        <MapPin className="text-gray-700 bg-white" strokeWidth={1.5} />
      </div>
      </div>
      {/* Dates */}
      <div className="flex flex-col gap-3 p-4 w-full">
      <label className="text-gray-700 text-md font-semibold">
        Start date-End date
      </label>
      <div className="flex items-center justify-between w-full border border-gray-300 rounded-lg px-3 py-2">
      <DatePicker startDate={startDate} endDate={endDate} onChange={onChange} selectsRange dateFormat="dd/MM/yyyy" className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none border-none" placeholderText="Select your travel dates" />
        <CalendarFold className="text-gray-700 bg-white outline-none border-none" strokeWidth={1.5} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 max-w-2xl">
      
     

      {/* Travel Style Select */}
      <div className="flex flex-col gap-2">
        <label className="text-slate-700 text-sm font-bold">Travel Style</label>
        <div className="relative">
          <select className="w-full appearance-none border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 text-slate-600 bg-white cursor-pointer">
            <option>Adventure</option>
            <option>Luxury</option>
            <option>Relaxation</option>
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
        </div>
      </div>

      {/* Companions Select */}
      <div className="flex flex-col gap-2">
        <label className="text-slate-700 text-sm font-bold">Companions</label>
        <div className="relative">
          <select value={companion} onChange={handleCompanion}
           className="w-full appearance-none border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 text-slate-600 bg-white cursor-pointer">
            <option>Friends</option>
            <option>Family</option>
            <option>Solo</option>
            <option>Couple</option>
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
        </div>
      </div>

<div className="flex flex-col gap-2">
  <label className="text-slate-700 text-sm font-bold">Number of People</label> 
   <div className="relative">
    <input type="number" min="1" value={peopleCount} disabled={companion == 'Solo' || companion == 'Couple'}
    onChange={(e) => setPeopleCount(e.target.value)}
            className={`w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 text-slate-600 
              ${(companion === 'Solo' || companion === 'Couple') ? 'bg-slate-50 cursor-not-allowed' : 'bg-white'}`}
            placeholder="How many people?"
    />
   </div>
{(companion === 'Solo' || companion === 'Couple') && (
          <p className="text-[10px] text-blue-500 font-medium italic">
            Count is locked for {companion} selection.
          </p>
        )}
      

</div>

      {/* Transport Preferences */}
      <div className="flex flex-col gap-2">
        <label className="text-slate-700 text-sm font-bold">Travel Preferences</label>
        <div className="relative">
          <select className="w-full appearance-none border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 text-slate-600 bg-white cursor-pointer">
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
        <label className="text-slate-700 text-sm font-bold">Interests</label>
        <div className="relative">
          <select className="w-full appearance-none border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 text-slate-600 bg-white cursor-pointer">
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

<button onClick={handleClick} className="bg-blue-600 lg:w-1/2 text-white font-semibold px-6 ml-30 rounded-[2rem] py-2 shadow-md shadow-gray-500 hover:-translate-y-2  transition duration-300 shadow-lg cursor-pointer "  >
  Generate Itinerary
</button>











  </div>

  <div className="p-6 min-h-screen lg:w-1/2 flex items-center justify-center  ">
    <img src={plans} alt="Planner" className="w-full h-full object-contain outline-none border-none rounded-md " />
  </div>
</div>

    
  )
}

export default Planner