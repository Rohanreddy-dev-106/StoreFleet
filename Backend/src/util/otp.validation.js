import { redis } from "../services/redis.io.js";
import { ApiError } from "./api.error.js";
async function VerifyOtp(req, res, next) {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            const message=new ApiError(400,"Email and OTP are required")
            return res.status(400).json(message);
        }

        const storedOtp = await redis.get(`otp:${email}`);

        if (!storedOtp) {
            const message=new ApiError(400,"OTP expired or not found")
            return res.status(400).json(message);
        }

        if (storedOtp !== otp) {
             const message=new ApiError(400,("Invalid OTP"))
            return res.status(400).json(message);
           
        }

        // OTP matched then email is verified
        // MARK EMAIL AS VERIFIED
    await redis.set(`email_verified:${email}`, "true", "EX", 600); // 10 min
    await redis.del(`otp:${email}`);


        return res.status(200).json({
            message: "Email verified successfully"
        });

    } catch (error) {
        console.log("Verify OTP Error:", error.message);
        res.status(500).send("OTP verification failed");
    }
}

export default VerifyOtp;
