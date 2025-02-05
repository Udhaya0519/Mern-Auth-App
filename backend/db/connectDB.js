import mongoose from "mongoose";
import dotenv from "dotenv"


dotenv.config();



export const connectDB = () => {
    try {
        mongoose.connect(process.env.MONGO_URI)
        console.log("Connected to db...");

    } catch (error) {
        console.log("Error connecting to DB:",error.message);
        process.exit(1)
        
    }
}



