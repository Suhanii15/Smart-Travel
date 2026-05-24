import React from 'react'
import { Plus, Share2, MoreHorizontal, Compass, MapPin, Clock } from 'lucide-react';
import Sidebar from '../components/Sidebar'
import {useState }from 'react';
import { ChevronsLeft } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { X } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { useContext } from 'react';
import axios from 'axios'
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

const Itinerary= () => {
const navigate=useNavigate();


const {id}=useParams();

const goback = () =>{
  navigate('/planner');
}

 

const [activeDay, setActiveDay] = useState(1);
const [trip,setTrip]=useState(null);
const [loading,setLoading]=useState(true);
const [error,setError]=useState("")

useEffect(()=>{
const fetchTripData= async()=>{
  if(!id){
    setError("No valid trip id exixts");
    setLoading(false);
    return;
  }

  try{
  const token=localStorage.getItem("token");
      const config={
       headers:{
  token: token
}

}
const response = await axios.get(`http://localhost:5000/api/trips/single/${id}`,config);
const fetchedTrip = response.data.trip;
console.log(fetchedTrip);
          setTrip(fetchedTrip);
          
if (fetchedTrip.status === "finalized" || fetchedTrip.status === "completed") {
   setIsEditable(false);
 }
  }
catch(err){
  console.log(err);
  setError(err.response?.data?.message || "Could not synchronize itinerary data with server.");

}
finally{
  setLoading(false);
}
  };
  fetchTripData();
},[id]);

const add_trip = async() =>{
  try{
const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      // router.post("/:tripId/day")
      const response = await axios.post(`http://localhost:5000/api/trips/${id}/day`, {}, config);
      const nextDay = Object.keys(trip.itinerary).length + 1

      if (response.data?.success) {
        setTrip(response.data.trip); // Backend returns the freshly updated trip document
        setActiveDay(nextDay);
      }
  }
  catch(err){
    console.log(err);
    alert(err.response?.data?.message || "Could not save new day layer to database.");
  }
};

const addActivity = async(day,period) =>{
  const newTask=window.prompt("What do you wanna do?");
  const newTime=window.prompt("And at what time?");

  if(!newTime || !newTask) return;
  try {
      const token = localStorage.getItem("token");
      const config = { headers:{
  token: token
} };
      
      const payload = {
        dayNumber: day,
        period: period, // "morning", "afternoon", "evening"
        task: newTask,
        time: newTime,
        location: "Local Sightseeing"
      };

      // router.post("/:tripId/activity")
      const response = await axios.post(`http://localhost:5000/api/trips/${id}/activity`, payload, config);

      if (response.data?.success) {
        setTrip(response.data.trip); // Update UI with DB document containing new activity + unique _id
      }
    } catch (err) {
      console.error("Error adding activity:", err);
      alert(err.response?.data?.message || "Could not bind activity node.");
    }

};

const deleteActivity = async(period,activityId) =>{
  try {
      const token = localStorage.getItem("token");
      const config = { headers:{
  token: token
},
  data: { dayNumber: String(activeDay), period }
 };
      
      // router.delete("/:tripId/day/:dayNumber/dayNumber/:period/period/activity/:activityId")
      const response = await axios.delete(
        `http://localhost:5000/api/trips/${id}/activity/${activityId}`,
        config
      );

      if (response.data?.success) {
        setTrip(response.data.trip);
      }
    } catch (err) {
      console.error("Error deleting activity:", err);
      alert(err.response?.data?.message || "Could not purge server node.");
    }
}

const deleteday = async(daytodelete)=>{
  if (Object.keys(trip.itinerary).length <= 1) return;
try {
      const token = localStorage.getItem("token");
      const config = { headers:{
  token: token
} };

      // router.delete("/:tripId/day/:dayNumber")
      const response = await axios.delete(`http://localhost:5000/api/trips/${id}/day/${daytodelete}`, config);

      if (response.data?.success) {
        setTrip(response.data.trip);
        if (activeDay === daytodelete) setActiveDay(1);
      }
    } catch (err) {
      console.error("Error deleting day layer:", err);
      alert(err.response?.data?.message || "Could not remove day track.");
    }
  
};

const [isEditable, setIsEditable] = useState(true);
const {user, logoutuser}=useContext(AuthContext);

const saveDraft = async() =>{
  try{
    const token=localStorage.getItem("token");
    await axios.put(`http://localhost:5000/api/trips/single/${id}`, {trip} ,{
      headers:{
  token: token
}
    });

    alert("Draft synced");
    navigate('/mytrips');


  } catch(err){
console.log(err);
  }
}

const handleFinaliseTrip = async () => {
    const confirmation = window.confirm("Are you sure you want to finalize this trip? This will lock current planning structures and activate dynamic budget tools.");
    if (!confirmation) return;

    try {
      const token = localStorage.getItem("token");
      
    

      // Dispatch status patch mapping target update
      const response = await axios.patch(
        `http://localhost:5000/api/trips/${id}/status`,
        { status: "finalized" },
        { headers:{
  token: token
} }
      );

      if (response.data.success) {
        setIsEditable(false);
        alert("Trip structural tracking finalized successfully! Shifting to Upcoming timeline. ✈️");
        navigate('/mytrips');
      }
    } catch (err) {
      console.error("Finalization Pipeline Crash:", err);
      alert(err.response?.data?.message || "Error running trip lock finalization sequence.");
    }
  };

  if (loading || !trip || !trip.itinerary || Object.keys(trip.itinerary).length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600 font-medium">Assembling your custom travel parameters...</p>
        </div>
      </div>
    );
  }



