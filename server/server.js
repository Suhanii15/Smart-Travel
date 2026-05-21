require('dotenv').config(); 
const express=require('express');
const cors=require('cors');
require("dotenv/config");
const http =require('http');
const connectDB= require('./lib/db.js');
const app=express();
const server=http.createServer(app);


app.use(express.json({limit:"4mb"}));
app.use(cors());

connectDB();

const userRouter=require("./routes/userRoutes");
const tripRouter=require("./routes/tripRoutes.js");



app.use("/api/status", (req,res)=>res.send("server is live"));
app.use("/api/user", userRouter);
app.use("/api/trips",tripRouter);

const PORT=process.env.PORT || 5000;
server.listen(PORT,()=>
    console.log("server running on" + PORT));
