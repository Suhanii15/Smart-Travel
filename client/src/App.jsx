import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Landingpage from './pages/Landingpage'
import LoginPage from './pages/LoginPage'
import Dashboard from './pages/Dashboard'
import MyTrips from './pages/MyTrips'
import Planner from './pages/Planner'
import Collaborations from './pages/Collaborations'
import BudgetTracker from './pages/BudgetTracker'
import Itinerary from './pages/Itinerary'

const App = () => {
  return (
    <div className="bg-slate-50 min-h-screen overflow-x-hidden">
      <Routes>
    <Route path='/' element= {<Landingpage /> }/>
    <Route path='/login' element={<LoginPage />} />
    <Route path='/dashboard' element={<Dashboard />} />
    <Route path='/mytrips' element={<MyTrips />} /> 
    <Route path='/planner' element={<Planner />} />
    <Route path='/collaborations' element={<Collaborations />} />
    <Route path='/budgettracker' element={<BudgetTracker />} />
    <Route path='/itinerary' element={<Itinerary />} />

    

</Routes>
 </div>
  )
}

export default App


