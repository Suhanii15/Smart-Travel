import React,{useMemo} from 'react'
import {Compass, FileVideo} from 'lucide-react'
import Header from '../components/Header'
import {useState} from 'react'
import { ChevronsLeft } from 'lucide-react'
import { ArrowRight } from 'lucide-react'
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
const [editingCategory, setEditingCategory] = useState(null)
const [draftAmount, setDraftAmount] = useState("")

useEffect(()=>{
  const fetchDetails = async ()=>{
    if(!id){
      setError("No valid trip ID reference found in the URL path.");
        setLoading(false);
        return;
    }
    try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/trips/single/${id}`, {
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

const handleRowClick = (category) => {
  setEditingCategory(category)
  setDraftAmount(String(actualSpent[category] ?? ""))
}

const handleAmountChange = (value) => {
  setDraftAmount(value)
}

const handleUpdate = async (category) => {
  const parsedAmount = Number(draftAmount)

  if (draftAmount === "" || isNaN(parsedAmount) || parsedAmount < 0) {
    alert("Please enter a valid non-negative amount")
    return
  }

  const normalizedAmount = Number(parsedAmount.toFixed(2))

  setActualSpent(prev => ({ ...prev, [category]: normalizedAmount }))
  setEditingCategory(null)

  try {
    const token = localStorage.getItem("token")
    await axios.patch(
      `${import.meta.env.VITE_BACKEND_URL}/api/trips/${id}/actualspent`,
      { category, amount: normalizedAmount },
      { headers: { token } }
    )
  } catch (err) {
    console.error("Failed to save spent amount:", err)
    alert("Could not save to database. Your change may be lost on refresh.")
  }
}


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
    <div className="flex flex-col min-h-screen">
        <Header />
<div className="flex-1 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900/30 dark:to-slate-800 ml-4">
   
    <div className="flex flex-col gap-1">
      {isEditable && (
      <div onClick={goback}
       className="flex flex-row gap-1 p-2 hover:cursor-pointer">
        <ChevronsLeft className="text-gray-700 dark:text-gray-300" />
        <h3 className="text-gray-700 dark:text-gray-300 ">Back</h3>
      </div>
      )}
     
      
 </div>

<div className="flex flex-col mt-4 gap-3">
  
  <div className="flex flex-col lg:flex-row mt-3 mx-4 items-start lg:items-center gap-2">
       <Sparkles className="ml-2 text-blue-500 dark:text-blue-400 flex-shrink-0" />
    <h1 className="text-blue-500 dark:text-blue-400 font-semibold mx-3 text-xl lg:text-2xl">
      Estimated Budget
    </h1>
     <p className="text-gray-400 dark:text-gray-500 mt-1 font-medium">
          Total Budget: ₹{totalbudget.toLocaleString()}
        </p>

  </div>
  {/* Transport legs — add between heading and progress bar 
{trip.estimatedBudget?.transportLegs?.length > 0 && (
  <div className="mx-4 lg:w-3/4 bg-blue-50 dark:bg-blue-900/20 border 
                  border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-2">
    <h3 className="font-semibold text-blue-700 dark:text-blue-300 
                   text-sm mb-3">
      Getting There
    </h3>
    {trip.estimatedBudget.transportLegs.map((leg, i) => (
      <div key={i} className="flex justify-between items-center py-2 
                               border-b border-blue-100 dark:border-blue-800 
                               last:border-0">
        <div>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center gap-1.5">
            {leg.from} <ArrowRight size={14} className="text-blue-400" /> {leg.to}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {leg.mode} · {leg.duration}
          </p>
        </div>
        <span className="text-sm font-semibold text-blue-600 
                         dark:text-blue-400">
          ₹{leg.estimatedCost?.toLocaleString('en-IN')}
        </span>
      </div>
    ))}
    {trip.estimatedBudget.transportNote && (
      <p className="text-xs text-blue-600 dark:text-blue-400 mt-2 italic">
        {trip.estimatedBudget.transportNote}
      </p>
    )}
    {trip.estimatedBudget.alternativeMode && (
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
        Alternative: {trip.estimatedBudget.alternativeMode}
      </p>
    )}
  </div>
)}
  */}

  <div className="w-full lg:w-3/4 mx-4 mr-4 h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mt-5 ">
          <div
            style={{ width: `${progress}%` }}
            className="h-full bg-blue-600 dark:bg-blue-500 rounded-full transition-all duration-500"
          />
        </div>

        <div className="flex justify-between w-full lg:w-3/4 mt-2 text-sm font-medium px-4 lg:px-1">
            <p className="text-gray-600 dark:text-gray-400">Spent: ₹{totalspending.toLocaleString()}</p>
            <p className={remaining >= 0 ? "text-gray-600 dark:text-gray-400" : "text-red-500 font-bold"}>
              {remaining >= 0 ? `Remaining: ₹${remaining.toLocaleString()}` : `Overdraft: ₹${Math.abs(remaining).toLocaleString()}`}
            </p>
          </div>
<div>
</div>
 
 <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
  <div className="lg:col-span-2 space-y-2">
    {
      expenses.map((item,index)=>{
        const Icon=item.icon;
        const percentage = item.limit > 0 ? Math.min((item.spent / item.limit) * 100, 100) : 0;

        return(
          <div key={index} className="mx-4 py-2">
            <div
              onClick={() => handleRowClick(item.category)}
              className="flex cursor-pointer items-center justify-between gap-3 lg:gap-4"
            >
              {/* Icon */}
              <div className={`w-11 h-11 rounded-xl ${item.color} flex items-center justify-center text-white flex-shrink-0`}>
                <Icon size={24} />
              </div>
              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-2 gap-1">
                  <h3 className="font-semibold mx-3 text-gray-700 dark:text-gray-200 text-sm lg:text-base">
                    {item.category}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-medium whitespace-nowrap">
                    ₹{(item.spent || 0).toLocaleString('en-IN')} / ₹{(item.limit || 0).toLocaleString('en-IN')}
                  </p>
                </div>
                <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${percentage}%` }}
                    className="h-full bg-teal-400 rounded-full"
                  />
                </div>
              </div>
            </div>

            {editingCategory === item.category && (
              <div className="mt-2 flex max-w-sm flex-col gap-2 sm:flex-row" onClick={(e) => e.stopPropagation()}>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={draftAmount}
                  onChange={(e) => handleAmountChange(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleUpdate(item.category)}
                  placeholder={`Amount`}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-blue-500 focus:outline-none dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 sm:w-36"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleUpdate(item.category)
                  }}
                  className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            )}
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