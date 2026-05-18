import React,{useMemo} from 'react'
import {Compass, FileVideo} from 'lucide-react'
import Sidebar from '../components/Sidebar'
import {useState} from 'react'
import { ChevronsLeft } from 'lucide-react'
import { useNavigate } from "react-router-dom";
import { Sparkles } from 'lucide-react';
import {
  Car,
  Hotel,
  UtensilsCrossed,
  Ticket,
  ShoppingBag,
} from "lucide-react";

import { AuthContext } from '../context/AuthContext';
import { useContext } from 'react';


const BudgetTracker = () => {
   const DUMMY_TRIP = {
  destination: "Manali Trip",
  startDate: "10 May",
  endDate: "15 May 2026",
  members: 4,
  totalDays: 5,
 
  itinerary: {
    1: {
      morning: [
        { time: "9:00 AM", task: "Check-in at Hotel", location: "Mall Road" },
        { time: "10:30 AM", task: "Breakfast at Johnson's Café", location: "Old Manali" }
      ],
      afternoon: [
        { time: "1:00 PM", task: "Visit Hadimba Temple", location: "Hadimba Temple Road" },
        { time: "3:30 PM", task: "Explore Mall Road", location: "City Center" }
      ],
      evening: [
        { time: "6:00 PM", task: "Cafe Hopping", location: "Old Manali" },
        { time: "9:00 PM", task: "Local Market Visit", location: "Mall Road" }
      ]
    },
    2: {
      morning: [{ time: "8:00 AM", task: "Drive to Solang Valley", location: "Solang" }],
      afternoon: [{ time: "1:00 PM", task: "Paragliding & Skiing", location: "Solang Adventure Park" }],
      evening: [{ time: "7:00 PM", task: "Dinner at Drifters' Inn", location: "Old Manali" }]
    }
  }
};
const [trip, setTrip]=useState(DUMMY_TRIP);
const navigate=useNavigate();
const [isEditable, setIsEditable] = useState(true);
const goback = () =>{
  navigate('/itinerary');
}

const expenses = [
    {
      category: "Transport",
      spent: 3200,
      limit: 4000,
      icon: Car,
      color: "bg-purple-500",
    },
    {
      category: "Accommodation",
      spent: 5000,
      limit: 7000,
      icon: Hotel,
      color: "bg-orange-400",
    },
    {
      category: "Food",
      spent: 2250,
      limit: 3000,
      icon: UtensilsCrossed,
      color: "bg-emerald-500",
    },
    {
      category: "Activities",
      spent: 1500,
      limit: 3000,
      icon: Ticket,
      color: "bg-yellow-400",
    },
      
    {
      category: "Shopping",
      spent: 500,
      limit: 2000,
      icon: ShoppingBag,
      color: "bg-violet-500",
    },

  ];

  const totalbudget = useMemo(()=>{
    return expenses.reduce((acc,item)=> acc + item.limit,0);
  },[expenses]);

  const totalspending = useMemo(()=>{
    return expenses.reduce((acc,item)=>acc + item.spent,0);
  },[expenses]);

  const remaining=totalbudget-totalspending;

  const progress=(totalspending/totalbudget) * 100;
  const {user,logoutuser}=useContext(AuthContext);


  return (
    <div className="flex flex-row min-h-screen">
        {/* leftside*/}
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
{/* rightside*/}
<div className="flex-1 bg-gradient-to-br from-slate-50 to-blue-50">
  <div className="flex flex-row items-center border border-gray-200 shadow-md rounded-lg justify-between w-full p-6">
   <div className="flex flex-col gap-1 mx-3 mt-4 ">
      <h1 className="font-bold text-gray-700 text-2xl ">{trip.destination}</h1>
      <h3 className="text-gray-400 text-sm">{trip.startDate} - {trip.endDate}</h3>
     <h3 className="text-gray-400 text-sm">{trip?.members} Members</h3>
    </div>
    <div className="flex flex-col gap-1">
      {isEditable && (
      <div onClick={goback}
       className="flex flex-row gap-1 p-2 hover:cursor-pointer">
        <ChevronsLeft className="text-gray-700" />
        <h3 className="text-gray-700 ">Back</h3>
      </div>
      )}
     <div className="flex mt-2 mr-4 px-1 gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
        {user?.name[0]}
          </div>
          <p className="text-gray-700 mt-1 font-medium">{user?.name}</p>
      </div>
      </div>
 </div>

<div className="flex flex-col mt-4 gap-3">
  
  <div className="flex flex-row mt-3 mx-4 items-center gap-2">
       <Sparkles className="ml-2 text-blue-500" />
    <h1 className="text-blue-500 items-center font-semibold mx-3 text-2xl">
      Estimated Budget
    </h1>
     <p className="text-gray-400 mt-1 font-medium">
          Total Budget: ₹{totalbudget.toLocaleString()}
        </p>

  </div>
  <div className="lg:w-3/4 mx-4 mr-4 h-3 bg-slate-200 rounded-full overflow-hidden mt-5">
          <div
            style={{ width: `${progress}%` }}
            className="h-full bg-blue-600 rounded-full transition-all duration-500"
          />
        </div>

        <div className="flex gap-200 mx-4 mt-3 text-sm font-medium">
          <p className="text-gray-500">
            Spent: ₹{totalspending.toLocaleString()}
          </p>

          <p className="text-gray-500 ">
            Remaining: ₹{remaining.toLocaleString()}
          </p>
        </div>
<div>
</div>
 
 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
  <div className="lg:col-span-2 space-y-5">
    {
      expenses.map((item,index)=>{
        const Icon=item.icon;
        const percentage= (item.spent / item.limit) * 100;

        return(
          <div key={index} className="flex mx-4 justify-between items-center gap-4">
            {/* Icon */}
            <div className={`w-11 h-11 rounded-xl ${item.color} flex items-center
            justify-center text-white`}>
              <Icon size={24} />
            </div >
             {/* Info */}
            <div className="flex-1">
               <div className="flex  justify-between items-center mb-2">
                  <h3 className="font-semibold mx-3 text-gray-700">
                    {item.category}
                  </h3>
                  <p className="text-sm text-gray-500 font-medium">
                      Rs{item.spent.toLocaleString()} - Rs
                      {item.limit.toLocaleString()}
                    </p>
 <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${percentage}%` }}
                      className="h-full bg-teal-400 rounded-full"
                    />
                    </div>
               </div>
            </div>
          </div>

        )
      })
    }
  </div>
 </div>


       
          
          </div>
        </div>
      </div>
    





 
  )
}

export default BudgetTracker