const mongoose=require('mongoose');
const activitySchema=new mongoose.Schema({
    time:{
        String
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
        default:members
    }
})
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
            default:"darft",
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
            hotel:{
                type:Number,
                default:0
            },
            food:{
                type:Number,
                default:0
            },
            transport:{
                type:Number,
                default:0
            },
            toatl:{
                type:Number,
                default:0
            },
            shopping:{
                type:Number,
                default:0
            },
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
        default:members
    }
    }]

    },


    {
        timestamps:true
    }
);


module.exports=mongoose.model("Trip",TripSchema);