import React from 'react'
import {Compass} from 'lucide-react'
import Sidebar from '../components/Sidebar'
import UpcomingCard from '../components/UpcomingCard'
import { Search } from 'lucide-react';
import { Plus } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';



const Dashboard = () => {
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

  const placeholderImg = "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80";
  return (
    <div className="flex flex-row min-h-screen ">
        {/* leftside*/}
        <div className="flex flex-col gap-3 bg-slate-100 min-h-screen w-72">
        <div className="flex gap-2 my-2 gap-5">
                    <div className="p-2 h-10 bg-blue-500/10 top-2 rounded-full">
                     <Compass className="text-blue-500" strokeWidth={2.5} />
                     </div>
                     <span className="text-xl font-bold tracking-tight text-gray-600">
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
    Welcome, Name!
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
        N
          </div>
          <p className="text-gray-700 font-medium">Name</p>
        </div>
  
 </div>

 <div className="flex flex-row  rounded-lg bg-slate-50 justify-between mt-5 mx-17 px-5 py-2 pt-3 ">
  <div className="flex flex-rows gap-1 border border-gray-300 items-center rounded-lg px-3 py-1 hover:shadow-md hover:border-blue-700 transition duration-300">
    <Search className="text-gray-500 " strokeWidth={3.5} />
<input type="text" placeholder="Search for trips.." className="px-4 py-2 w-160 rounded-md outline-none"  />
  </div>

  <div className=" flex flex-row gap-2 px-2 py-2 bg-blue-600 h-10 text-white rounded-md shadow-md hover:bg-blue-500 cursor-pointer">
    <Plus className="text-white" strokeWidth={2.5} />
    Plan New Trip
  </div>

 </div>
 <div className="flex flex-col gap-6 mt-6 px-8">
  <div className="flex flex-row justify-between items-center">
  <h1 className="text-3xl  font-semibold text-gray-600">Upcoming Trips</h1>
  <NavLink 
  to="/mytrips" 
  className="group flex items-center gap-1 text-blue-600 font-semibold text-sm hover:text-blue-700 transition-colors"
>
  <span>View all</span>

  <ChevronRight 
    className="w-4 h-4 transition-transform group-hover:translate-x-1" 
    strokeWidth={3} 
  />
</NavLink>
  </div>
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">

  <UpcomingCard  image={placeholderImg} date="10 may - 15 may , 2026" days="5" title="Manali" />
   <UpcomingCard  image={placeholderImg} date="01 june - 15 june , 2026" days="15" title="Udaipur" />
    <UpcomingCard  image={placeholderImg} date="11 may - 21 may , 2026" days="10" title="Foa" />
        <UpcomingCard  image={placeholderImg} date="11 may - 21 may , 2026" days="10" title="Foa" />

  </div>
    </div>

    </div>
    </div>
  )
}

export default Dashboard