if(error || !trip){
  return(
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="bg-white p-8 rounded-2xl shadow-md border text-center max-w-md">
          <p className="text-red-500 font-bold mb-4"> Initialization Error</p>
          <p className="text-gray-600 text-sm mb-6">{error || "The itinerary payload could not be decoded safely."}</p>
          <button onClick={() => navigate('/planner')} className="px-5 py-2 bg-blue-600 text-white font-semibold rounded-xl text-sm">
            Return to Planner
          </button>
        </div>
      </div>
  );
}
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
      <h3 className="text-gray-400 text-sm">{new Date(trip.startDate).toLocaleDateString('en-IN',{day:'numeric', month:'short',year:'numeric'})}-{new Date(trip.endDate).toLocaleDateString('en-IN',{day:'numeric', month:'short', year:'numeric'})}</h3>
      <h3 className="text-gray-400 text-sm">{trip.peopleCount || trip.members || 1} Members</h3>
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

<div className="flex items-center gap-2 mb-10 border border-gray-300 mt-2 rounded-[2rem] shadow-md px-4 py-2">
  
  {/* Scrollable tabs — takes remaining space */}
  <div className="flex items-center gap-1 overflow-x-auto flex-1 min-w-0 scrollbar-hide pb-1">
    {Object.keys(trip.itinerary || {}).sort((a, b) => Number(a) - Number(b)).map((dayKey) => {
      const day = Number(dayKey);
      return (
        <button
          key={day}
          onClick={() => setActiveDay(day)}
          className={`relative cursor-pointer px-5 py-2 flex-shrink-0 transition-all ${
            activeDay === day ? 'text-blue-600' : 'text-gray-400'
          }`}
        >
          <span className="text-xs uppercase block text-center">Day</span>
          <span className="text-xl font-bold block leading-none">{day}</span>
          {isEditable && (
            <button
              onClick={(e) => { e.stopPropagation(); deleteday(day); }}
              className="absolute -top-1 -right-1 p-1 hover:cursor-pointer"
            >
              <X className="h-3 w-3" />
            </button>
          )}
          {activeDay === day && (
            <div className="absolute bottom-[-8px] left-0 w-full h-0.5 bg-blue-600 rounded-full" />
          )}
        </button>
      );
    })}
  </div>

  {/* Action buttons — never shrink, always visible */}
  <div className="flex items-center gap-2 flex-shrink-0 border-l border-gray-200 pl-3">
    {isEditable && (
      <button
        onClick={add_trip}
        className="flex items-center border border-gray-300 cursor-pointer px-3 py-2 rounded-[2rem] gap-1 text-blue-600 font-bold hover:-translate-y-1 shadow-md transition duration-200 whitespace-nowrap"
      >
        <Plus size={16} /> Add Day
      </button>
    )}
    <div
      onClick={() => navigate(`/budgettracker/${id}`)}
      className="bg-green-400 flex items-center px-3 py-2 cursor-pointer rounded-[2rem] text-white font-semibold hover:-translate-y-1 shadow-md transition duration-200 whitespace-nowrap"
    >
      Track Budget
    </div>
    <div
      onClick={() => navigate(`/collaborations/${id}`)}
      className="bg-yellow-400 flex items-center px-3 py-2 cursor-pointer rounded-[2rem] text-white font-semibold hover:-translate-y-1 shadow-md transition duration-200 whitespace-nowrap"
    >
      Add Collaborators
    </div>
  </div>

