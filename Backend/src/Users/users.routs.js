import express from "express";
import Usercontroller from "./users.controller.js";
const userRouts=express.Router();
const userControler=new Usercontroller();

userRouts.post("/register",(req,res,next)=>{
    userControler.registation(req,res,next);
})




export default userRouts;