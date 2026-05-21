const User=require("../models/TripModel");
const bcrypt=require("bcrypt");
const {generateItinerary}=require("../services/aiService")

const CreateTrip = async(req,res)=>{
 try{
  const {destination,startDate,endDate,travelStyle,peopleCount,companions,preferences,interests}=req.body;
  if (!destination || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: "Destination, Start Date, and End Date are mandatory to generate an itinerary."
      });
    }
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

  const newTrip=Trip.create({
    destination,
    startDate,
    endDate,
    peopleCount,
    companions,
    preferences,
    status:"Draft",
   itinerary:aiPayload.itinerary,
   budgetEstimation: aiPayload.budgetEstimation,
    collaborators: [
        {
          user: req.user._id,
          role: "admin",
        },
      ],

  });

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
    const trips=await Trip.find({
      "collaborators.user":req.user._id,   //jo user klogged in hai na usko humne collaborator schema ke andar by default admin bnaa rkha hai 
                                           //so there is no problem searching id in the collaboarote section
    }).sort({createdAt : -1});

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
        const id=req.params.id;
        
        const trip=await Trip.findById(id)
        .populate("collaborators.user","name email");//.populate() is used to replace reference id in a docuement with actual data from another collection
        if(!trip){                                    //jaisa yaha jab hum find by id use karenge toh collaborators ki id milegi jo trip model mai haiab collaborato rbhi toh user hi hai so , 
                                                  // uska name , email, password populate se milega by using collaborator id as a reference and because populate  sara data deta hai including hashed password so we specify the details we want
            return res.json({
                success:false,
                message:"trip does not exists"
            })
        }                                              
      
        const isMember=trip.collaborators.some(
            (member)=>member.user._id.toSting() === req.user._id.toSting()
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


const checkStatus = async(trip)=>{
    try{
   const {tripId}=req.params;
   const {status}=req.body;

   const trip=Trip.findById(tripId);

   if(!trip){
    return res.json({
        success:false,
        message:"Trip does not exists"
    });
   }

   const findmember=trip.collaborators.find(
    (c)=>c.user.toString() === req.user._id.toString()
   )
   if(!findmember){
    return res.json({
        success:false,
        message:"Access denied"
    });
   }

   if(findmember.role !== "admin"){
    return res.json({
        success:false,
        message:"only admin can change trips status"
    })
   }

   if(trip.endDate){
   const today=new Date();
   const tripEnd=new Date(trip.endDate);



   if(today > tripEnd){
    trip.status === "completed";
   
   }
}

const allowedStatuses = ["draft", "finalized", "completed"];
    if (status && !allowedStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status value provided." });
    }

    trip.status=status;

   await trip.save();

   return res.json({
    success:true,
    message:`${trip.status}`,
    trip
   })
}
catch(err){
console.log(err);
}
}

module.exports={CreateTrip, getAllTrips, getTrip,checkStatus};