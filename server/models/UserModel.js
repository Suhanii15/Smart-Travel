const mongoose = require('mongoose');
const notificationSchema = new mongoose.Schema({
  message:   { type: String, required: true },
  type: {
    type: String,
    enum: [
      "collaborator_added",
      "collaborator_removed", 
      "trip_finalized",
      "trip_reminder",
      "activity_added"
    ],
    default: "collaborator_added"
  },
  tripId:    { type: mongoose.Schema.Types.ObjectId, ref: "Trip" },
  read:      { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

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
        password: 
        { type: String, 
            
            default: null
         },

  googleId:
   { type: String, 
    
    default: null 
},
  notifications: [notificationSchema],

       
    
},
{timestamps:true});

module.exports = mongoose.models.User || mongoose.model('User', UserSchema);
