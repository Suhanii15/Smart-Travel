import React,{useMemo} from 'react'
import {Compass, FileVideo} from 'lucide-react'
import Sidebar from '../components/Sidebar'
import {useState} from 'react'
import { ChevronsLeft } from 'lucide-react'
import { useNavigate, useParams } from "react-router-dom";
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
import { useEffect } from 'react'
import axios from "axios"


const BudgetTracker = () => {
  const navigate=useNavigate();
  const goback = () =>{
  navigate(`/itinerary/${id}`);
}

 /*  const DUMMY_TRIP = {
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
};*/

const {id}=useParams();
const {user,logoutuser}=useContext(AuthContext);
const [trip,setTrip]=useState(null);
const [isEditable, setIsEditable] = useState(true);
const [loading,setLoading]=useState(true);
const [error,setError]=useState("");

const [actualSpent, setActualSpent]=useState({
  Accomodation:0,
  Transport:0,
  Food:0,
  Activities:0,
  Miscellaneous:0

})

useEffect(()=>{
  const fetchDetails = async ()=>{
    if(!id){
      setError("No valid trip ID reference found in the URL path.");
        setLoading(false);
        return;
    }
    try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`https://smart-travel-hvla.onrender.com/api/trips/single/${id}`, {
          headers: { token:token }
        });

        if (response.data?.success) {
  const fetchedTrip = response.data.trip;
  if (!fetchedTrip) {
    setError("Trip not found");
    return;
  }
  setTrip(fetchedTrip);

  // Guard — actualSpent may not exist on older trips
  const spent = fetchedTrip.actualSpent || {};
  setActualSpent({
    Accomodation:  spent.Accomodation  || 0,
    Transport:     spent.Transport      || 0,
    Food:          spent.Food           || 0,
    Activities:    spent.Activities     || 0,
    Miscellaneous: spent.Miscellaneous  || 0,
  });
} else {
          setError("Failed to fetch matching budget details.");
        }
      } catch (err) {
        console.error("Budget Retrieval Error:", err);
        setError(err.response?.data?.message || "Error syncing budget metadata.");
      } finally {
        setLoading(false);
      }
    
  };
  fetchDetails();
}, [id]);

  
 
const expenses = useMemo(()=>{
if (!trip || !trip.estimatedBudget) return [];

  const budget = trip.estimatedBudget;

return [
    {
      category: "Transport",
      spent:actualSpent.Transport,
      limit:budget.transportationTotal || 0,
      icon: Car,
      color: "bg-purple-500",
    },
    {
      category: "Accomodation",
      spent:actualSpent.Accomodation,
      limit:budget.accommodationTotal || 0,
      icon: Hotel,
      color: "bg-orange-400",
    },
    {
      category: "Food",
      spent:actualSpent.Food,
      limit:budget.foodAndDiningTotal || 0,
      icon: UtensilsCrossed,
      color: "bg-emerald-500",
    },
    {
      category: "Activities",
       spent:actualSpent.Activities,
      limit:budget.activitiesTotal || 0,
      icon: Ticket,
      color: "bg-yellow-400",
    },
      
    {
      category: "Miscellaneous",
       spent:actualSpent.Miscellaneous,
      limit:budget.miscellaneousTotal || 0,
      icon: ShoppingBag,
      color: "bg-violet-500",
    },

  ];

});

const handleUpdate = async (category) => {
  const userInput = window.prompt(
    `Enter actual amount spent on ${category}:`,
    actualSpent[category] || ""
  );
  if (userInput === null) return;

  const parsedAmount = Number(userInput);
  if (isNaN(parsedAmount) || parsedAmount < 0) {
    alert("Please enter a positive number");
    return;
  }

  // Update local state immediately for responsive UI
  setActualSpent(prev => ({ ...prev, [category]: parsedAmount }));

  // Persist to DB
  try {
    const token = localStorage.getItem("token");
    await axios.patch(
      `https://smart-travel-hvla.onrender.com/api/trips/${id}/actualspent`,
      { category, amount: parsedAmount },
      { headers: { token } }
    );
  } catch (err) {
    console.error("Failed to save spent amount:", err);
    alert("Could not save to database. Your change may be lost on refresh.");
  }
};


