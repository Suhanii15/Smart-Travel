import React from 'react'
import {Compass} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const Landnavabr = () => {
    const navigate = useNavigate()
    const handleLogin =()=>{
        navigate('/login')
    }
  return (
    <div className="flex justify-between items-center bg-white backdrop-blur-md top-1 h-15 px-10
    z-50 max-w-7xl min-w-screen sticky">
        <div className="flex gap-2 items-center">
            <div className="p-2 bg-blue-500/10 top-2 rounded-full">
             <Compass className="text-blue-500" strokeWidth={2.5} />
             </div>
             <span className="text-xl font-bold tracking-tight text-gray-600">
      Smart<span className="text-blue-500">Travel</span>
    </span>
        </div>

        <div className="flex gap-6 items-center">
            <button onClick={handleLogin}
            className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 cursor-pointer ">
                Login
            </button>

        </div>
    </div>
  )
}

export default Landnavabr