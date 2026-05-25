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
    .select("name email")
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
    console.log("userToInvite ID:", userToInvite);


    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({ success: false, message: "Trip not found" });
    }
    const requester = trip.collaborators.find(
      (c) => c.user.toString() === req.user._id.toString()
    );
    if (!requester) {
      return res.status(403).json({ success: false, message: "You are not a member of this trip" });
    }
    if (requester.role !== "admin") {
      return res.status(403).json({ success: false, message: "Only trip admins can add collaborators" });
    }

    const userExists = await User.findById(userToInvite);
    if (!userExists) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
      console.log("Found user in DB:", userExists?._id, userExists?.name);

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
// After saving collaborator, notify the added user:
await User.findByIdAndUpdate(userExists._id, {
  $push: {
    notifications: {
      message: `You were added as a collaborator on trip to ${trip.destination}`,
      type:   "collaborator_added",
      tripId:  trip._id,
      read:false
    }

  }
});
 console.log("Notification pushed to:", userExists.name);
 
const saved = await Trip.findById(tripId);
console.log("Collaborators after save:", saved.collaborators);
const updatedTrip = await Trip.findById(tripId).populate("collaborators.user", "name email");
return res.status(200).json({ success: true, message: "Collaborator added successfully", trip: updatedTrip })
    

}
catch(err){
    console.log(err);
    return res.json({
        success:false,
        message:err.message
    })
}

};


const removeCollaborator = async (req, res) => {
  try {
    const { tripId, userIdToRemove } = req.params; 

    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({ success: false, message: "Trip not found" });
    }

    const requester = trip.collaborators.find(
      (c) => c.user.toString() === req.user._id.toString()
    );
    if (!requester || requester.role !== "admin") {
      return res.status(403).json({ success: false, message: "Only admins can remove collaborators" });
    }

    if (userIdToRemove.toString() === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: "Admin cannot remove themselves" });
    }

    const targetMember = trip.collaborators.find(
      (c) => c.user.toString() === userIdToRemove.toString()
    );
    if (!targetMember) {
      return res.status(404).json({ success: false, message: "User is not a collaborator" });
    }
    if (targetMember.role === "admin") {
      return res.status(403).json({ success: false, message: "Cannot remove another admin" });
    }

    trip.collaborators = trip.collaborators.filter(
      (c) => c.user.toString() !== userIdToRemove.toString()
    );
    await trip.save();

    const updatedTrip = await Trip.findById(tripId)
      .populate("collaborators.user", "name email");

    return res.status(200).json({ success: true, trip: updatedTrip });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports={searchUsers,addCollaboartor,removeCollaborator};