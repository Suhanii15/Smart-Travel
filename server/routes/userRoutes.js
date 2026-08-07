const {SignUp,login,getUser,updateProfile}=require("../controllers/userController");
const protectedRoute=require("../middlewares/auth");

const express=require('express');
const router=express.Router();

router.post("/signup",SignUp);
router.post("/login",login);
router.get("/getuser",protectedRoute,getUser);
router.put("/update",protectedRoute,updateProfile);

module.exports=router;

