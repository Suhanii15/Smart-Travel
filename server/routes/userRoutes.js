const {SignUp,login,getUser}=require("../controllers/userController");
const protectedRoute=require("../middlewares/auth");

const express=require('express');
const router=express.Router();

router.post("/signup",SignUp);
router.post("/login",login);
router.get("/getuser",protectedRoute,getUser);

module.exports=router;

