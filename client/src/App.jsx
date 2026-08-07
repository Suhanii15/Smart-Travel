import React, { useEffect, useState } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { Moon, Sun } from 'lucide-react';
import Landingpage from './pages/Landingpage'
import LoginPage from './pages/LoginPage'
import Dashboard from './pages/Dashboard'
import MyTrips from './pages/MyTrips'
import Planner from './pages/Planner'
import Collaborations from './pages/Collaborations'
import BudgetTracker from './pages/BudgetTracker'
import Itinerary from './pages/Itinerary'
import GoogleAuthSuccess from './pages/GoogleAuthSuccess'

const App = () => {
  const location = useLocation();
  const [dark, setDark] = useState(() => localStorage.getItem("theme") === "dark");

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  const isLanding = location.pathname === '/';

  return (
    <div className="bg-slate-50 dark:bg-slate-900 min-h-screen overflow-x-hidden">
      <button
        onClick={() => setDark(!dark)}
        className={`fixed z-50 p-3 rounded-full bg-white/90 dark:bg-slate-800/90 shadow-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:shadow-xl transition-all cursor-pointer ${isLanding ? 'top-6 right-6' : 'bottom-6 right-6'}`}
        aria-label="Toggle dark mode"
      >
        {dark ? <Sun size={20} /> : <Moon size={20} />}
      </button>
      <Routes>
    <Route path='/' element= {<Landingpage /> }/>
    <Route path='/login' element={<LoginPage />} />
    <Route path='/dashboard' element={<Dashboard />} />
    <Route path='/mytrips' element={<MyTrips />} /> 
    <Route path='/planner' element={<Planner />} />
    <Route path='/collaborations/:id' element={<Collaborations />} />
    <Route path='/budgettracker/:id' element={<BudgetTracker />} />
    <Route path='/itinerary/:id' element={<Itinerary />} />
    <Route path="/auth/google/success" element={<GoogleAuthSuccess />} />
    

</Routes>
 </div>
  )
}

export default App


