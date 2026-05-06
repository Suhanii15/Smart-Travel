import express from 'express';
import cors from 'cors';
import "dotenv/config";
import http from "http"
import { connectDB } from "./lib/db.js";
const app=express();
const server=http.createServer(app);


app.use(express.json({limit:"4mb"}));
app.use(cors());

await connectDB();

app.use("/api/status", (req,res)=>res.send("server is live"));

const PORT=process.env.PORT || 5000;
server.listen(PORT,()=>
    console.log("server running on" + PORT));
