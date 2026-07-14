import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import {LayoutDashboard, Plane, Notebook, LogOut, Compass, Menu, X} from 'lucide-react'
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const Navigate=useNavigate();
const { user, logoutUser } = useContext(AuthContext);

  const sidebarContent = (
    <div className="flex flex-col flex-1 gap-4 mt-10">
      <ul className="flex flex-col gap-4">
        <NavLink to="/dashboard" onClick={() => setMobileOpen(false)} className={({isActive})=>` block px-2 py-2 mx-3 shodow-sm flex gap-2 cursor-pointer ${isActive ? "bg-blue-600 dark:bg-blue-500 border border-gray-100 rounded-md text-white font-semibold " : " rounded-md shadow-md dark:shadow-slate-700 dark:text-gray-300 dark:hover:bg-slate-700"}`}>
          <LayoutDashboard className="text-gray-500 dark:text-gray-400" strokeWidth={2.5} />
          Dashboard
        </NavLink>
        <NavLink to="/mytrips" onClick={() => setMobileOpen(false)} className={({isActive})=>` block px-2 py-2 mx-3 shodow-sm flex gap-2 cursor-pointer ${isActive ? "bg-blue-600 dark:bg-blue-500 border border-gray-100 rounded-md text-white font-semibold " : " rounded-md shadow-md dark:shadow-slate-700 dark:text-gray-300 dark:hover:bg-slate-700"}`}>
          <Plane className="text-gray-500 dark:text-gray-400" strokeWidth={2.5} />
          My Trips
        </NavLink>
        <NavLink to="/planner" onClick={() => setMobileOpen(false)} className={({isActive})=>` block px-2 py-2 mx-3 shodow-sm flex gap-2 cursor-pointer ${isActive ? "bg-blue-600 dark:bg-blue-500 border border-gray-100 rounded-md text-white font-semibold " : " rounded-md shadow-md dark:shadow-slate-700 dark:text-gray-300 dark:hover:bg-slate-700"}`}>
          <Notebook className="text-gray-500 dark:text-gray-400" strokeWidth={2.5} />
          Planner
        </NavLink>
      </ul>
      <div className="mt-auto px-4 pb-4">
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gray-700 dark:bg-slate-700 text-white cursor-pointer hover:opacity-90 transition w-fit" onClick={() => { logoutUser(); Navigate("/"); }}>
          <LogOut size={18} />
          <span className="text-sm font-medium">Logout</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <button
        onClick={() => setMobileOpen(true)}
        className="xl:hidden fixed top-4 left-4 z-50 p-2.5 bg-white dark:bg-slate-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 cursor-pointer"
        aria-label="Open menu"
      >
        <Menu size={22} className="text-gray-600 dark:text-gray-300" />
      </button>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 xl:hidden" onClick={() => setMobileOpen(false)}>
          <div className="absolute inset-0 bg-black/50" />
        </div>
      )}

      <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-slate-100 dark:bg-slate-800 transform transition-transform duration-300 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} xl:translate-x-0 xl:static xl:flex flex-col min-h-screen overflow-y-auto flex-shrink-0`}>
        <div className="flex gap-5 my-2 flex-shrink-0">
          <div className="p-2 ml-2 h-10 bg-blue-500/10 dark:bg-blue-400/20 top-2 rounded-full">
            <Compass className="text-blue-500 dark:text-blue-400" strokeWidth={2.5} />
          </div>
          <span className="text-xl mt-2 font-bold tracking-tight text-gray-600 dark:text-gray-300">
            Smart<span className="text-blue-500 dark:text-blue-400">Travel</span>
          </span>
        </div>
        <button
          onClick={() => setMobileOpen(false)}
          className="xl:hidden absolute top-3 right-3 p-1 cursor-pointer"
          aria-label="Close menu"
        >
          <X size={20} className="text-gray-500 dark:text-gray-400" />
        </button>
        {sidebarContent}
      </div>
    </>
  )
}

export default Sidebar
