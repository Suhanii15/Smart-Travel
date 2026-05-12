import React from 'react'
import {Compass, Droplet} from 'lucide-react'
import Sidebar from '../components/Sidebar'
import { Search } from 'lucide-react';
import { Funnel } from 'lucide-react';
import { SlidersHorizontal } from 'lucide-react';

import {useState } from 'react';



const MyTrips = () => {
  const [activeTab, setActiveTab]=useState("upcoming");
  const trips ={
    upcoming: [
      { id: 1, title: "Manali Getaway", days: 5, price: "25,000", date: "10 May - 15 May", image: "..." },
      { id: 2, title: "Udaipur Escape", days: 15, price: "40,000", date: "01 Jun - 15 Jun", image: "..." },
    ],
    drafts: [
      { id: 101, title: "Kasol Trip", progress: 40, date: "2 days ago", image: "..." },
    ],
    completed: [
      { id: 201, title: "Leh Ladakh", date: "12 Apr - 18 Apr", travelers: 2, image: "..." },
    ]
    
  }
  return (
     <div className="flex flex-row min-h-screen">
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
  <div className="flex-1 bg-gradient-to-br from-slate-50 to-blue-50">
  <div className="flex justify-between w-full p-6"> 
    <div className="flex flex-col gap-3">
      <h1 className="font-bold text-gray-700 text-2xl">My Trips</h1>
      <h4 className="text-gray-400 ">All your trips in one place!</h4>
    </div>
    <div className="flex flex-row gap-2 px-2 py-1 items-center">
      {/* Search Bar */}
      <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-2 py-1">
       <Search className="text-gray-500 " strokeWidth={3.5} />
      <input type="text" placeholder="Search Trips..." className="px-4 py-2 rounded-lg focus:outline-none " />
     </div>
{/* filter section */}
     <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-2 py-1">
     
      
     </div>

    </div>
  </div>
</div>

  </div>


    </div>
  )
}

export default MyTrips