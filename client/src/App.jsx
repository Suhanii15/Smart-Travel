import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Landingpage from './pages/Landingpage'
import LoginPage from './pages/LoginPage'
import Dashboard from './pages/Dashboard'
import MyTrips from './pages/MyTrips'
import Explore from './pages/Explore'
import Planner from './pages/Planner'
import Collaborations from './pages/Collaborations'
import BudgetTracker from './pages/BudgetTracker'

const App = () => {
  return (
    <div className="bg-slate-50 min-h-screen overflow-x-hidden">
      <Routes>
    <Route path='/' element= {<Landingpage /> }/>
    <Route path='/login' element={<LoginPage />} />
    <Route path='/dashboard' element={<Dashboard />} />
    <Route path='/mytrips' element={<MyTrips />} /> 
    <Route path='/explore' element={<Explore />} />
    <Route path='/planner' element={<Planner />} />
    <Route path='/collaborations' element={<Collaborations />} />
    <Route path='/budgettracker' element={<BudgetTracker />} />

    

</Routes>
 </div>
  )
}

export default App


