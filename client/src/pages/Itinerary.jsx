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

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

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

const saveDraft = async() =>{
  try{
    const token=localStorage.getItem("token");
    await axios.put(`https://smart-travel-hvla.onrender.com/api/trips/single/${id}`, {trip} ,{
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
        `https://smart-travel-hvla.onrender.com/api/trips/${id}/status`,
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
      <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-blue-600 dark:border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600 dark:text-gray-400 font-medium">Assembling your custom travel parameters...</p>
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
   <div className="flex flex-row min-h-screen">
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
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Locating activity spots...</p>
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
                          {marker.time && <p className="text-blue-500 dark:text-blue-400">🕐 {marker.time}</p>}
                           <p className="text-gray-500 dark:text-gray-400">📍 {marker.location}</p>
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


        {/* leftside*/}
        <div className="flex flex-col gap-3 bg-slate-100 dark:bg-slate-800 min-h-screen w-72">
        <div className="flex gap-5 my-2">
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
   <div className="flex flex-col gap-1">
      <h1 className="font-bold text-gray-700 dark:text-gray-100 text-2xl ">{trip.destination}</h1>
      <h3 className="text-gray-400 dark:text-gray-500 text-sm">{new Date(trip.startDate).toLocaleDateString('en-IN',{day:'numeric', month:'short',year:'numeric'})}-{new Date(trip.endDate).toLocaleDateString('en-IN',{day:'numeric', month:'short', year:'numeric'})}</h3>
      <h3 className="text-gray-400 dark:text-gray-500 text-sm">{trip.peopleCount || trip.members || 1} Members</h3>
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

<div className="flex items-center gap-2 mb-6 border border-gray-300 dark:border-gray-600 mt-4 rounded-[2rem] shadow-md px-4 py-2 dark:bg-slate-800">
  
  {/* Scrollable tabs — takes remaining space */}
  <div className="flex items-center gap-1 overflow-x-auto flex-1 min-w-0 scrollbar-hide pb-1">
    {Object.keys(trip.itinerary || {}).sort((a, b) => Number(a) - Number(b)).map((dayKey) => {
      const day = Number(dayKey);
      return (
        <button
          key={day}
          onClick={() => setActiveDay(day)}
          className={`relative cursor-pointer px-5 py-2 flex-shrink-0 transition-all ${
            activeDay === day ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'
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
            <div className="absolute bottom-[-8px] left-0 w-full h-0.5 bg-blue-600 dark:bg-blue-500 rounded-full" />
          )}
        </button>
      );
    })}
  </div>

  {/* Action buttons — never shrink, always visible */}
  <div className="flex items-center gap-2 flex-shrink-0 border-l border-gray-200 dark:border-gray-700 pl-3">
    {isEditable && (
      <button
        onClick={add_trip}
        className="flex items-center border border-gray-300 dark:border-gray-600 cursor-pointer px-3 py-2 rounded-[2rem] gap-1 text-blue-600 dark:text-blue-400 font-bold hover:-translate-y-1 shadow-md transition duration-200 whitespace-nowrap"
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
       Collaborators
    </div>
  </div>

</div>


<div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mx-4">
          {/* Timeline Columns (Morning, Afternoon, Evening) */}
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
            {['Morning', 'Afternoon', 'Evening'].map((period) => (
              <div key={period} className="space-y-4">
                <h3 className="text-gray-400 dark:text-gray-500 font-bold flex items-center gap-2 text-sm uppercase tracking-widest">
                  <span className="text-blue-500 dark:text-blue-400 text-xl">✦</span> {period}
                </h3>
                {trip.itinerary[activeDay]?.[period.toLowerCase()]?.map((item, idx) => (
                  <div key={idx} className=" relative bg-white dark:bg-slate-800 p-5 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-all group hover:cursor-pointer">
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
                  </div>
                ))}
{isEditable && (
                <button onClick={() => addActivity(activeDay, period.toLowerCase())}
                 className="w-full py-4 border-2 border-dashed border-slate-200 dark:border-slate-600 rounded-[2rem] text-blue-600 dark:text-blue-400 font-bold flex items-center justify-center
                 gap-2 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors hover:-translate-y-1 cursor-pointer ">
                  <Plus size={18} /> Add Activity
                </button>
)}
              </div>
            ))}
          </div>



<div className="flex flex-col justify-between mx-4 space-y-4">
            <div className="bg-white dark:bg-slate-800 w-full p-6 rounded-[2rem] mr-3 shadow-md shadow-gray-400 dark:shadow-slate-700 ">
              <div className="flex flex-row gap-2 ">
              <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-4">
                <Compass size={20} />
              </div>
              <h4 className="font-bold mt-1  text-gray-900 dark:text-gray-100 mb-2">Day {activeDay} Map</h4>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-4">
                View all your Day {activeDay} activity locations on an interactive map.
              </p>
              <button onClick={handleViewMap}
               className="w-full py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-xl font-bold shadow-lg shadow-blue-200 dark:shadow-blue-900/30 hover:cursor-pointer">
                View on Map
              </button>
            </div>
            <div className="flex flex-row w-full mr-3 justify-between">
              {isEditable && (
                
              <button 
              onClick={saveDraft}
               className="border border-blue-600 dark:border-blue-500 text-gray-700 dark:text-gray-200 font-semibold text-sm px-3 border-2 py-3 rounded-[2rem] bg-white dark:bg-slate-800 shadow-md shadow-gray-400 dark:shadow-slate-700 hover:-translate-y-1 transition duration-300 cursor-pointer">
                Save as Draft
              </button>
              )}
              
              <button disabled={!isEditable}
              onClick={handleFinaliseTrip}
              className={`font-semibold text-sm px-3 py-3 border-2 rounded-[2rem] shadow-md transition duration-300 ${
                isEditable ? "bg-blue-600 dark:bg-blue-500 text-white hover:-translate-y-2 cursor-pointer" : "bg-gray-200 dark:bg-slate-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
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