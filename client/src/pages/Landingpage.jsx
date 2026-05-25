import React from 'react'
import Landnavabr from '../components/Landnavabr'
import photo from '../assets/landingpage.png'
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
const Landingpage = () => {
  const Navigate=useNavigate();
    
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, 
      },
    },
  };
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 1.2, ease: "easeOut" },
    },
  };
  return (
    <>
        <Landnavabr />
    

    <section className="flex flex-col lg:flex-row items-center justify-between min-h-[80vh] px-6 lg:px-20 py-12 ">
  
  <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="w-full lg:w-1/2 space-y-1"
        >
    <motion.h1 variants={itemVariants} className="text-4xl font-bold text-gray-500">AI POWERED</motion.h1>
    <motion.h1 variants={itemVariants} className="text-3xl font-bold text-blue-500">Travel Planning</motion.h1>
    <motion.h1 variants={itemVariants} className="text-4xl font-bold text-gray-500">made easy</motion.h1>

    <motion.h2 variants={itemVariants} className="text-lg text-gray-400 mt-4">
        Plan smarter, travel better, get personalized itineraries, budget tracking and real-time collaboration-all in one place.
    </motion.h2>
  </motion.div>

  <motion.div variants={containerVariants} initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.4 }}
   className="w-full lg:w-1/2 relative mt-12 lg:mt-0">
   <img src={photo} className="w-full h-auto"/>
  </motion.div>

  
</section>
<motion.div  variants={containerVariants} initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.4 }}
className="flex justify-center items-center top-0 bottom-3">
<button onClick={()=>Navigate('/login')}
className=" mt-8 bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-600 cursor-pointer transition-colors duration-300">
Plan Your Trip Now
  </button>

  </motion.div>

    </>
  )
}

export default Landingpage