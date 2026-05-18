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
            id:user.id,
            name:user.name,
            email:user.email

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

module.exports={SignUp,login,getUser};

