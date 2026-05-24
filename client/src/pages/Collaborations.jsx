import React from 'react'
import { Plus, Share2, MoreHorizontal, Users, Compass,MapPin, Clock } from 'lucide-react';
import Sidebar from '../components/Sidebar'
import {useState }from 'react';
import { ChevronsLeft } from 'lucide-react';
import { useNavigate, useParams } from "react-router-dom";
import { X } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { useContext } from 'react';
import { useEffect } from 'react';
import axios from "axios"
const Collaborations = () => {
    
    const navigate=useNavigate();
    const { id } = useParams();
    
    const goback = () =>{
      navigate(`/itinerary/${id}`);
    }
    
   /*   const DUMMY_TRIP = {
      destination: "Manali Trip",
      startDate: "10 May",
      endDate: "15 May 2026",
      members:4,
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
    */
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
      const { id } = useParams();
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
          const config = { headers: { token :token } };
          
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
    
    const deleteActivity = async(period,index) =>{
      try {
          const token = localStorage.getItem("token");
          const config = { headers: { token:token } };
          
          // router.delete("/:tripId/day/:dayNumber/dayNumber/:period/period/activity/:activityId")
          const response = await axios.delete(
            `http://localhost:5000/api/trips/${id}/day/${activeDay}/dayNumber/${period}/period/activity/${activityId}`,
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
          const config = { headers: { token:token } };
    
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
          headers:{token :token}
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
            {headers:{
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
    
  const [searchResults, setSearchResults] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [search, setSearch] = useState("");
    
    
  /*  const [members, setMembers] = useState([
  {
    id: 1,
    name: "Suhani",
    role: "Admin",
    isOwner: true,
  },
  {
    id:2,
    name:"Shubh",
    role:"User",
    isOwner:false,
  },
  {
    id:3,
    name:"Akshita",
    role:"User",
    isOwner:false,
  },
  {
    id:4,
    name:"Khanak",
    role:"User",
    isOwner:false,
  }
]);

const removeMember = (id) =>{
    setMembers((prev)=>prev.filter((member)=>member.id !== id))
};

const USERS = [
  { id: 5, name: "Rohan" },
  { id: 6, name: "Manoj" },
  { id: 7, name: "Pooja" },
  { id: 8, name: "Harsh" },
]; */
useEffect(() => {
    const delaySearchDebounce = setTimeout(async () => {
      if (!search.trim()) {
        setSearchResults([]);
        return;
      }
      try {
        const token = localStorage.getItem("token");
        const config = { headers:{
  token: token
}};
        
        const response = await axios.get(`http://localhost:5000/api/users/search?username=${search}`, config);
        if (response.data?.success) {
          setSearchResults(response.data.users);
        }
      } catch (err) {
        console.error("User Search network error:", err);
      }
    }, 400); 

    return () => clearTimeout(delaySearchDebounce);
  }, [search]);
  
const addMember = async (targetUser) => {
    try {
      const token = localStorage.getItem("token");
      const config = { headers:{
  token: token
} };

      const response = await axios.post(
        `http://localhost:5000/api/trips/${trip._id}/collaborators`,
        { userToInvite: targetUser._id },
        config
      );

      if (response.data?.success) {
        setTrip(response.data.trip); // Update with newly populated backend response
        setShowSearch(false);
        setSearch("");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Could not assign member to itinerary.");
    }
  };

  const removeMember = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      const config = { headers:{
  token: token
} };

      const response = await axios.delete(
        `http://localhost:5000/api/trips/${trip._id}/collaborators/${userId}`,
        config
      );

      if (response.data?.success) {
        setTrip(response.data.trip);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to execute deletion procedure.");
    }
  };
 if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600 font-medium">Assembling your custom travel parameters... </p>
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
      <h3 className="text-gray-400 text-sm">{trip.startDate} - {trip.endDate}</h3>
      <h3 className="text-gray-400 text-sm">{trip.members} Members</h3>
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
    onClick={() => deleteActivity(period.toLowerCase(), idx)}
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
           
            
            <div className=" bg-white w-full p-6 rounded-[2rem] mr-3 shadow-md shadow-gray-400 ">
                <div className="flex flex-row gap-2 ">
              <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-4">
                <Users size={20} />
              </div>
              <h4 className="font-bold mt-1  text-gray-900 mb-2">Add Collaborators</h4>
              </div>
             <div className="border border-gray-200 rounded-[2rem] p-2 flex flex-col">
             {(trip?.collaborators || []).map((member) => (
                <div key={member.id} className="flex items-center justify-between  rounded-2xl px-4 py-3">
                    <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
          {member.user.name[0]}
        </div>

        <div>
          <p className="font-medium text-gray-800">
            {member.user.name}
          </p>

          <p className="text-xs text-gray-400">
            {member.role}
          </p>
        </div>
      </div>

      {member.role !== "Admin" && (
        <X
          size={16}
          onClick={() => removeMember(member.user._id)}
          className="text-gray-400 hover:text-red-500 cursor-pointer"
        />
      )}
             </div>
             ))}
      
           
           {/* Add Member Button */}

<div className="mt-4">

  <button
    onClick={() => setShowSearch(true)}
    className="w-full border-2 border-blue-300 rounded-[2rem]
    py-4 flex items-center justify-center gap-2
    text-blue-600 font-semibold hover:bg-blue-50 transition cursor-pointer"
  > 
    <Plus size={18} />
    Add Member
  </button>

</div>

{/* Search Modal */}

{showSearch && (
  <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">

    <div className="bg-white w-[400px] rounded-[2rem] p-6 shadow-2xl border border-gray-200">

      {/* Top */}

      <div className="flex items-center justify-between mb-5">

        <h2 className="text-xl font-bold text-gray-800">
          Add Members
        </h2>

        <X
          size={20}
          onClick={() => setShowSearch(false)}
          className="cursor-pointer text-gray-400 hover:text-red-500"
        />

      </div>

      {/* Search Input */}

      <input
        type="text"
        placeholder="Search users..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full border border-gray-200 rounded-2xl p-4 outline-none focus:border-blue-400"
      />

      {/* User List */}

      <div className="mt-5 flex flex-col gap-3 max-h-[300px] overflow-y-auto">

       {searchResults
  .filter((user) =>
    !(trip?.collaborators || []).some((m) => m.user._id === user._id)
  )
  .map((user) => (
    <div key={user._id} className="flex items-center justify-between border border-gray-100 rounded-2xl px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
          {user.name[0]}
        </div>
        <div>
          <p className="font-medium text-gray-700">{user.name}</p>
          <p className="text-xs text-gray-400">SmartTravel User</p>
        </div>
      </div>
      <button
        onClick={() => addMember(user)}
        className="bg-blue-600 text-white px-5 py-2 rounded-xl hover:bg-blue-700 transition"
      >
        Add
      </button>
    </div>
  ))}

      </div>

    </div>

  </div>
)}
      </div>
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
              onClick={()=>setIsEditable(false)}
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

export default Collaborations