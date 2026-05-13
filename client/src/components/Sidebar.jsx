import React from 'react'
import { NavLink } from 'react-router-dom'
import {LayoutDashboard} from 'lucide-react'
import { Plane } from 'lucide-react';
import { Telescope } from 'lucide-react';
import { Notebook } from 'lucide-react';
import { CopyMinus } from 'lucide-react';
import { HandCoins } from 'lucide-react';
import { LogOut } from 'lucide-react';

const Sidebar = () => {
  return (
    <div className="flex flex-col gap-4 mt-10">
        <ul className="flex flex-col gap-4">
             <NavLink to="/dashboard" className={ ({isActive})=>` block px-2  py-2 mx-3 shodow-sm flex gap-2 cursor-pointer ${isActive ? 
          "bg-blue-600 border border-gray-100 rounded-md text-white font-semibold " : " rounded-md shadow-md"}`}  >
            <LayoutDashboard className="text-gray-500" strokeWidth={2.5} />
            Dashboard </NavLink>

            <NavLink to="/mytrips" className={ ({isActive})=>` block px-2 py-2 mx-3 shodow-sm flex gap-2 cursor-pointer ${isActive ? 
          "bg-blue-600 border border-gray-100 rounded-md text-white font-semibold " : " rounded-md shadow-md"}`}  >
            <Plane className="text-gray-500" strokeWidth={2.5} />
            My Trips </NavLink>

           
            <NavLink to="/planner" className={ ({isActive})=>` block px-2 py-2 mx-3 shodow-sm flex gap-2 cursor-pointer ${isActive ? 
          "bg-blue-600 border border-gray-100 rounded-md text-white font-semibold " : " rounded-md shadow-md"}`}  >
            <Notebook className="text-gray-500" strokeWidth={2.5} />
            Planner </NavLink>

            <NavLink to="/collaborations" className={ ({isActive})=>` block px-2 py-2 mx-3 shodow-sm flex gap-2 cursor-pointer ${isActive ? 
          "bg-blue-600 border border-gray-100 rounded-md text-white font-semibold " : " rounded-md shadow-md"}`}  >
            <CopyMinus className="text-gray-500" strokeWidth={2.5} />
            Collaborations </NavLink>

            <NavLink to="/budgettracker" className={ ({isActive})=>` block px-2 py-2 mx-3 shodow-sm flex gap-2 cursor-pointer ${isActive ? 
          "bg-blue-600 border border-gray-100 rounded-md text-white font-semibold " : " rounded-md shadow-md"}`}  >
            <HandCoins className="text-gray-500" strokeWidth={2.5} />
            Budget Tracker </NavLink>

        </ul>



    </div>
  )
}

export default Sidebar