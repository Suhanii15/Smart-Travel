const Trip=require("../models/TripModel");
const mongoose=require("mongoose");
const User = require("../models/UserModel");

const addDay=async(req , res)=>{
    try{

      const {tripId}=req.params;
      let {dayNumber}=req.body;  
      const trip = await Trip.findById(tripId);
  if (!trip){
     return res.status(404).json({
       success: false, 
       message: "Trip not found" });
  }

  // If caller didn't provide a dayNumber, append at the end (1-based)
  if (dayNumber === undefined || dayNumber === null || dayNumber === "") {
    const keys = Object.keys(trip.itinerary || {}).filter(k => k !== '');
    const numericKeys = keys.map(k => Number(k)).filter(n => !isNaN(n));
    const maxKey = numericKeys.length ? Math.max(...numericKeys) : 0;
    dayNumber = (maxKey + 1).toString();
  } else {
    dayNumber = String(dayNumber);
  }

  trip.itinerary = trip.itinerary || {};
  trip.itinerary[dayNumber]={
    morning: [],
    afternoon:[],
    evening:[]
  }

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

const deleteDay=async(req , res)=>{
        try{

            const {tripId,dayNumber}=req.params;
            
            const trip = await Trip.findById(tripId);
    if (!trip){
         return res.status(404).json({
             success: false, 
             message: "Trip not found" });
    }
    
    // Remove the day and re-index numeric day keys so they remain sequential strings: "1","2",...
    const current = trip.itinerary || {};
    // delete the requested day
    delete current[dayNumber];

    const sortedKeys = Object.keys(current)
      .map(k => ({ k, n: Number(k) }))
      .filter(x => !isNaN(x.n))
      .sort((a, b) => a.n - b.n)
      .map(x => x.k);

    const newItinerary = {};
    sortedKeys.forEach((oldKey, index) => {
      newItinerary[(index + 1).toString()] = current[oldKey];
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

const ptrip = await Trip.findById(tripId).populate("collaborators.user", "_id name email googleId");

// Debugging: log collaborators and requesting user id to diagnose Google-account mismatch
console.log("addActivity: req.user._id=", req.user?._id?.toString());
console.log("addActivity: ptrip.collaborators=", ptrip.collaborators.map(c => ({ user: c.user, role: c.role })));

const otherCollaborators = ptrip.collaborators
  .filter(c => {
    // ensure safe comparisons even if populated user shape varies
    const collabId = c.user?._id?.toString() || c.user?.id || String(c.user);
    const requesterId = req.user?._id?.toString() || req.user?.id;
    return collabId !== requesterId;
  })
  .map(c => c.user?._id || c.user?.id || c.user);

console.log("addActivity: otherCollaborators ids=", otherCollaborators);

if (otherCollaborators.length > 0) {
  const result = await User.updateMany(
    { _id: { $in: otherCollaborators } },
    {
      $push: {
        notifications: {
          message: `A new activity "${task}" was added to Day ${dayNumber} of your ${ptrip.destination} trip`,
          type:    "activity_added",
          tripId:  ptrip._id,
          read:    false,
        }
      }
    }
  );
  console.log("addActivity: User.updateMany result=", result);
}

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
    const { tripId, activityId } = req.params;
    const {dayNumber, period, activityIndex}=req.body;

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

    let deleted = false;
    const storedActivityId = activityId ? String(activityId) : undefined;
    const isObjectIdLike = storedActivityId && /^[0-9a-fA-F]{24}$/.test(storedActivityId);

    if (isObjectIdLike) {
      targetDay[period] = targetDay[period].filter((act) => {
        const storedId = act._id && act._id.toString ? act._id.toString() : String(act._id);
        if (storedId === storedActivityId) {
          deleted = true;
          return false;
        }
        return true;
      });
    } else if (activityIndex !== undefined && !isNaN(Number(activityIndex))) {
      const idx = Number(activityIndex);
      if (idx >= 0 && idx < targetDay[period].length) {
        targetDay[period].splice(idx, 1);
        deleted = true;
      }
    }

    if (!deleted) {
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