const totalbudget = useMemo(() => {
  return expenses.reduce((acc, item) => acc + Number(item.limit || 0), 0);
}, [expenses]);

  const totalspending = useMemo(()=>{
    return expenses.reduce((acc,item)=>acc + item.spent,0);
  },[expenses]);

  const remaining=totalbudget-totalspending;

  const progress=(totalspending/totalbudget) * 100;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-blue-600 dark:border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600 dark:text-gray-400 font-medium">Fetching real-time AI budget calculations... </p>
        </div>
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-md border text-center max-w-md">
          <p className="text-red-500 font-bold mb-2">Synchronization Error</p>
          <p className="text-gray-600 dark:text-gray-400 text-xs mb-4">{error}</p>
          <button onClick={() => navigate('/planner')} className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-xl text-xs">
            Return to Planner
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-row min-h-screen">
        {/* leftside*/}
        <div className="flex flex-col gap-3 bg-slate-100 dark:bg-slate-800 min-h-screen w-72">
        <div className="flex gap-2 my-2 gap-5">
                    <div className="p-2 ml-2 h-10 bg-blue-500/10 dark:bg-blue-400/20 top-2 rounded-full">
                     <Compass className="text-blue-500 dark:text-blue-400" strokeWidth={2.5} />
                     </div>
                     <span className="text-xl mt-2 font-bold tracking-tight text-gray-600 dark:text-gray-300">
              Smart<span className="text-blue-500 dark:text-blue-400">Travel</span>
            </span>
        </div>
<Sidebar />
</div>
{/* rightside*/}
<div className="flex-1 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900/30 dark:to-slate-800">
  <div className="flex flex-row items-center border border-gray-200 dark:border-gray-700 shadow-md rounded-lg justify-between w-full p-6 dark:bg-slate-800">
   <div className="flex flex-col gap-1 mx-3 mt-4 ">
      <h1 className="font-bold text-gray-700 dark:text-gray-100 text-2xl ">{trip.destination}</h1>
      <h3 className="text-gray-400 dark:text-gray-500 text-sm">{new Date(trip.startDate).toLocaleDateString('en-IN',{day:'numeric', month:'short',year:'numeric'})}-{new Date(trip.endDate).toLocaleDateString('en-IN',{day:'numeric', month:'short', year:'numeric'})}</h3>
     <h3 className="text-gray-400 dark:text-gray-500 text-sm">{trip.peopleCount} Members</h3>
    </div>
    <div className="flex flex-col gap-1">
      {isEditable && (
      <div onClick={goback}
       className="flex flex-row gap-1 p-2 hover:cursor-pointer">
        <ChevronsLeft className="text-gray-700 dark:text-gray-300" />
        <h3 className="text-gray-700 dark:text-gray-300 ">Back</h3>
      </div>
      )}
     <div className="flex mt-2 mr-4 px-1 gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-600 dark:bg-blue-500 text-white flex items-center justify-center font-bold">
        {user?.name[0]}
          </div>
          <p className="text-gray-700 dark:text-gray-200 mt-1 font-medium">{user?.name}</p>
      </div>
      </div>
 </div>

<div className="flex flex-col mt-4 gap-3">
  
  <div className="flex flex-row mt-3 mx-4 items-center gap-2">
       <Sparkles className="ml-2 text-blue-500 dark:text-blue-400" />
    <h1 className="text-blue-500 dark:text-blue-400 items-center font-semibold mx-3 text-2xl">
      Estimated Budget
    </h1>
     <p className="text-gray-400 dark:text-gray-500 mt-1 font-medium">
          Total Budget: ₹{totalbudget.toLocaleString()}
        </p>

  </div>
  <div className="lg:w-3/4 mx-4 mr-4 h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mt-5">
          <div
            style={{ width: `${progress}%` }}
            className="h-full bg-blue-600 dark:bg-blue-500 rounded-full transition-all duration-500"
          />
        </div>

        <div className="flex justify-between lg:w-3/4 mt-2 text-sm font-medium px-1">
            <p className="text-gray-600 dark:text-gray-400">Spent: ₹{totalspending.toLocaleString()}</p>
            <p className={remaining >= 0 ? "text-gray-600 dark:text-gray-400" : "text-red-500 font-bold"}>
              {remaining >= 0 ? `Remaining: ₹${remaining.toLocaleString()}` : `Overdraft: ₹${Math.abs(remaining).toLocaleString()}`}
            </p>
          </div>
<div>
</div>
 
 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
  <div className="lg:col-span-2 space-y-5">
    {
      expenses.map((item,index)=>{
        const Icon=item.icon;
        const percentage = item.limit > 0 ? Math.min((item.spent / item.limit) * 100, 100) : 0;

        return(
          <div key={index} onClick={() => handleUpdate(item.category)}
           className="flex mx-4 justify-between items-center gap-4">
            {/* Icon */}
            <div className={`w-11 h-11 rounded-xl ${item.color} flex items-center
            justify-center text-white`}>
              <Icon size={24} />
            </div >
             {/* Info */}
            <div className="flex-1">
               <div className="flex  justify-between items-center mb-2">
                  <h3 className="font-semibold mx-3 text-gray-700 dark:text-gray-200">
                    {item.category}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                     ₹{(item.spent || 0).toLocaleString('en-IN')} / ₹{(item.limit || 0).toLocaleString('en-IN')}
                    </p>
  <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
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