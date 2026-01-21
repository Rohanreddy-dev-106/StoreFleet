import { APIResponse } from "../util/api.response.js";
import { ApiError } from "../util/api.error.js";
import { redis } from "../services/redis.io.js";
import usersrepo from "./users.repo.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";


export default class Usercontroller {
    _userrepo;
    constructor() {
        this._userrepo = new usersrepo()
    }
    async registation(req, res, next) {
       
    }
    async login(req,res,next){

    }
    async Updateprofile(req,res,next){

    }
}
