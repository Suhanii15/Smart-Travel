require('dotenv').config(); 
const express=require('express');
const cors=require('cors');
require("dotenv/config");
const http =require('http');
const connectDB= require('./lib/db.js');
const app=express();
const server=http.createServer(app);
const cron = require("node-cron");


app.use(express.json({limit:"4mb"}));
app.use(cors());

connectDB();

const userRouter=require("./routes/userRoutes");
const tripRouter=require("./routes/tripRoutes.js");
const passport = require("./config/passport");

app.use(passport.initialize());
const authRouter=require("./routes/authRoutes.js")
const notificationRouter=require("./routes/notificationRotes.js")

app.get('/.well-known/appspecific/com.chrome.devtools.json', (req, res) => res.json({}));

app.use("/api/status", (req,res)=>res.send("server is live"));
app.use("/api/user", userRouter);
app.use("/api/trips",tripRouter);
app.use("/api/auth",   authRouter);
app.use("/api/notification", notificationRouter)


cron.schedule("0 9 * * *", async () => { // runs every day at 9 AM
  try {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const dayAfter = new Date(tomorrow);
    dayAfter.setDate(dayAfter.getDate() + 1);

    const tripsStartingTomorrow = await Trip.find({
      startDate: { $gte: tomorrow, $lt: dayAfter },
      status: "finalized"
    });

    for (const trip of tripsStartingTomorrow) {
      const collaboratorIds = trip.collaborators.map(c => c.user);
      await User.updateMany(
        { _id: { $in: collaboratorIds } },
        {
          $push: {
            notifications: {
              message: `Your trip to ${trip.destination} starts tomorrow! 🎒`,
              type:    "trip_reminder",
              tripId:  trip._id,
              read:    false,
            }
          }
        }
      );
    }
    console.log("Trip reminder notifications sent");
  } catch (err) {
    console.error("Cron job failed:", err);
  }
});




const PORT=process.env.PORT || 5000;
server.listen(PORT,()=>
    console.log("server running on" + PORT));
