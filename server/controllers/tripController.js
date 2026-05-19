const User=require("../models/TripModel");
const bcrypt=require("bcrypt");

const CreateTrip = async(req,res)=>{
 try{
  const {destination,startDate,endDate,peopleCount,companions,preference,interests}=req.body;
  const newTrip=Trip.create({
    destination,
    startDate,
    endDate,
    peopleCount,
    companions,
    preference,
    status:"Draft",
   itinerary: {
        "1": {
          morning: [],
          afternoon: [],
          evening: []
        }
      },
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

const finalizeTrip = async(req,res) =>{
try{
const {tripId}=req.params;
const trip=await Trip.findById(tripId);
if(!trip){
    return res.json({
        success:false,
        message:"Trip Not Found"
    })
}
 const isMember=trip.collaborators.some(
            (member)=>member.user._id.toSting() === req.user._id.toSting()
        );
if(!isMember){
    return res.json({
        success:false,
        message:"Access Denied",
    });
}

trip.status="finalized";
trip.save();

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


module.exports={CreateTrip, getAllTrips, getTrip,finalizeTrip};