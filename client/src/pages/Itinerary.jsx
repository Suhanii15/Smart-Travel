import React from 'react'
import { Plus, Share2, MoreHorizontal, Compass, MapPin, Clock, Users, Sunrise, Sun, Moon } from 'lucide-react';
import Header from '../components/Header'
import {useState }from 'react';
import { ChevronsLeft } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { X } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { useContext } from 'react';
import axios from 'axios'
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getDestinationImage } from '../utils/getDestinationImage';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { motion } from 'framer-motion';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl:       'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl:     'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});


const Itinerary= () => {
const navigate=useNavigate();


const {id}=useParams();

const goback = () =>{
  navigate('/planner');
}

 

const [activeDay, setActiveDay] = useState(1);
const [trip,setTrip]=useState(null);
const [loading,setLoading]=useState(true);
const [error,setError]=useState("");

const [showMap, setShowMap] = useState(false);
  const [mapMarkers, setMapMarkers] = useState([]);
  const [mapLoading, setMapLoading] = useState(false);

const [showCollab, setShowCollab] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [search, setSearch] = useState("");
  const [tripImage, setTripImage] = useState("");

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
const response = await axios.get(`https://smart-travel-hvla.onrender.com/api/trips/single/${id}`,config);
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

useEffect(() => {
  if (!trip?.destination) return;

  const fetchImage = async () => {
    const imageUrl = await getDestinationImage(trip.destination);
    setTripImage(imageUrl);
  };

  fetchImage();
}, [trip?.destination]);

 const handleViewMap = async () => {
    setShowMap(true);
    setMapLoading(true);
    setMapMarkers([]);

    const dayData = trip.itinerary[activeDay];
    if (!dayData) { setMapLoading(false); return; }

    const activities = [
      ...(dayData.morning   || []),
      ...(dayData.afternoon || []),
      ...(dayData.evening   || []),
    ].filter(a => a.location && a.location !== "Local Sightseeing");

    // Add destination itself as first marker
    const allToGeocode = [
      { task: trip.destination, location: trip.destination, time: "" },
      ...activities
    ];

    const results = [];
    for (const activity of allToGeocode) {
      try {
        const query = `${activity.location}, ${trip.destination}`;
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`,
          { headers: { 'Accept-Language': 'en' } }
        );
        const data = await res.json();
        if (data[0]) { results.push({
            task:     activity.task,
            time:     activity.time,
            location: activity.location,
            lat:      parseFloat(data[0].lat),
            lng:      parseFloat(data[0].lon),
          });
        }
        // Small delay to respect Nominatim rate limit
        await new Promise(r => setTimeout(r, 300));
      } catch (err) {
        console.error("Geocode failed for:", activity.location);
      }
    }

    setMapMarkers(results);
    setMapLoading(false);
  };



const add_trip = async() =>{
  try{
const token = localStorage.getItem("token");
      const config = { headers: { token: token } };
      
      // router.post("/:tripId/day")
      const response = await axios.post(`https://smart-travel-hvla.onrender.com/api/trips/${id}/day`, {}, config);
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
      const response = await axios.post(`https://smart-travel-hvla.onrender.com/api/trips/${id}/activity`, payload, config);

      if (response.data?.success) {
        setTrip(response.data.trip); // Update UI with DB document containing new activity + unique _id
      }
    } catch (err) {
      console.error("Error adding activity:", err);
      alert(err.response?.data?.message || "Could not bind activity node.");
    }

};

const deleteActivity = async(activityId,period,activityIndex) =>{
  try {
      const token = localStorage.getItem("token");
      const config = { headers:{
  token: token
},
  data: { dayNumber: String(activeDay), period, activityIndex }
 };
      
      // router.delete("/:tripId/day/:dayNumber/dayNumber/:period/period/activity/:activityId")
      const response = await axios.delete(
        `https://smart-travel-hvla.onrender.com/api/trips/${id}/activity/${activityId}`,
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
      const response = await axios.delete(`https://smart-travel-hvla.onrender.com/api/trips/${id}/day/${daytodelete}`, config);

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

const isAdmin = trip?.collaborators?.some(
  (c) => {
    const collaboratorId = c.user?._id?.toString();
    const currentUserId = (user?._id || user?.id)?.toString();
    return collaboratorId === currentUserId && c.role === "admin";
  }
);

const saveDraft = async() =>{
  try{
    const token=localStorage.getItem("token");
    await axios.put(`https://smart-travel-hvla.onrender.com/api/trips/single/${id}`, {trip} ,{
      headers:{
  token: token
}
    });

    alert("Draft synced");
    navigate('/mytrips', { state: { initialTab: "Drafts" } });


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
        `https://smart-travel-hvla.onrender.com/api/trips/${id}/status`,
        { status: "finalized" },
        { headers:{
  token: token
} }
      );

      if (response.data.success) {
        setIsEditable(false);
        alert("Trip structural tracking finalized successfully! Shifting to Upcoming timeline.");
        navigate('/mytrips');
      }
    } catch (err) {
      console.error("Finalization Pipeline Crash:", err);
      alert(err.response?.data?.message || "Error running trip lock finalization sequence.");
    }
  };

  useEffect(() => {
    const delaySearchDebounce = setTimeout(async () => {
      if (!search.trim()) {
        setSearchResults([]);
        return;
      }
      try {
        const token = localStorage.getItem("token");
        const config = { headers: { token: token } };
        const response = await axios.get(`https://smart-travel-hvla.onrender.com/api/trips/search?username=${search}`, config);
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
      const config = { headers: { token: token } };
      const response = await axios.post(
        `https://smart-travel-hvla.onrender.com/api/trips/${id}/collaborators`,
        { userToInvite: targetUser._id },
        config
      );
      if (response.data?.success) {
        setTrip(response.data.trip);
        setSearch("");
        setSearchResults([]);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Could not assign member to itinerary.");
    }
  };

  const removeMember = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { token: token } };
      const response = await axios.delete(
        `https://smart-travel-hvla.onrender.com/api/trips/${id}/collaborators/${userId}`,
        config
      );
      if (response.data?.success) {
        setTrip(response.data.trip);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to execute deletion procedure.");
    }
  };

  if (loading || !trip || !trip.itinerary || Object.keys(trip.itinerary).length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-blue-600 dark:border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }



if(error || !trip){
  return(
    <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900">
        <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-md border text-center max-w-md">
          <p className="text-red-500 font-bold mb-4"> Initialization Error</p>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">{error || "The itinerary payload could not be decoded safely."}</p>
          <button onClick={() => navigate('/planner')} className="px-5 py-2 bg-blue-600 dark:bg-blue-500 text-white font-semibold rounded-xl text-sm">
            Return to Planner
          </button>
        </div>
      </div>
  );
}
 const mapCenter = mapMarkers.length > 0
    ? [mapMarkers[0].lat, mapMarkers[0].lng]
    : [20.5937, 78.9629]; 

  return (
   <div className="flex flex-col min-h-screen overflow-x-hidden">
    {showMap && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-[2rem] overflow-hidden w-full max-w-4xl h-[80vh] flex flex-col">
            
            {/* Modal header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700">
              <div>
                <h2 className="font-bold text-gray-800 dark:text-gray-100 text-lg">
                  Day {activeDay} — {trip.destination}
                </h2>
                <p className="text-gray-400 dark:text-gray-500 text-sm">
                  {mapLoading ? "Finding locations..." : `${mapMarkers.length} locations found`}
                </p>
              </div>
              <button
                onClick={() => setShowMap(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full transition cursor-pointer"
              >
                <X size={20} className="text-gray-600 dark:text-gray-400" />
              </button>
            </div>
 <div className="flex-1 relative">
              {mapLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center space-y-3">
                    <div className="w-10 h-10 border-4 border-blue-600 dark:border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Finding Activity Spots</p>
                  </div>
                </div>
              ) : mapMarkers.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-400 dark:text-gray-500">No locations found for this day</p>
                </div>
              ) : (
                <MapContainer
                  center={mapCenter}
                  zoom={13}
                  style={{ height: "100%", width: "100%" }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
                  />
 {mapMarkers.map((marker, i) => (
                    <Marker key={i} position={[marker.lat, marker.lng]}>
                      <Popup>
                        <div className="text-sm">
                           <p className="font-bold text-gray-800 dark:text-gray-100">{marker.task}</p>
                          {marker.time && <p className="text-blue-500 dark:text-blue-400 flex items-center gap-1"><Clock size={13} /> {marker.time}</p>}
                           <p className="text-gray-500 dark:text-gray-400 flex items-center gap-1"><MapPin size={13} /> {marker.location}</p>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              )}
            </div>
          </div>
        </div>
      )}


        <Header />
<div className=" min-w-0 px-4 lg:px-6">
  <div
    className="relative mb-15 overflow-hidden rounded-[2rem] border border-white/40 p-4 lg:p-6 shadow-md"
    style={tripImage ? {
      backgroundImage: `linear-gradient(to right, rgba(15,23,42,0.72), rgba(15,23,42,0.35)), url('${tripImage}')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    } : undefined}
  >
    <div className="relative z-10 flex flex-col gap-2">
      <div className="flex flex-row items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="font-bold text-white text-2xl drop-shadow-sm">{trip.destination}</h1>
          <h3 className="text-slate-100/90 text-sm">{new Date(trip.startDate).toLocaleDateString('en-IN',{day:'numeric', month:'short',year:'numeric'})}-{new Date(trip.endDate).toLocaleDateString('en-IN',{day:'numeric', month:'short', year:'numeric'})}</h3>
          <h3 className="text-slate-100/90 text-sm">{trip.peopleCount || trip.members || 1} Members</h3>
        </div>
        <div className="flex flex-col gap-1">
          {isEditable && (
            <div onClick={goback} className="flex flex-row gap-1 p-2 hover:cursor-pointer text-white">
              <ChevronsLeft className="text-white" />
              <h3 className="text-white">Back</h3>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-1">
        <div className="flex items-center gap-1 overflow-x-auto flex-1 min-w-0 scrollbar-hide pb-1">
          {Object.keys(trip.itinerary || {}).sort((a, b) => Number(a) - Number(b)).map((dayKey) => {
            const day = Number(dayKey);
            return (
              <button
                key={day}
                onClick={() => setActiveDay(day)}
                className={`relative cursor-pointer px-5 py-2 flex-shrink-0 rounded-xl transition-all ${
                  activeDay === day ? 'bg-white/20 text-white' : 'text-slate-100/80 hover:bg-white/10'
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
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 flex-shrink-0 border-t lg:border-t-0 lg:border-l border-white/25 pt-3 lg:pt-0 lg:pl-3">
          {isEditable && (
            <button
              onClick={add_trip}
              className="flex items-center border border-white/40 bg-white/90 cursor-pointer px-3 py-2 rounded-[2rem] gap-1 text-blue-700 font-bold hover:-translate-y-1 shadow-md transition duration-200 whitespace-nowrap"
            >
              <Plus size={16} /> Add Day
            </button>
          )}
          <div
            onClick={() => navigate(`/budgettracker/${id}`)}
            className="bg-green-600/90 flex items-center px-3 py-2 cursor-pointer rounded-[2rem] text-white font-semibold hover:-translate-y-1 shadow-md transition duration-200 whitespace-nowrap"
          >
            Track Budget
          </div>
          <div
            onClick={() => setShowCollab(true)}
            className="bg-yellow-500/90 flex items-center px-3 py-2 cursor-pointer rounded-[2rem] text-white font-semibold hover:-translate-y-1 shadow-md transition duration-200 whitespace-nowrap"
          >
            Collaborators
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

{showCollab && (
  <div className="fixed inset-0 bg-black/20 dark:bg-black/50 flex items-center justify-center z-50">

    <div className="bg-white dark:bg-slate-800 w-[90vw] max-w-[420px] max-h-[85vh] overflow-y-auto rounded-[2rem] p-6 shadow-2xl border border-gray-200 dark:border-gray-700">

      {/* Top */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Users className="text-blue-500 dark:text-blue-400" size={20} />
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
            Collaborators
          </h2>
        </div>
        <X
          size={20}
          onClick={() => setShowCollab(false)}
          className="cursor-pointer text-gray-400 dark:text-gray-500 hover:text-red-500"
        />
      </div>

      {/* Current members list */}
      <div className="mb-5 flex flex-col gap-2 max-h-[260px] overflow-y-auto">
        {(trip?.collaborators || []).map((member) => (
          <div key={member.id || member.user?._id} className="flex items-center justify-between rounded-2xl px-4 py-3 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                member.role === "admin"
                  ? "bg-yellow-100 dark:bg-yellow-900/40 text-yellow-600 dark:text-yellow-400"
                  : "bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400"
              }`}>
                {member.user?.name?.[0]}
              </div>
              <div>
                <p className="font-medium text-gray-700 dark:text-gray-200">{member.user?.name}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 capitalize">
                  {member.role === "admin" ? "Admin" : "Member"}
                </p>
              </div>
            </div>
            {isAdmin && member.role !== "admin" && (
              <X
                size={16}
                onClick={() => removeMember(member.user._id)}
                className="text-gray-400 dark:text-gray-500 hover:text-red-500 cursor-pointer"
              />
            )}
          </div>
        ))}
      </div>

      {/* Search Input */}
      {isAdmin && (
      <>
        <input
          type="text"
          placeholder="Search users to add..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-gray-200 dark:border-gray-600 rounded-2xl p-4 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition dark:bg-slate-700 dark:text-gray-200"
        />

        {/* User List */}
        <div className="mt-5 flex flex-col gap-3 max-h-[260px] overflow-y-auto">
          {searchResults
            .filter((user) =>
              !(trip?.collaborators || []).some((m) => m.user._id === user._id)
            )
            .map((user) => (
              <div key={user._id} className="flex items-center justify-between border border-gray-100 dark:border-gray-700 rounded-2xl px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                    {user.name[0]}
                  </div>
                  <div>
                    <p className="font-medium text-gray-700 dark:text-gray-200">{user.name}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">SmartTravel User</p>
                  </div>
                </div>
                <button
                  onClick={() => addMember(user)}
                  className="bg-blue-600 dark:bg-blue-500 text-white px-5 py-2 rounded-xl hover:bg-blue-700 transition"
                >
                  Add
                </button>
              </div>
            ))}
          {search.trim() && searchResults.filter((user) =>
            !(trip?.collaborators || []).some((m) => m.user._id === user._id)
          ).length === 0 && (
            <p className="text-center text-gray-400 dark:text-gray-500 text-sm py-4">No users found</p>
          )}
        </div>
      </>
      )}
      {!isAdmin && (
        <p className="text-center text-gray-400 dark:text-gray-500 text-sm">Only admins can add members.</p>
      )}
    </div>

  </div>
)}

<div className="grid grid-cols-1 lg:grid-cols-4 gap-3 px-4 lg:px-6 -mt-4">
  <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-3">
    {['Morning', 'Afternoon', 'Evening'].map((period) => (
      <div key={`${period}-${activeDay}`} className="space-y-2">
        <h3 className="text-gray-400 dark:text-gray-500 font-bold flex items-center gap-2 text-sm uppercase tracking-widest">
          <span className="text-blue-500 dark:text-blue-400 text-xl">✦</span> {period}
        </h3>
        {trip.itinerary[activeDay]?.[period.toLowerCase()]?.map((item, idx) => (
          <motion.div
            key={item._id || idx}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: idx * 0.08, ease: "easeOut" }}
            className="relative bg-white dark:bg-slate-800 p-5 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-all group hover:cursor-pointer"
          >
            {isEditable && (
              <button
                onClick={() => deleteActivity(item._id || idx, period.toLowerCase(), idx)}
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
                <h4 className="font-bold text-gray-800 dark:text-gray-100 leading-tight">{item.task}</h4>
                <div className="flex items-center gap-1 text-blue-500 dark:text-blue-400 font-bold text-sm mt-1">
                  <Clock size={14} /> {item.time}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
        {isEditable && (
          <button
            onClick={() => addActivity(activeDay, period.toLowerCase())}
            className="w-full py-4 border-2 border-dashed border-slate-200 dark:border-slate-600 rounded-[2rem] text-blue-600 dark:text-blue-400 font-bold flex items-center justify-center gap-2 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors hover:-translate-y-1 cursor-pointer"
          >
            <Plus size={18} /> Add Activity
          </button>
        )}
      </div>
    ))}
  </div>

 <div className="flex flex-col gap-3">

  {/* Map Card */}
  <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 
                  dark:border-gray-700 overflow-hidden shadow-sm">
    
    
    <div className="p-4">
      <h4 className="font-semibold text-gray-800 dark:text-gray-100 text-sm mb-1">
        Day {activeDay} map
      </h4>
      <p className="text-xs text-gray-400 dark:text-gray-500 leading-relaxed mb-3">
        See all activity locations plotted on an interactive map for this day.
      </p>
      <button onClick={handleViewMap}
        className="w-full py-2.5 bg-blue-600 dark:bg-blue-500 hover:bg-blue-500 
                   text-white text-sm font-semibold rounded-xl flex items-center 
                   justify-center gap-2 transition-all hover:-translate-y-0.5 cursor-pointer">
        <MapPin size={15} /> View on map
      </button>
    </div>
  </div>

  {/* Trip Actions Card */}
  <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 
                  dark:border-gray-700 p-4 shadow-sm">
    <div className="flex items-center justify-between mb-3">
      <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 
                    uppercase tracking-wider">
        Trip actions
      </p>
      
    </div>

    <div className="h-px bg-gray-100 dark:bg-gray-700 mb-3" />

    <div className="flex flex-col gap-2">
      {isEditable && (
        <button onClick={saveDraft}
          className="w-full py-2.5 bg-transparent border border-gray-200 
                     dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-slate-700 
                     text-gray-700 dark:text-gray-200 text-sm font-semibold rounded-xl 
                     flex items-center justify-center gap-2 transition-all cursor-pointer">
          Save as draft
        </button>
      )}

      <button onClick={isEditable ? handleFinaliseTrip : undefined}
        disabled={!isEditable}
        className={`w-full py-2.5 text-sm font-semibold rounded-xl flex items-center 
                    justify-center gap-2 transition-all ${
          isEditable
            ? 'bg-blue-600 dark:bg-blue-500 hover:bg-blue-500 text-white hover:-translate-y-0.5 cursor-pointer'
            : 'bg-gray-100 dark:bg-slate-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
        }`}>
        {isEditable ? (
          <><span>Finalise trip</span></>
        ) : (
          <><span>Trip locked</span></>
        )}
      </button>

      
    </div>
  </div>

</div>
</div>

  </div>

  )
}

export default Itinerary