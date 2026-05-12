import React from 'react'
import {Compass} from 'lucide-react'
import Sidebar from '../components/Sidebar'

const Explore = () => {
  return (
     <div className="flex flex-col min-h-screen">
        {/* leftside*/}
        <div className="flex flex-col gap-3 bg-slate-100 min-h-screen w-72">
        <div className="flex gap-2 my-2 gap-5">
                    <div className="p-2 h-10 bg-blue-500/10 top-2 rounded-full">
                     <Compass className="text-blue-500" strokeWidth={2.5} />
                     </div>
                     <span className="text-xl font-bold tracking-tight text-gray-600">
              Smart<span className="text-blue-500">Travel</span>
            </span>
        </div>
<Sidebar />
</div>
{/* rightside*/}

    </div>
  )
}

export default Explore