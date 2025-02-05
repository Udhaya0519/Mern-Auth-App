import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

export const verifyToken = async (req, res, next) => {

    const token = req.cookies.token

    if(!token) return res.status(401).json({success:false, message:"Unauthorized - no token provided"})

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)

        if(!decodedToken) return res.status(401).json({success:false, message:"Unauthorized - invalid token"})
        req.userId = decodedToken.userId

        next()

    } catch (error) {
        console.log("Error in verify token:", error);
        return res.status(500).json({ success:false, message: "Server error"})
        
    }
    
}   