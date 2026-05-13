import React from 'react'
import {motion} from 'framer-motion';


const UpcomingCard = ({image, date,days,title}) => {
   const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 2.5,
        staggerChildren: 0.1, // Now this will work!
      },
    },
  };

  // Child Variant
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
   <motion.div
    initial="hidden"
    animate="visible"
    viewport={{ once: true }}
    variants={containerVariants}
    className="group relative overflow-hiden rounded-[2rem] shadow-lg bg-white flex flex-col gap-3 p-3 h-60 w-70 shadow-gray-300 hover:shadow-md transition-all-group duration-500 cursor-pointer z-3">
    <div className="relative h-56 overflow-hidden rounded-[1.5rem] aspect-video">
        <motion.img src={image} 
        alt={title}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

       <motion.div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md text-white text-sm px-3 py-1 rounded-full border border-white/20">
          {days} Days
        </motion.div>

       <div className="absolute bottom-4 left-4">
          <motion.h2 className="text-2xl font-bold text-white tracking-wide">
            {title}
          </motion.h2>
        </div>
      </div>

      <motion.div className="p-5 flex flex-row gap-3 justify-between">

        <div className="flex  items-center gap-2 text-gray-500 text-sm">
          <span>{date}</span>
        </div>

          
          <button className="text-sm font-semibold text-blue-600 hover:text-blue-700">
            View Trip
          </button>
        </motion.div>
      </motion.div>

  )
}

export default UpcomingCard