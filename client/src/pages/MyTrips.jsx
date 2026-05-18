import React from 'react'
import {Compass, Droplet} from 'lucide-react'
import Sidebar from '../components/Sidebar'
import { Search } from 'lucide-react';
import { Funnel } from 'lucide-react';
import { SlidersHorizontal } from 'lucide-react';
import { TripCard, DraftCard, CompletedCard } from "../components/CardComponent";
import {useState } from 'react';




const MyTrips = () => {
  const [activeTab, setActiveTab]=useState("upcoming");
  const trips ={
    UpcomingTrip: [
      { id: 1, title: "Manali Getaway", days: 5, price: "25,000", date: "10 May - 15 May", image: "..." },
      { id: 2, title: "Udaipur Escape", days: 15, price: "40,000", date: "01 Jun - 15 Jun", image: "..." },
    ],
    Drafts: [
      { id: 101, title: "Kasol Trip", progress: 40, date: "2 days ago", image: "..." },
    ],
    Completed: [
      { id: 201, title: "Leh Ladakh", date: "12 Apr - 18 Apr", travelers: 2, image: "..." },
    ]
    
  }
  const placeholderImg = "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80";

  return (
     <div className="flex flex-row min-h-screen">
        {/* leftside*/}
        <div className="flex flex-col gap-3 bg-slate-100 min-h-screen w-72">
        <div className="flex gap-2 my-2 gap-5">
                    <div className="p-2 ml-2 h-10 bg-blue-500/10 top-2 rounded-full">
                     <Compass className="text-blue-500" strokeWidth={2.5} />
                     </div>
                     <span className="text-xl font-bold mt-2 tracking-tight text-gray-600">
              Smart<span className="text-blue-500">Travel</span>
            </span>
        </div>
<Sidebar />
</div>
{/* rightside*/}
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
     <div className="flex items-center lg:w-fit gap-2 border border-gray-300 rounded-lg px-2 py-1">
    {['UpcomingTrip','Drafts','Completed'].map((tab)=>(
      <button key={tab} onClick={()=>setActiveTab(tab)} className={`px-10 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${activeTab == tab ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:bg-gray-100 cursor-pointer'}`}>
        {tab}
        </button>
    ))}
     </div>

    </div>

  </div>

  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
    {
      activeTab == 'UpcomingTrip' && trips.UpcomingTrip.map(trip => (
        <TripCard key={trip.id} image={placeholderImg} title={trip.title} location={trip.location} date={trip.date} travelers={trip.travelers} price={trip.price} days={trip.days} />
      ))
    }

    {activeTab == 'Drafts' && trips.Drafts.map(trip =>(
      <DraftCard key={trip.id} image={placeholderImg} title={trip.title} date={trip.date} progress={trip.progress} />
    ))}

    {
      activeTab == 'Completed' && trips.Completed.map(trip=>(
        <CompletedCard key={trip.id} image={placeholderImg} title={trip.title} date={trip.date} travelers={trip.travelers} />
      )
      )

    }

  </div>
</div>
</div>
  )
}

export default MyTrips