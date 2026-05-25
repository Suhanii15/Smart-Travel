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
import GoogleAuthSuccess from './pages/GoogleAuthSuccess'

const App = () => {
  return (
    <div className="bg-slate-50 min-h-screen overflow-x-hidden">
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


