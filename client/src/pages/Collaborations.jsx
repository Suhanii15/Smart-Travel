import React from 'react'
import { Plus, Share2, MoreHorizontal, Users, Compass,MapPin, Clock } from 'lucide-react';
import Sidebar from '../components/Sidebar'
import {useState }from 'react';
import { ChevronsLeft } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { X } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { useContext } from 'react';


const Collaborations = () => {
    
    const navigate=useNavigate();
    
    const goback = () =>{
      navigate('/itinerary');
    }
    
      const DUMMY_TRIP = {
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
    const [activeDay, setActiveDay] = useState(1);
    const [trip,setTrip]=useState(DUMMY_TRIP);
    
    const add_trip = () =>{
      const newday=trip.totalDays+1;
      setTrip((prevTrip) =>({
        ...prevTrip,
    
        totalDays : newday,
    
        itinerary :{
          ...prevTrip.itinerary,
          [newday] : {
            morning : [],
            afternoon: [],
            evening : []
          }
        }
      }));
      setActiveDay(newday);
    };
    
    const addActivity = (day,period) =>{
      const newTask=window.prompt("What do you wanna do?");
      const newTime=window.prompt("And at what time?");
    
      if(!newTime || !newTask) return;
    
      const newActivity={
        time:newTime,
        task:newTask,
        location:"new location!"
    
      };
    
      setTrip((prevTrip) => ({
        ...prevTrip,
    
        itinerary: {
          ...prevTrip.itinerary,
    
          [day]: {
            ...prevTrip.itinerary[day],
    
            [period]: [
              ...prevTrip.itinerary[day][period],
              newActivity
            ]
          }
        }
      }));
    
    };
    
    const deleteActivity = (period,index) =>{
      setTrip((prev)=>(
        {
          ...prev,
    
        itinerary: {
          ...prev.itinerary,
    
          [activeDay]: {
            ...prev.itinerary[activeDay],
    
            [period]: prev.itinerary[activeDay][period].filter(
              (_, i) => i !== index
            )
          }
    
        }
      }
      ))
    }
    
    const deleteday =(daytodelete)=>{
      if(trip.totalDays <= 1) return;
    
      const newitinerary = {...trip.itinerary}
      delete newitinerary[daytodelete];
    
      setTrip(prev => ({
        ...prev,
        totalDays: prev.totalDays - 1,
        itinerary: newitinerary
      }));
    
      
      if (activeDay === daytodelete) setActiveDay(1);
    };
    
    const [isEditable, setIsEditable] = useState(true);
    const [members, setMembers] = useState([
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
const [showSearch, setShowSearch] = useState(false);
const [search, setSearch] = useState("");
const USERS = [
  { id: 5, name: "Rohan" },
  { id: 6, name: "Manoj" },
  { id: 7, name: "Pooja" },
  { id: 8, name: "Harsh" },
];

const addMember = (user) => {
  setMembers((prev) => [
    ...prev,
    {
      ...user,
      role: "Member",
      isOwner: false,
    },
  ]);
};

const {user,logoutuser}=useContext(AuthContext);
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

<div className="flex  items-center gap-2 mb-10 border border-gray-300 mt-2 rounded-[2rem] shadow-md shadow-[2rem] pb-3">
  {Array.from({length: trip.totalDays}, (_,i) => i+1).map((day)=>(
    <button 
    key={day} onClick={()=>setActiveDay(day)} className={`relative cursor-pointer px-8 py-3 transition-all ${
      activeDay === day ? 'text-blue-600 ' : 'text-gray-400'
    }`} >
    <span className="text-xs uppercase block text-center">Day</span>
    <span className="text-2xl font-bold block leading-none">{day}</span> 
    {isEditable && (
    <button onClick={(e) =>{
      e.stopPropagation();
      deleteday(day);
    }}
    className="p-2 absolute -top-1 -right-1 hover:cursor-pointer">
      <X  className="h-5 w-3 "/>
    </button>
    )}

  {activeDay === day && (
                <div className="absolute bottom-[-17px] left-0 w-full h-1 bg-blue-600 rounded-full" />
              )}
            </button>
          ))}
          {isEditable && (
<button onClick={add_trip}
className="flex items-center border border-gray-300 cursor-pointer p-2 rounded-[2rem] gap-2 text-blue-600 font-bold ml-4 hover:-translate-y-1 shadow-md transition duration-200">
            <Plus size={20} /> Add Day
          </button>
          )}
          <div onClick={()=>navigate('/budgettracker')}
           className="bg-green-300 flex items-center p-2 cursor-pointer rounded-[2rem] cursor-pointer text-white font-semibold  hover:-translate-y-1 shadow-md transition duration-200">
                Track Budget
          </div>
            <div onClick={()=>navigate('/collaborations')}
           className="bg-yellow-200 flex items-center p-2 cursor-pointer rounded-[2rem] cursor-pointer text-white font-semibold  hover:-translate-y-1 shadow-md transition duration-200">
                Add Collaborators
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
             {members.map((member)=>(
                <div key={member.id} className="flex items-center justify-between  rounded-2xl px-4 py-3">
                    <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
          {member.name[0]}
        </div>

        <div>
          <p className="font-medium text-gray-800">
            {member.name}
          </p>

          <p className="text-xs text-gray-400">
            {member.role}
          </p>
        </div>
      </div>

      {member.role !== "Admin" && (
        <X
          size={16}
          onClick={() => removeMember(member.id)}
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

        {USERS.filter((user) =>
          user.name.toLowerCase().includes(search.toLowerCase())
        )
          .filter(
            (user) =>
              !members.some(
                (member) => member.id === user.id
              )
          )
          .map((user) => (

            <div
              key={user.id}
              className="flex items-center justify-between border border-gray-100 rounded-2xl px-4 py-3"
            >

              <div className="flex items-center gap-3">

                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                  {user.name[0]}
                </div>

                <div>
                  <p className="font-medium text-gray-700">
                    {user.name}
                  </p>

                  <p className="text-xs text-gray-400">
                    SmartTravel User
                  </p>
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
              <button onClick={()=>navigate('/mytrips')}
               className="border border-blue-600 text-gray-700 font-semibold text-sm px-3 border-2 py-3 rounded-[2rem] bg-white shadow-md shadow-gray-400 hover:-translate-y-1 transition duration-300 cursor-pointer">
                Save as Draft
              </button>
              )}
              
              <button disabled={!isEditable}
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