const mongoose=require('mongoose');
const activitySchema=new mongoose.Schema({
    time:{
        type:String
    },
    task:{
        type:String
    },
    location:{
        type:String,
    },
    estimatedcost:{
        type:Number,
        default:0
    }

});

const collaboratorSchema=new mongoose.Schema({
     user : {
      type: mongoose.Schema.Types.ObjectId,
      ref : "User",
      required: true,
    },
    role : {
        type:String,
        enum:["admin","user"],
        default:"user"
    }
});
const TripSchema=new mongoose.Schema(
    {
        destination:{
            type:String,
            required:true,
        },
        startDate:Date,
        endDate:Date,
        peopleCount:Number,
        status:{
            type:String,
            enum:["draft","fianlized","completed"],
            default:"draft",
        },
        preferences:[String],

        collaborators:[collaboratorSchema],

        itinerary:{
            type:Map,
            of:new mongoose.Schema({
                morning:[activitySchema],
                afternoon:[activitySchema],
                evening:[activitySchema],

            })
        },

    estimatedBudget:{
    accommodationTotal: { type: Number, default: 0 },
    transportationTotal: { type: Number, default: 0 },
    foodAndDiningTotal: { type: Number, default: 0 },
    activitiesTotal: { type: Number, default: 0 },
    miscellaneousTotal: { type: Number, default: 0 },
    grandTotal: { type: Number, default: 0 },
    currency: { type: String, default: "INR" }
  },
 members :[
        {
    user : {
      type: mongoose.Schema.Types.ObjectId,
      ref : "User",
      required: true,
    },
    role : {
        type:String,
        enum:["admin","user"],
        default:"user"
    }
    }]

    },


    {
        timestamps:true
    }
);


module.exports=mongoose.model("Trip",TripSchema);