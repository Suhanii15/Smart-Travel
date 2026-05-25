const {getNotifications, markAsRead, markAllRead}=require("../controllers/notificationController");
const protectedRoute=require("../middlewares/auth");
const express=require('express');
const router=express.Router();


// notificationRoutes.js
router.get("/", protectedRoute, getNotifications);
router.patch("/:notifId/read", protectedRoute, markAsRead);
router.patch("/read-all", protectedRoute, markAllRead);

module.exports=router;