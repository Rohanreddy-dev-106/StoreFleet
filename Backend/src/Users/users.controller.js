import { APIResponse } from "../util/api.response.js";
import { ApiError } from "../util/api.error.js";
import { redis } from "../services/redis.io.js";
import usersrepo from "./users.repo.js";
import generateAccessToken from "../util/accesstoken.create.js";
import generateRefreshToken from "../util/refreshtoken.create.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export default class Usercontroller {
    _userrepository;
    constructor() {
        this._userrepository = new usersrepo()
    }
    async registation(req, res, next) {
        try {
            const data = req.body;
            const isVerified = await redis.get(`email_verified:${data.email}`);
            if (!isVerified) {
                return res.status(400).json(new ApiError(400, "Email not verified"));
            }
            await this._userrepository.Register(data);
            res.status(201).json(new APIResponse(201, "user is Registered.."));
        }
        catch (error) {
            console.log("Signup Error:", error.message);
            res.status(500).json(new ApiError(500, "Signup Error", error.message));
        }
    }
    async login(req, res, next) {
        try {
            const { email, password } = req.body;

            // Try to get user from Redis cache
            let cachedUser = await redis.get(`userStore:${email}`);
            let user = null;

            if (cachedUser) {
                user = JSON.parse(cachedUser);
            }
            else {
                // Fetch user from DB if not in Redis
                user = await this._userrepository.Findemail(email);
                if (!user) return res.status(404).send("User not found");

                // Store user in Redis for future logins
                await redis.set(`userStore:${email}`, JSON.stringify(user));
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(404).send("User not found");
            }
            else {
                //Create JWT tokens
                const accesstoken = generateAccessToken(user);
                const refreshtoken = await generateRefreshToken(user);
                console.log("Storing refresh token for user id:", user._id);
                console.log("Refresh token:", refreshtoken);

                // Access token: 15 minutes
                const ACCESS_COOKIE_EXPIRE = 15 * 60 * 1000;

                // Refresh token: 7 days
                const REFRESH_COOKIE_EXPIRE = 7 * 24 * 60 * 60 * 1000;


                // Store token in cookie
                res.cookie("jwtToken", accesstoken, {
                    maxAge: ACCESS_COOKIE_EXPIRE,
                    httpOnly: true,
                });

                res.cookie("refreshToken", refreshtoken, {
                    maxAge: REFRESH_COOKIE_EXPIRE,
                    httpOnly: true,
                });

                return res.status(200).json(new APIResponse(200, "Login successful"));
            }
        }
        catch (error) {
            return res.status(404).json(new ApiError(404, "Login is Failed", error.message))
        }
    }
    async CreareProfile(req, res, next) {
        try {
            const profile = req.body;
            const responce = await this._userrepository.CreateProfile(profile);
            return res.status(201).json(new APIResponse(201, "profile is created"))
        }
        catch (err) {
            return res.status(404).json(new ApiError(404, "profile is not created"))
        }
    }
    async Getprofilr(req, res, next) {
        try {
            const data=await this._userrepository.getprofile(req.user.UserID);
            return res.status(200).json({"message":data});
        }
        catch (error) {
            return res.status(404).json(new ApiError(404, "profile is not fetching...", error.message))
        }
    }
    async Profileupdate(req, res, next) {
        try {
            const data = req.body;
            console.log("UserID from token:", req.user);

            const updatedprofile = await this._userrepository.UpdateProfile(req.user.UserID, data);
            return res.status(201).json(new APIResponse(201, "Profile is updated.."))
        }
        catch (err) {
            return res.status(404).json(new ApiError(404, "profile is not updated..", err.message))
        }
    }
    async CreatenewRefreshTokenAndAccessToken(req, res, next) {
        try {
            const refreshToken = req.cookies.refreshToken;

            const refresh_paylode = jwt.verify(
                refreshToken,
                process.env.REFRESHTOKEN_KEY
            );

            const id = refresh_paylode.UserID;

            const DatabaseRefreshToken = await this._userrepository.GetRefreshToken(id);

            if (refreshToken !== DatabaseRefreshToken) {
                return res.status(404).send("Token not found");
            }

            const user = await this._userrepository.FindUser(id);

            const accesstoken = generateAccessToken(user);
            const refreshtoken = await generateRefreshToken(user);
            console.log("Storing refresh token for user id:", user._id);
            console.log("Refresh token:", refreshtoken);

            // Access token: 15 minutes
            const ACCESS_COOKIE_EXPIRE = 15 * 60 * 1000;

            // Refresh token: 7 days
            const REFRESH_COOKIE_EXPIRE = 7 * 24 * 60 * 60 * 1000;

            res.cookie("jwtToken", accesstoken, {
                maxAge: ACCESS_COOKIE_EXPIRE,
                httpOnly: true,
            });

            res.cookie("refreshToken", refreshtoken, {
                maxAge: REFRESH_COOKIE_EXPIRE,
                httpOnly: true,
            });

            return res.status(200).json(new APIResponse(200, "Token is found.."))

        } catch (error) {
            return res.status(401).json(new ApiError(401, "Token not found..", error.message))
        }
    }
    async Logout(req, res, next) {
        try {
            await this._userrepository.Clearrefreshtoken(req.user.UserID);

            res.clearCookie("jwtToken", {
                httpOnly: true,
            });
            res.clearCookie("refreshToken", {
                httpOnly: true,
            });


            return res.status(200).send({
                message: "Logout successful"
            });

        } catch (error) {
            console.log("Logout Error:", error.message);
            res.status(500).send("Logout failed");
        }
    }
}