</div>


<div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Timeline Columns (Morning, Afternoon, Evening) */}
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
            {['Morning', 'Afternoon', 'Evening'].map((period) => (
              <div key={period} className="space-y-4">
                <h3 className="text-gray-400 font-bold flex items-center gap-2 text-sm uppercase tracking-widest">
                  <span className="text-blue-500 text-xl">✦</span> {period}
                </h3>
                {trip.itinerary[activeDay]?.[period.toLowerCase()]?.map((item, idx) => (
                  <div key={idx} className=" relative bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group hover:cursor-pointer">
                    {isEditable && (
                    <button
    onClick={() => deleteActivity(period.toLowerCase(), item._id)}
    className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all hover:text-red-500 cursor-pointer"
  >
    <X className="w-4 h-4" />
  </button>
                )}

                    <div className="flex items-center gap-4 mb-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        period === 'Morning' ? 'bg-purple-100 text-purple-600' : 
                        period === 'Afternoon' ? 'bg-emerald-100 text-emerald-600' : 'bg-orange-100 text-orange-600'
                      }`}>
                        <MapPin size={18} />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-800 leading-tight">{item.task}</h4>
                        <div className="flex items-center gap-1 text-blue-500 font-bold text-sm mt-1">
                          <Clock size={14} /> {item.time}
                        </div>
                      </div>
                      
                    </div>
                  </div>
                ))}
{isEditable && (
                <button onClick={() => addActivity(activeDay, period.toLowerCase())}
                 className="w-full py-4 border-2 border-dashed border-slate-200 rounded-[2rem] text-blue-600 font-bold flex items-center justify-center
                 gap-2 hover:bg-blue-50 transition-colors hover:-translate-y-1 cursor-pointer ">
                  <Plus size={18} /> Add Activity
                </button>
)}
              </div>
            ))}
          </div>



<div className="flex flex-col justify-between mx-4 space-y-4">
            <div className="bg-white w-full p-6 rounded-[2rem] mr-3 shadow-md shadow-gray-400 ">
              <div className="flex flex-row gap-2 ">
              <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-4">
                <Compass size={20} />
              </div>
              <h4 className="font-bold mt-1  text-gray-900 mb-2">AI Suggestions</h4>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed mb-4">
                This route looks great! Hadimba Temple is just 20 mins from your hotel.
              </p>
              <button className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-200 hover:cursor-pointer">
                View on Map
              </button>
            </div>
            <div className="flex flex-row w-full mr-3 justify-between">
              {isEditable && (
                
              <button 
              onClick={saveDraft}
               className="border border-blue-600 text-gray-700 font-semibold text-sm px-3 border-2 py-3 rounded-[2rem] bg-white shadow-md shadow-gray-400 hover:-translate-y-1 transition duration-300 cursor-pointer">
                Save as Draft
              </button>
              )}
              
              <button disabled={!isEditable}
              onClick={handleFinaliseTrip}
              className={`font-semibold text-sm px-3 py-3 border-2 rounded-[2rem] shadow-md transition duration-300 ${
                isEditable ? "bg-blue-600 text-white hover:-translate-y-2 cursor-pointer" : "bg-gray-200 text-gray-500 cursor-not-allowed"
              }`}
             >
              {isEditable ? "Finalise Trip" : "Trip Locked"}
              </button>
              
            </div>
          </div>
        </div>
    </div>












</div>










  )
}

export default Itinerary