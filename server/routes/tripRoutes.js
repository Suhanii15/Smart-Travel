const express=require("express");
const router=express.Router();
const protectedRoute=require("../middlewares/auth");
const {searchUsers,addCollaboartor,removeCollaborator}=require("../controllers/collaborationController");
const {CreateTrip, getAllTrips, getTrip,checkStatus,updateActualSpent}=require("../controllers/tripController");
const {addDay,deleteDay,addActivity,deleteActivity}=require("../controllers/itineraryController");


//routes for trips
router.post("/create",protectedRoute,CreateTrip);
router.patch("/:tripId/status",protectedRoute,checkStatus);
router.get("/alltrips",protectedRoute,getAllTrips);


router.get("/search",protectedRoute,searchUsers);


router.get("/single/:tripId",protectedRoute,getTrip);


//day and activity
router.post("/:tripId/day",protectedRoute,addDay);
router.delete("/:tripId/day/:dayNumber",protectedRoute,deleteDay);
router.post("/:tripId/activity",protectedRoute,addActivity);
router.delete("/:tripId/activity/:activityId", deleteActivity);

//collaborattions
router.post("/:tripId/collaborators",protectedRoute,addCollaboartor);
router.delete("/:tripId/collaborators/:userIdToRemove",protectedRoute,removeCollaborator);
router.patch("/:tripId/actualspent", protectedRoute, updateActualSpent);

module.exports=router;