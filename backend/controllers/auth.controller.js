import bcryptjs from 'bcryptjs'
import crypto from "crypto"

import { User } from '../models/user.model.js'
import { generateTokenAndSetCookie } from '../utils/generateTokenAndSetCookie.js'
import { sendForgotPasswordEmail, sendResetPasswordSuccessEmail, sendVerficationEmail, sendWelcomeEmail } from '../mailtrap/mails.js'


export const checkAuth = async (req, res) => {

    try {
        const user = await User.findById(req.userId)

        if(!user)  return res.status(400).json({success:false, message: "User not found"})

        res.status(200).json({success:true, message:"Authorized", user:{...user._doc, password:undefined}})
        

    } catch (error) {
        console.log("Error in check auth:", error);
        return res.status(500).json({success:false, message: "Server error"})
    }



    
}

export const signup = async(req,res) => {
    try {
        const { email, password, name } = req.body
        if(!email || !password || !name ){
            return res.status(400).json({ success:false, message:"Please provide all fields"})
        }

        const userAlreadyExists = await User.findOne({ email })
        if(userAlreadyExists){
            return res.status(400).json({success:false, message: "User already exists"})
        }

        const hashedPassword = await bcryptjs.hash(password, 10)
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString()
        const verificationTokenExpiresAt =  Date.now() + 24 * 60 * 60 * 1000 
        
        const user = new User({ 
            email, 
            password: hashedPassword,
            name, 
            verificationToken,
            verificationTokenExpiresAt 
        })

        await user.save()

        generateTokenAndSetCookie(res, user._id)
        
        await sendVerficationEmail(user.email, user.verificationToken)

        res.status(201).json({success:true, message:"User created successfully", user: {...user._doc, password: undefined} })

        
    } catch (error) {
        console.log("Error in signing up:",error);
        res.status(500).json({success:false, message:"Server error"})
        
    }



}

export const verifyEmail = async (req, res) => {
    const { code } = req.body
    try {
        const user = await User.findOne({
            verificationToken:code,
            verificationTokenExpiresAt: { $gt: Date.now() }
        })

        if(!user){
            return res.status(400).json({success:false, message:"Invalid or Expired verification code"})
        }

        user.isVerified = true
        user.verificationToken = undefined
        user.verificationTokenExpiresAt = undefined

        await user.save()

        await sendWelcomeEmail(user.email, user.name)

        res.status(200).json({success:true, message:"Email verified successfully", user: {...user._doc, password:undefined}})
        
    } catch (error) {
        console.log("Error Verifying Email:" , error);
        res.status(500).json({success:false, message:"Server error"})
    }
}


export const login = async(req,res) => {
    const { email, password } = req.body

    try {
        if( !email || !password ){
            return res.status(400).json({ success:false, message:"Please provide all fields"})
        }

        const user = await User.findOne({ email })

        if(!user){
            return res.status(400).json({ success:false, message:"Invalid credentials"})
        }

        const isPasswordValid = await bcryptjs.compare(password, user.password)

        if(!isPasswordValid){
            return res.status(400).json({ success: false, message: "Incorrect Password"})
        }

        generateTokenAndSetCookie(res, user._id)

        user.lastLogin = new Date()

        user.save()

        return res.status(200).json({ success:true, message:"Logged in successfully", user: {...user._doc, password: undefined}})


    } catch (error) {
        console.log("Error in logging in:", error);
        
        res.status(500).json({success:false, message:"Server Error"})
    }
}


export const logout = async(req,res) => {
    res.cookie("token", "", {
        httpOnly: true,
        secure: true,   // Required for Vercel & HTTPS
        sameSite: "none", // Required for cross-origin cookies
        expires: new Date(0), // Expire immediately
      });
    res.json({success:true, message:"logged out successfully"})
}

export const forgotPassword = async(req, res) => {
    const { email } = req.body

    try {
        if(!email){
            return res.status(400).json({ success: false, message:"Invalid credentials"})
        }
        const user = await User.findOne({ email })

        if(!user){
            return res.status(400).json({ success: false, message:"User not found"})
        }

        const resetToken = crypto.randomBytes(20).toString("hex")
        const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000   // 1hour 

        user.resetPasswordToken = resetToken
        user.resetPasswordExpiresAt = resetTokenExpiresAt

        await user.save()
    
        await sendForgotPasswordEmail(user.email, `https://mern-auth-app-pi.vercel.app/reset-password/${resetToken}`)
    
        res.status(200).json({ success:true, message: "Email sent to reset password"})

    } catch (error) {
        console.log("Error sending Password reset email",error);
        res.status(500).json({ success: false, message: "Server Error"})
        
    }
}

export const resetPassword = async (req, res) => {
    const { password } = req.body
    const token = req.params.token

    try {

        const user = await User.findOne({resetPasswordToken: token, resetPasswordExpiresAt: { $gt: Date.now() }})

        if (!user) {
            return res.status(400).json({ success:false, message: "Invalid or Reset link expired"})
        }


        const hashedPassword = await bcryptjs.hash(password, 10)

        user.password = hashedPassword
        user.resetPasswordToken = undefined
        user.resetPasswordExpiresAt = undefined

        await user.save()

        await sendResetPasswordSuccessEmail(user.email)

        res.status(200).json({ success:true, message: "Password reset successfull", user: {...user._doc, password: undefined}})
    } catch (error) {
        console.log("Error in password reset", error);
    }

}

