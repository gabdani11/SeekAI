import userModel from '../model/user.model.js';
import { sendEmail } from '../services/mail.service.js';
import jwt from 'jsonwebtoken'

// Register a new user
export async function register(req,res){
    const {username, email, password} = req.body;
    const  isUserExist = await userModel.findOne({email},{username});
    if(isUserExist){
        return res.status(400).json({message:'User already exist'});
    }
    const user = await userModel.create({username, email, password});

    const emailVerificationToken = jwt.sign({
        email:user.email,
    },process.env.JWT_SECRET);
    await sendEmail({
        to:email,
        subject:'Welcome to Perplexity',
        html:`<h1>Welcome to Perplexity, ${user.username}!</h1><p>Thank you for registering.
        <a href="http://localhost:3000/api/auth/verify-email?token=${emailVerificationToken}">Click here to verify your email</a>
        We're excited to have you on board!</p>`,

        text:`Welcome to Perplexity, ${user.username}! Thank you for registering. We're excited to have you on board!`
    })
    res.status(201).json({
        message:'User created successfully', 
        user});
}
//login user
export async function login(req,res){
    const {email, password} = req.body;

    const user = await userModel.findOne({
        email
    });
    if(!user){
        return res.status(400).json({message:'Invalid email or password'});

    }
    const isMatch = await user.comparePassword(password);
    if(!isMatch){
        return res.status(400).json({message:'Invalid email or password'});
    }
    if(!user.verified){ //check the email is verified or not
        return res.status(400).json({message:'Please verify your email before logging in'});
    }
    const token = jwt.sign({
        id:user._id,
        email:user.email
    },process.env.JWT_SECRET,{expiresIn:'1h'})

    res.cookie('token', token)
    res.status(200).json({message:'Login successful', success:true, user:{
        id:user._id,
        username:user.username,
        email:user.email
    }});
    
}
/**
 * @desc get-me 
 * @route GET /api/auth/me
 * @access Private
 * @header {Authorization: Bearer token}
 */

export async function getMe(req,res){
    const userId = req.user.id;
    const user = await userModel.findById(userId).select('-password');
    if(!user){
        return res.status(404).json({
            message:'User not found',
            success:false,
            err:"User not found"
        });
    }
    res.status(200).json({
        message:"User detail fetched successfully",
        success:true,
        user
    });
}
// Verify email
export async function  verifyEmail(req,res){
    const {token} = req.query;
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findOne({email:decoded.email});
        if(!user){
            return res.status(400).json({message:'Invalid token'});
        }

        if(user.verified){
            return res.status(400).json({message:'Email already verified'});
        }
        user.verified = true;
        await user.save();
        res.status(200).json({message:'Email verified successfully'});
    } catch (error) {
        res.status(400).json({message:'Invalid token'});
    }
}