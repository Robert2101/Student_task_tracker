import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/jwt.js";
const login = async (req,res)=>{
    const {email, password} = req.body;
    try{
        if(!email || !password){
            return res.status(400).json({message : "Please fill all the fields"});
        }

        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({message : "Invalid credentials"});
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if(!isPasswordCorrect){
            return res.status(400).json({message : "Invalid credentials"});
        }
        generateToken(user._id, res);

        res.status(200).json({message : "Login successful", id: user._id, name: user.fullName, email: user.email});
    } catch(err){
        console.error("error in login:", err);
        return res.status(500).json({message : "Internal server error"});
    }
}

const register = async (req, res) => {
    const {name , email , password}=req.body;
    try{
        if(!name || !email || !password){
            return res.status(400).json({message : "Please fill all the fields"});
        }
        if(!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)){
            return res.status(400).json({message : "Invalid email format"});
        }
        if(password.length < 6){
            return res.status(400).json({message : "Password must be at least 6 characters long"});
        }
        const user = await User.findOne({email});
        if(user){
            return res.status(400).json({message : "User already exists"});
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = User({
            name,
            email,
            password: hashedPassword
        })

        if(newUser){
            await newUser.save();
            generateToken(newUser._id, res);
            return res.status(201).json({message : "User created successfully", id: newUser._id , name: newUser.fullName, email: newUser.email});
        }else{
            return res.status(400).json({message : "User creation failed"});
        }
    }catch(err){
        console.error("error in signup:", err);
        return res.status(500).json({message : "Internal server error"});
    }
}

const logout = (req,res)=>{
    try{
        res.cookie("jwt", "",{maxAge : 0});
        res.status(200).json({message : "Logout successful"});
    }catch(err){
        console.error("error in logout:", err);
        return res.status(500).json({message : "Internal server error"});
    }
}

const checkUser = async (req, res) => {
    try {

        const user = await User.findById(req.userId).select("name email");
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            id: user._id,
            name: user.name,
            email: user.email
        });
    } catch (err) {
        console.error("❌ Error in checkUser:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export { login, register, logout, checkUser };