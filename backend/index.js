import express from 'express'
import cookieParser from 'cookie-parser';
import cors from 'cors'
// import path from 'path'
import dotenv from 'dotenv'

import { connectDB } from './db/connectDB.js';
import authRoutes from "./routes/auth.route.js"

dotenv.config()


const app = express();
// const __dirname = path.resolve()

connectDB();


app.use(express.json())
app.use(cookieParser())


app.use(
    cors({
      origin: [
        "https://mern-auth-app-pi.vercel.app",
        "https://mern-auth-app-udhaya-js-projects.vercel.app",
      ],
      credentials: true,
    })
  );

  app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "https://mern-auth-app-pi.vercel.app");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
  });



app.use('/api/auth', authRoutes)

// if(process.env.NODE_ENV === "production"){
    //     app.use(express.static(path.join(__dirname, "/frontend/dist")))
    
    //     app.get("*", (req,res) => {
        //         res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"))
        //     })
        // }
        
        
// const PORT = 3000; 


// app.listen(PORT,() => {
//     connectDB();
//     console.log('connected to server on port:',PORT);
// })


export default app;



