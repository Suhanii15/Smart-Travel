
import React from 'react';
import { Calendar, Users, MapPin, MoreVertical, Heart, CheckCircle2 } from 'lucide-react';

export const TripCard = ({ image, title, location, date, travelers, price, days }) => (
  <div className="bg-white rounded-[2rem] p-3 shadow-sm border border-slate-100 hover:shadow-md transition-all group">
    <div className="relative overflow-hidden rounded-[1.5rem] aspect-video">
      <img src={image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={title} />
      <div className="absolute top-3 left-3 bg-black/20 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-lg">{days} Days</div>
      <button className="absolute top-3 right-3 p-1.5 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-red-500 transition-colors">
        <Heart size={14} />
      </button>
    </div>
    <div className="p-4">
      <div className="flex justify-between items-start mb-1">
        <h3 className="font-bold text-slate-800">{title}</h3>
        <MoreVertical size={16} className="text-slate-400 cursor-pointer" />
      </div>
      <div className="space-y-2">
        <div className="flex items-center gap-1 text-slate-400 text-[11px]"><MapPin size={12}/> {location}</div>
        <div className="flex items-center gap-1 text-slate-400 text-[11px]"><Calendar size={12}/> {date}</div>
        <div className="flex justify-between items-center pt-2">
          <div className="flex items-center gap-1 text-slate-500 text-[11px]"><Users size={12}/> {travelers} Travelers</div>
          <span className="text-emerald-600 font-bold text-sm">₹{price}</span>
        </div>
      </div>
    </div>
  </div>
);

// 2. Draft Trip Card (With Progress Ring)
export const DraftCard = ({ image, title, date, progress }) => (
  <div className="bg-white rounded-3xl p-3 shadow-sm border border-slate-100 flex flex-col gap-3 group">
    <div className="relative h-32 overflow-hidden rounded-2xl">
      <img src={image} className="w-full h-full object-cover" alt={title} />
      <div className="absolute top-2 left-2 bg-orange-100 text-orange-600 text-[10px] font-bold px-2 py-0.5 rounded-md">Draft</div>
    </div>
    <div className="px-2 pb-2">
      <div className="flex justify-between items-center mb-1">
        <h4 className="font-bold text-slate-800 text-sm truncate">{title}</h4>
        {/* Simple Progress Circle */}
        <div className="relative w-8 h-8 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90">
            <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="3" fill="transparent" className="text-slate-100" />
            <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="3" fill="transparent" strokeDasharray={88} strokeDashoffset={88 - (88 * progress) / 100} className="text-orange-500" />
          </svg>
          <span className="absolute text-[8px] font-bold">{progress}%</span>
        </div>
      </div>
      <p className="text-slate-400 text-[10px] mb-3">Last edited {date}</p>
      <button className="w-full py-2 text-xs font-bold text-orange-600 bg-orange-50 rounded-xl hover:bg-orange-100 transition-colors">Continue →</button>
    </div>
  </div>
);

// 3. Completed Trip Card (Horizontal/Compact)
export const CompletedCard = ({ image, title, date, travelers }) => (
  <div className="flex items-center gap-4 bg-white p-3 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
    <img src={image} className="w-20 h-16 rounded-xl object-cover" alt={title} />
    <div className="flex-1">
      <h4 className="font-bold text-slate-800 text-sm">{title}</h4>
      <p className="text-slate-400 text-[10px]">{date} • {travelers} Travelers</p>
    </div>
    <div className="flex items-center gap-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold px-3 py-1 rounded-full border border-emerald-100">
      <CheckCircle2 size={12} /> Completed
    </div>
  </div>
);