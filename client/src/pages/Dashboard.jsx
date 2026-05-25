import React from 'react'
import {Compass} from 'lucide-react'
import Sidebar from '../components/Sidebar'
import UpcomingCard from '../components/UpcomingCard'
import { Search } from 'lucide-react';
import { Plus } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import { useContext } from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { getDestinationImage } from '../utils/getDestinationImage';
import axios from "axios"


const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [allTrips, setAllTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [tripImages, setTripImages] = useState({});


  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, 
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 2.6, ease: "easeOut" },
    },
  };

   useEffect(() => {
    const fetchTrips = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/trips/alltrips", {
          headers: { token }
        });
        if (response.data?.success) {
          setAllTrips(response.data.trips || []);
        }
      } catch (err) {
        console.error("Failed to fetch trips:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrips();
  }, []);

  const upcomingTrips = allTrips.filter(t => 
  t.status !== "draft" && t.status !== "completed"
);

const filteredUpcoming = upcomingTrips
  .filter(t => t.destination?.toLowerCase().includes(searchQuery.toLowerCase()))
  .slice(0, 3);

 
  const formatDate = (start, end) => {
    if (!start) return "Flexible Dates";
    const sOpt = { day: 'numeric', month: 'short' };
    const eOpt = { day: 'numeric', month: 'short', year: 'numeric' };
    return `${new Date(start).toLocaleDateString('en-IN', sOpt)} - ${new Date(end).toLocaleDateString('en-IN', eOpt)}`;
  };

  const calcDays = (start, end) => {
    if (!start || !end) return 1;
    return Math.ceil((new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24)) + 1;
  };

useEffect(() => {
  const fetchImages = async () => {
    const imageMap = {};
    await Promise.all(
      allTrips.map(async (trip) => {
        const url = await getDestinationImage(trip.destination);
        imageMap[trip._id] = url;
      })
    );
    setTripImages(imageMap);
  };

  if (allTrips.length > 0) fetchImages();
}, [allTrips]);
  return (
    <div className="flex flex-row min-h-screen ">
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
 <div className="flex justify-between w-full bg-gradient-to-br from-slate-50 to-blue-50">
  <motion.h1 
    initial="hidden" 
    animate="visible" 
    variants={containerVariants} 
    className="text-3xl font-bold text-gray-700 mt-7 mx-6"
  >
    Welcome, {user?.name}
    <motion.h3 
      initial="hidden" 
      animate="visible" 
      variants={itemVariants} 
      className="text-xl font-semibold text-gray-400"
    >
      Ready for your next adventure?
    </motion.h3>
  </motion.h1>
  
  <div className="flex mt-12 mr-4 px-1 gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
        {user?.name[0]}
          </div>
          <p className="text-gray-700 font-medium">{user?.name}</p>
        </div>
  
 </div>

 <div className="flex flex-row  rounded-lg bg-slate-50 justify-between mt-5 mx-17 px-5 py-2 pt-3 ">
  <div className="flex flex-rows gap-1 border border-gray-300 items-center rounded-lg px-3 py-1 hover:shadow-md hover:border-blue-700 transition duration-300">
    <Search 
     className="text-gray-500 " strokeWidth={3.5} />
<input value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
type="text" placeholder="Search for trips.." className="px-4 py-2 w-160 rounded-md outline-none"  />
  </div>

  <div onClick={()=>navigate('/planner')}
  className=" flex flex-row gap-2 px-2 py-2 bg-blue-600 h-10 text-white rounded-md shadow-md hover:bg-blue-500 cursor-pointer">
    <Plus className="text-white" strokeWidth={2.5} />
    Plan New Trip
  </div>

 </div>
 <div className="flex flex-col gap-6 mt-6 px-8">
  <div className="flex flex-row justify-between items-center">
   <h1 className="text-3xl font-semibold text-gray-600">Upcoming Trips</h1>
    {upcomingTrips.length > 3 && (
      <span className="bg-blue-100 text-blue-600 text-xs font-bold px-2 py-1 rounded-full">
        +{upcomingTrips.length - 3} more
      </span>
    )}
  </div>
  <NavLink
    to="/mytrips"
    className="group flex items-center gap-1 text-blue-600 font-semibold text-sm hover:text-blue-700 transition-colors"
  >
    <span>View all</span>
    <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" strokeWidth={3} />
  </NavLink>
</div>
   {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredUpcoming.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="text-gray-400 text-lg font-medium">
                {searchQuery ? `No upcoming trips matching "${searchQuery}"` : "No upcoming trips yet"}
              </p>
             
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
              {filteredUpcoming.map(trip => (
                <UpcomingCard
                  key={trip._id}
                  image={tripImages[trip._id]} 
                  title={trip.destination}
                  date={formatDate(trip.startDate, trip.endDate)}
                  days={calcDays(trip.startDate, trip.endDate)}
                  id={trip._id}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    
  );
}
export default Dashboard