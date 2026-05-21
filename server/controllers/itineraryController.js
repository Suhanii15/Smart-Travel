const Trip=require("../models/TripModel");

const addDay=async(req , res)=>{
        try{

            const {tripId}=req.params;
            const {dayNumber}=req.body;  
            const trip = await Trip.findById(tripId);
    if (!trip){
         return res.status(404).json({
             success: false, 
             message: "Trip not found" });
    }
    
    trip.itinerary.set(dayNumber.toString(),{
        morniong: [],
        afternoon:[],
        evening:[]
    });

    await trip.save();
    return res.status(200).json({
        success: true, trip
    })

        }
        catch(err){
            console.log(err);
            return res.json({
                success:false,
                message:err.message
            })
        }
}

const deleteDay=async(req , res)=>{
        try{

            const {tripId,dayNumber}=req.params;
            
            const trip = await Trip.findById(tripId);
    if (!trip){
         return res.status(404).json({
             success: false, 
             message: "Trip not found" });
    }
    
    trip.itinerary.delete(dayNumber.toString());

    await trip.save();
    return res.status(200).json({
        success: true, trip
    })

        }
        catch(err){
            console.log(err);
            return res.json({
                success:false,
                message:err.message
            })
        }
}

const addActivity = async(req,res) =>{
    try{
 const {tripId}=req.params;
            const {dayNumber,period,time,task,location}=req.body;  
            const trip = await Trip.findById(tripId);
    if (!trip){
         return res.status(404).json({
             success: false, 
             message: "Trip not found" });
    }
    
    const targetDay=trip.itinerary.get(dayNumber.toString());
    if(!targetDay){
        return res.json({
            success:false,
            message:"Day does not exist"
        })
    }

    targetDay[period].psuh({time,task,loaction});
    trip.markModified('itinerary');
    await trip.save();

    return res.status(200).json({ success: true, trip });



    }
    catch(err){
 console.log(err);
            return res.json({
                success:false,
                message:err.message
            });
    }
}

const deleteActivity=async(req,res)=>{
    try{
const {tripId,dayNumber,period,activityId}=req.params;
  const trip = await Trip.findById(tripId);
    if (!trip){
         return res.status(404).json({
             success: false, 
             message: "Trip not found" });
    }

    const targetday=trip.itinerary.get(dayNumber.toString());
    if(targetday && targetday[period]){
        targetday[period].pull({_id:activityId});
    }
    
    trip.markModified('itinerary');
    await trip.save();

    return res.status(200).json({ success: true, trip });

    }
    catch(err){
 console.log(err);
            return res.json({
                success:false,
                message:err.message
            });
    }
}

module.exports={addDay,deleteDay,addActivity,deleteActivity};