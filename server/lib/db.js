const mongoose=require('mongoose');

const connectDB = async () => {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
    if (!mongoUri) {
        throw new Error("Missing MONGODB_URI (or MONGO_URI) environment variable");
    }

    try {
        await mongoose.connect(mongoUri);
        console.log("Database connected");
    }
    catch(error) {
        console.error("Database connection failed:", error.message);
        throw error;
    }
};

module.exports=connectDB;