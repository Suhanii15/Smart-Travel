import React from 'react'
import {Compass} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const Landnavabr = () => {
    const navigate = useNavigate()
    const handleLogin =()=>{
        navigate('/login')
    }
  return (
    <div className="flex justify-between items-center bg-white dark:bg-slate-900/90 backdrop-blur-md top-1 h-15 px-10
    z-50 max-w-7xl min-w-screen sticky">
        <div className="flex gap-2 items-center">
            <div className="p-2 bg-blue-500/10 dark:bg-blue-400/20 top-2 rounded-full">
             <Compass className="text-blue-500 dark:text-blue-400" strokeWidth={2.5} />
             </div>
             <span className="text-xl font-bold tracking-tight text-gray-600 dark:text-gray-300">
      Smart<span className="text-blue-500 dark:text-blue-400">Travel</span>
    </span>
        </div>

        <div className="flex gap-6 items-center">
            

        </div>
    </div>
  )
}

export default Landnavabr