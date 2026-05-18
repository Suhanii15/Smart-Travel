const mongoose = require('mongoose');

const UserSchema=new mongoose.Schema({
    
        name:{
        type:String,
        required:true,
        trim:true
        },
        email:{
            type:String,
            required:true,
            trim:true

        },
        password:{
            type:String,
            required:true,
            trim:true

        },
          trips:[
      {
         type:mongoose.Schema.Types.ObjectId,
         ref:"Trip"
      }
   ]
    
},
{timestamps:true});

module.exports = mongoose.models.User || mongoose.model('User', UserSchema);
