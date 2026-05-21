const Trip=require("../models/TripModel");
const User=require("../models/UserModel");

const searchUsers = async(req,res)=>{
    try{
    const {username}=req.query;

    if(!username || username.trim === ""){
        return res.json({
            success:false,
            message:"User not found"
        });

    }

    const users=await User.find({
        name:{$regex: username, $options: "i"},  //find that user whose name matches the input avoiding case sensitivity
        _id: { $ne: req.user._id }               //exclude the logged-in user from the search bar
    })
    .select("name")
    .limit(10);

    return res.status(200).json({ success: true, users });
}
catch(err){
    console.log(err);
    return res.json({
        success:false,
        message:err.message
    })
}

}


const addCollaboartor=async(req,res)=>{
    try{
    const {tripId}=req.params;
    const {userToInvite}=req.body;

    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({ success: false, message: "Trip not found" });
    }
    const alreadyadded = trip.collaborators.some(
        (c)=> c.user.toString() === userToInvite.toString()      //.some() is used to check if atleast one of that value exist in that array
    );

    if(alreadyadded){
        return res.json({
            success:false,
            message:"user already added as collaborator"

        });
    }

    trip.collaborators.push({
        user:userToInvite,
        role:"user"

    })

    await trip.save();

}
catch(err){
    console.log(err);
    return res.json({
        success:false,
        message:err.message
    })
}

};


const removeCollaborator=async(req,res)=>{
    try{
         const {tripId, idToRemove}=req.params;
          const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({ success: false, message: "Trip not found" });
    }
    const requester = trip.collaborators.find((c) => c.user.toString() === req.user._id.toString());
    if (!requester || requester.role !== "admin") {
      return res.status(403).json({ success: false, message: "Only trip admins can remove collaborators." });
    }

    trip.collaborators.pull({ user: userIdToRemove });
    await trip.save();

  
    const updatedTrip = await Trip.findById(tripId).populate("collaborators.user", "name email");

    return res.status(200).json({
      success: true,
      message: "Collaborator removed successfully.",
      trip: updatedTrip
    });
    }
    catch(err){
         console.log(err);
    return res.json({
        success:false,
        message:err.message
    })

    }
}

module.exports={searchUsers,addCollaboartor,removeCollaborator};