import express from "express";
import Managementcontroller from "./management.controller.js";
import jwtAuth from "../middlewares/jwt.auth.js";

const managementRouter=express.Router();

const management=new Managementcontroller();






export default managementRouter;

