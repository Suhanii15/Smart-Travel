const Trip=require("../models/TripModel");
const mongoose=require("mongoose");
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
    

    trip.itinerary[dayNumber]={
        morning: [],
        afternoon:[],
        evening:[]
    }


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
    
    trip.itinerary[dayNumber]
const sortedKeys = Array.from(trip.itinerary.keys()).sort((a, b) => Number(a) - Number(b));
        const newItinerary = new Map();
        
        sortedKeys.forEach((oldKey, index) => {
            newItinerary.set((index + 1).toString(), trip.itinerary.get(oldKey));
        });
        
        trip.itinerary = newItinerary;

        trip.markModified('itinerary');
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
            const {dayNumber,period,task,time,location}=req.body;  
            const trip = await Trip.findById(tripId);
    if (!trip){
         return res.status(404).json({
             success: false, 
             message: "Trip not found" });
    }
    
    const targetDay=trip.itinerary[dayNumber];
    if(!targetDay){
        return res.json({
            success:false,
            message:"Day does not exist"
        })
    }

    targetDay[period].push({  _id: new mongoose.Types.ObjectId(),time,task,location: location});
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

const deleteActivity = async (req, res) => {
  try {
    const { tripId,  activityId } = req.params;
    const {dayNumber, period}=req.body;

    const validPeriods = ["morning", "afternoon", "evening"];
    if (!validPeriods.includes(period)) {
      return res.status(400).json({ success: false, message: "Invalid period." });
    }

    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({ success: false, message: "Trip not found" });
    }

    const targetDay = trip.itinerary[dayNumber];
    if (!targetDay) {
      return res.status(404).json({ success: false, message: "Day does not exist" });
    }

    if (!targetDay[period]) {
      return res.status(404).json({ success: false, message: `Period '${period}' not found on this day` });
    }

    const originalLength = targetDay[period].length;
  targetDay[period] = targetDay[period].filter((act) => {
  const storedId = act._id?.$oid       // BSON extended JSON format
    || act._id?.toString?.()            // ObjectId or Buffer
    || String(act._id);                 // plain string fallback

  return storedId !== activityId.toString();
});
console.log("Target activityId:", activityId);
targetDay[period].forEach((act, i) => {
  console.log(`Activity ${i}:`, JSON.stringify(act._id), "match:", String(act._id) === String(activityId));
});
    if (targetDay[period].length === originalLength) {
      return res.status(404).json({ success: false, message: "Activity not found" });
    }

    trip.itinerary[dayNumber] = targetDay;
    trip.markModified('itinerary');
    await trip.save();

    return res.status(200).json({ success: true, trip });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports={addDay,deleteDay,addActivity,deleteActivity};