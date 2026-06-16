
import React from 'react';
import { Calendar, Users, MapPin, MoreVertical, Heart, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';



export const TripCard = ({id, image, title, location, date, travelers, price, days }) => {
  const navigate = useNavigate();
  return(
  <div onClick={() => navigate(`/itinerary/${id}`)}
   className="bg-white dark:bg-slate-800 rounded-[2rem] p-3 shadow-sm border border-slate-100 dark:border-slate-700 hover:-translate-y-1 shadow-md transition-all duration-300 group overflow-hidden cursor-pointer">
     <div className="relative overflow-hidden rounded-[1.5rem] aspect-video">
<img
  src={image}
  alt={title}
  className="w-full h-48 object-cover rounded-t-2xl"
  onError={(e) => {
    e.target.src = "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80";
  }}
/>      <div className="absolute top-3 left-3 bg-black/20 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-lg">{days} Days</div>
      
    </div>
    <div className="p-4">
      <div className="flex justify-between items-start mb-1">
        <h3 className="font-bold text-slate-800 dark:text-gray-100">{title}</h3>
         <MoreVertical size={16} className="text-slate-400 dark:text-gray-500 cursor-pointer" />
      </div>
      <div className="space-y-2">
        <div className="flex items-center gap-1 text-slate-400 dark:text-gray-400 text-[11px]"><MapPin size={12}/> {location}</div>
        <div className="flex items-center gap-1 text-slate-400 dark:text-gray-400 text-[11px]"><Calendar size={12}/> {date}</div>
        <div className="flex justify-between items-center pt-2">
          <div className="flex items-center gap-1 text-slate-500 dark:text-gray-300 text-[11px]"><Users size={12}/> {travelers} Travelers</div>
          <span className="text-emerald-600 dark:text-emerald-400 font-bold text-sm">₹{price}</span>
        </div>
      </div>
    </div>
  </div>
);
}

 export const DraftCard = ({ id, image, title, date,days }) => {
  const navigate=useNavigate();
  return(
  <div onClick={() => navigate(`/itinerary/${id}`)}
   className="bg-white dark:bg-slate-800 rounded-3xl p-3 shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col gap-3 hover:-translate-y-1 shadow-md transition-all duration-300 group overflow-hidden cursor-pointer">
    <div className="relative  rounded-[1.5rem] overflow-hidden aspect-video">
<img
  src={image}
  alt={title}
  className="w-full h-48 object-cover rounded-t-2xl"
  onError={(e) => {
    e.target.src = "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80";
  }}
/>      <div className="absolute top-2 left-2 bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400 text-[10px] font-bold px-2 py-0.5 rounded-md">Draft</div>
    </div>
    <div className="px-2 pb-2">
      <div className="flex justify-between items-center mb-1">
        <h4 className="font-bold text-slate-800 dark:text-gray-100 text-lg truncate">{title}</h4>
        {/* Simple Progress Circle */}
        <div className="relative w-8 h-8 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90">
            <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="3" fill="transparent" className="text-slate-100 dark:text-gray-700" />
          </svg>
        
        </div>
      </div>
      <p className="text-slate-400 dark:text-gray-400 text-[10px] mb-3">Last edited {date}</p>
      <button className="w-full py-2 text-md font-bold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 rounded-xl hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors cursor-pointer">Continue →</button>
    </div>
  </div>
);
 }
export const CompletedCard = ({id, image, title, date, travelers ,days}) => {
  const navigate=useNavigate();

  return(
  <div onClick={() => navigate(`/itinerary/${id}`)}
   className="bg-white dark:bg-slate-800 rounded-[2rem] p-3 shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-xl hover:-translate-y-1 transition-all shadow-md cursor-pointer duration-300 group overflow-hidden">
    
   
    <div className="relative overflow-hidden rounded-[1.5rem] aspect-video">
     <img
  src={image}
  alt={title}
  className="w-full h-48 object-cover rounded-t-2xl"
  onError={(e) => {
    e.target.src = "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80";
  }}
/>

    
      <div className="absolute top-3 left-3 flex items-center gap-1 bg-emerald-500/90 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full">
        <CheckCircle2 size={12} />
        Completed
      </div>
    </div>

    <div className="p-4 flex flex-col gap-3">

     
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-bold text-slate-800 dark:text-gray-100 text-lg">{title}</h3>
          <p className="text-slate-400 dark:text-gray-400 text-xs">{date}</p>
        </div>

        <button className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
          <MoreVertical size={16} className="text-slate-400 dark:text-gray-500" />
        </button>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-gray-700">

        <div className="flex items-center gap-2 text-slate-500 dark:text-gray-300 text-sm">
          <Users size={14} />
          <span>{travelers} Travelers</span>
        </div>

        <button className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
          View Trip →
        </button>

      </div>
    </div>
  </div>
)
}