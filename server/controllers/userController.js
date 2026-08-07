const User=require("../models/UserModel");
const {generateToken} = require("../lib/utils");
const bcrypt=require("bcrypt");

const SignUp = async(req,res) =>{
    try{
     const {name,email,password}=req.body;
     if(!email || !name || !password){
        return res.status(400).json({
            success:false,
            message:"required feild is empty",
        });
     }
     const existingUser= await User.findOne({email});
     if(existingUser){

        if (existingUser.googleId && !existingUser.password) {
        return res.status(400).json({ 
          success: false, 
          message: "This email is linked to a Google account. Please login with Google." 
        });
    }
      return  res.status(409).json({
            success:false,
            message:"User already exists"

        });
     }
     const salt=await bcrypt.genSalt(10);
     const hashedPassword= await bcrypt.hash(password,salt);
     const newUser=await User.create({
        name,
        email,
        password:hashedPassword
     });
    
    const token=generateToken(newUser._id);

  return  res.json({
        success:true,
        token,
        newUser:{
            id:newUser._id,
            name:newUser.name,
            email:newUser.email
        },

    });

    }
    catch(err){
        console.log(err)
return res.json({
    success:false,
    message:"Error occured in SignUp",
})
    }
};

const login=async(req,res) => {
    try{
      const{email,password}=req.body;
      const user= await User.findOne({email});
      if(!user){
      return   res.json({
            success:false,
            message:"User does not exists"
        });
      }
  if (!user.password) {
      return res.status(400).json({ 
        success: false, 
        message: "This account uses Google sign-in. Please login with Google." 
      });
    }

      const isMatch=await bcrypt.compare(password,user.password);
      if(!isMatch){
      return   res.json({
            success:false,
            message:"Incorrect Password"
        });
      }
       const token=generateToken(user._id);

     return  res.json({
        success:true,
        token,
        user:{
        id:user.id,
        name:user.name,
        email:user.email
        }
       })


    }
    catch(err){
        console.log(err);
     return   res.json({
            success:false,
            message:"error occured while logging you in"
        })
    }
};


const getUser = async(req,res)=>{
    try{
        if (!req.user) {
            return res.status(401).json({ 
                success: false, 
                message: "Unauthorized access" 
            });
        }
    return  res.json({
        success:true,
        user:{
            id:req.user.id,
            name:req.user.name,
            email:req.user.email

        }
      });
    }
    catch(err){
        console.log(err);
return res.json({
    success:false,
    message:"failed to fetch User"


})
    }
};

const updateProfile = async(req,res)=>{
    try{
      const {name,email}=req.body;
      if(!name && !email){
        return res.status(400).json({
          success:false,
          message:"Nothing to update"
        });
      }
      const updates={};
      if(email){
        const normalizedEmail=email.trim().toLowerCase();
        const existing=await User.findOne({
          email:new RegExp("^"+normalizedEmail.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")+"$","i"),
          _id:{$ne:req.user._id}
        });
        if(existing){
          return res.status(409).json({
            success:false,
            message:"Email already in use"
          });
        }
        updates.email=normalizedEmail;
      }
      if(name){
        updates.name=name.trim();
      }
      const updated=await User.findByIdAndUpdate(req.user._id,updates,{new:true}).select("-password");
      return res.json({
        success:true,
        user:{
          id:updated._id,
          name:updated.name,
          email:updated.email
        }
      });
    }
    catch(err){
      console.log(err);
      return res.json({
        success:false,
        message:"Failed to update profile"
      });
    }
};

module.exports={SignUp,login,getUser,updateProfile};

