const User=require("../models/UserModel");
const bcrypt=require("bcrypt");
const {generateItinerary}=require("../services/aiService")
const Trip=require("../models/TripModel")
const mongoose=require("mongoose");

const CreateTrip = async(req,res)=>{
 try{
  const {destination,startDate,endDate,travelStyle,peopleCount,companions,preferences,interests}=req.body;
  if (!destination || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: "Destination, Start Date, and End Date are mandatory to generate an itinerary."
      });
    }
   /* let itineraryData = {};
    try {
      
      itineraryData = await generateItinerary(destination, startDate, endDate);
    } catch (aiError) {
      console.error(" Gemini API is down/busy. Creating fallback empty itinerary instead.");}*/
    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDifference = end.getTime() - start.getTime();
    const totalDays = Math.ceil(timeDifference / (1000 * 60 * 60 * 24)) + 1;

const aiPayload = await generateItinerary({
      destination,
      totalDays,
      travelStyle,
      peopleCount,
      companions,
      preferences,
      interests
    });
    console.log("AI PAYLOAD:");
console.log(JSON.stringify(aiPayload, null, 2));

const itinerary = aiPayload.itinerary || {};
    const estimatedBudget = aiPayload.estimatedBudget || {};

const formattedItinerary = {};
  for (const dayKey in itinerary) {
    formattedItinerary[String(dayKey)] = {
      morning: itinerary[dayKey].morning || [],
      afternoon: itinerary[dayKey].afternoon || [],
      evening: itinerary[dayKey].evening || []
    };
  }
  const newTrip=await Trip.create({
    destination,
    startDate,
    endDate,
    peopleCount,
    companions,
    preferences,
    status:"draft",
   itinerary:formattedItinerary,
   estimatedBudget: aiPayload.estimatedBudget,
    collaborators: [
        {
          user: req.user._id,
          role: "admin",
        },
      ],

  });
console.log(
  "ITINERARY KEYS:",
  Object.keys(aiPayload.itinerary || {})
);
 return res.json({
    success:true,
    trip:newTrip,
  })
}

catch(err){
    console.log(err);
    return res.json({
        success:false,
        message:"Trip was not created"
    })  

}
};

const getAllTrips = async(req,res)=>{
    try{
         console.log("Request from user:", req.user._id, req.user.name);
    const trips = await Trip.find({"collaborators.user": new mongoose.Types.ObjectId(req.user._id)}).sort({ createdAt: -1 }); //jo user klogged in hai na usko humne collaborator schema ke andar by default admin bnaa rkha hai 
                                           //so there is no problem searching id in the collaboarote section
    console.log("Trips found for", req.user.name, ":", trips.length);

const today=new Date();
    for(let trip of trips){
        if(trip.endDate && trip.status !== "completed"){
            const tripEnd=new Date(trip.endDate);
            if(today > tripEnd){
                trip.status="completed";
                await trip.save();
            }
        }
    }

   return res.json({
        success:true,
        trips,
    })
}
catch(err){
    console.log(err);
  return  res.json({success:false,
        message:"failed to fetch all trips"
    })

}
};

const getTrip = async(req,res)=>{
    try{
const { tripId } = req.params;        
        const trip= await Trip.findById(tripId)
        .populate("collaborators.user","name email");//.populate() is used to replace reference id in a docuement with actual data from another collection
        if(!trip){                                    //jaisa yaha jab hum find by id use karenge toh collaborators ki id milegi jo trip model mai haiab collaborato rbhi toh user hi hai so , 
                                                  // uska name , email, password populate se milega by using collaborator id as a reference and because populate  sara data deta hai including hashed password so we specify the details we want
            return res.json({
                success:false,
                message:"trip does not exists"
            })
        }                                              
      
        const isMember=trip.collaborators.some(
            (member)=>member.user._id.toString() === req.user._id.toString()
        );

        if(!isMember){
            return res.json({
                success:false,
                message:"Access denied"
            });
        }

        return res.json({
            success:true,
            trip,
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

//const finalizeTrip = async(req,res) =>{
//try{
//const {tripId}=req.params;
//const trip=await Trip.findById(tripId);
//if(!trip){
    //return res.json({
      //  success:false,
        //message:"Trip Not Found"
    //})
//}
 //const isMember=trip.collaborators.some(
           // (member)=>member.user._id.toSting() === req.user._id.toSting()
      //  );
//if(!isMember){
    //return res.json({
      //  success:false,
        //message:"Access Denied",
   // });
//}

//trip.status="finalized";
//trip.save();

//return res.json({
 //   success:true,
   // trip,
//})

//}
//catch(err){
//console.log(err);
//return res.json({
   // success:false,
  //  message:err.message
//})
//}
//}


const checkStatus = async (req, res) => {
  try {
    const { tripId } = req.params;
    const { status } = req.body;

    const allowedStatuses = ["draft", "finalized", "completed"];
    if (status && !allowedStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status value." });
    }

    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({ success: false, message: "Trip does not exist" });
    }

    const findMember = trip.collaborators.find(
      (c) => c.user.toString() === req.user._id.toString()
    );
    if (!findMember) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
    if (findMember.role !== "admin") {
      return res.status(403).json({ success: false, message: "Only admin can change trip status" });
    }

    if (trip.endDate) {
      const today = new Date();
      const tripEnd = new Date(trip.endDate);
      if (today > tripEnd) {
        trip.status = "completed"; 
      } else if (status) {
        trip.status = status;
      }
    } else if (status) {
      trip.status = status;
    }
await trip.save();

if (status === "finalized") {
  const collaboratorIds = trip.collaborators
    .filter(c => c.user.toString() !== req.user._id.toString()) // exclude admin
    .map(c => c.user);

  await User.updateMany(
    { _id: { $in: collaboratorIds } },
    {
      $push: {
        notifications: {
          message: `Trip to ${trip.destination} has been finalized`,
          type:    "trip_finalized",
          tripId:  trip._id,
          read:    false,
        }
      }
    }
  );
}
    

    return res.json({ success: true, message: trip.status, trip });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

const updateActualSpent = async (req, res) => {
  try {
    const { tripId } = req.params;
    const { category, amount } = req.body;

    const validCategories = ["Accomodation", "Transport", "Food", "Activities", "Miscellaneous"];
    if (!validCategories.includes(category)) {
      return res.status(400).json({ success: false, message: "Invalid category" });
    }

    const trip = await Trip.findById(tripId);
    if (!trip) return res.status(404).json({ success: false, message: "Trip not found" });

    trip.actualSpent[category] = amount;
    trip.markModified('actualSpent');
    await trip.save();

    return res.status(200).json({ success: true, trip });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { CreateTrip, getAllTrips, getTrip, checkStatus, updateActualSpent };
