import React from 'react'
import { NavLink } from 'react-router-dom'
import {LayoutDashboard} from 'lucide-react'
import { Plane } from 'lucide-react';
import { Notebook } from 'lucide-react';
import { LogOut } from 'lucide-react';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';


const Sidebar = () => {
  const Navigate=useNavigate();
const { user, logoutUser } = useContext(AuthContext);

  return (
    
    <div className="flex flex-col flex-1 gap-4 mt-10">
        <ul className="flex flex-col gap-4">
             <NavLink to="/dashboard" className={ ({isActive})=>` block px-2  py-2 mx-3 shodow-sm flex gap-2 cursor-pointer ${isActive ? 
          "bg-blue-600 dark:bg-blue-500 border border-gray-100 rounded-md text-white font-semibold " : " rounded-md shadow-md dark:shadow-slate-700 dark:text-gray-300 dark:hover:bg-slate-700"}`}  >
            <LayoutDashboard className="text-gray-500 dark:text-gray-400" strokeWidth={2.5} />
            Dashboard </NavLink>

            <NavLink to="/mytrips" className={ ({isActive})=>` block px-2 py-2 mx-3 shodow-sm flex gap-2 cursor-pointer ${isActive ? 
          "bg-blue-600 dark:bg-blue-500 border border-gray-100 rounded-md text-white font-semibold " : " rounded-md shadow-md dark:shadow-slate-700 dark:text-gray-300 dark:hover:bg-slate-700"}`}  >
            <Plane className="text-gray-500 dark:text-gray-400" strokeWidth={2.5} />
            My Trips </NavLink>

           
            <NavLink to="/planner" className={ ({isActive})=>` block px-2 py-2 mx-3 shodow-sm flex gap-2 cursor-pointer ${isActive ? 
          "bg-blue-600 dark:bg-blue-500 border border-gray-100 rounded-md text-white font-semibold " : " rounded-md shadow-md dark:shadow-slate-700 dark:text-gray-300 dark:hover:bg-slate-700"}`}  >
            <Notebook className="text-gray-500 dark:text-gray-400" strokeWidth={2.5} />
            Planner </NavLink>

          
        </ul>

<div className="mt-auto px-4 pb-4">
  <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gray-700 dark:bg-slate-700 text-white cursor-pointer hover:opacity-90 transition w-fit" onClick={() => { logoutUser(); Navigate("/"); }}>
    <LogOut size={18} />
    <span className="text-sm font-medium">Logout</span>
  </div>
</div>

    </div>
  )
}

export default Sidebar