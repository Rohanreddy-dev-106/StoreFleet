import { redis } from "../services/redis.io.js";
import nodemailer from "nodemailer";
import crypto from "crypto";
import { ApiError } from "./api.error.js";
async function SendOtp(req, res, next) {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).send("Email is required");
        }


        const otp = crypto.randomInt(100000, 1000000).toString();

        await redis.set(`otp:${email}`, otp, "EX", 300);

        const transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false,
            auth: {
                user: "dolly97@ethereal.email",
                pass: "q3ZMrhUTDuPqrV11Vj",
            },
        });

        const message = {
            from: "baron.abshire@ethereal.email",
            to: email,
            subject: "Your OTP Code",
            text: `Your OTP code is ${otp}`,
            html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>OTP Verification</title>
</head>
<body style="margin:0; padding:0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #ffeef8 0%, #fff5f9 100%);">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 8px 32px rgba(219,39,119,0.15);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #ec4899 0%, #db2777 100%); padding:35px 30px; text-align:center; color:#ffffff;">
              <h1 style="margin:0; font-size:32px; font-weight:600; letter-spacing:-0.5px;">Storefleet</h1>
              <p style="margin:8px 0 0; font-size:15px; opacity:0.95; font-weight:300;">Verify your account</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 35px; color:#1f2937;">
              <h2 style="margin-top:0; color:#db2777; font-size:24px; font-weight:600;">Welcome to Storefleet! 🎉</h2>
              <p style="font-size:16px; line-height:1.7; color:#4b5563; margin:20px 0;">
                We're excited to have you on board! To complete your registration and start shopping, please verify your email address using the code below.
              </p>

              <!-- OTP Box -->
              <div style="margin:35px 0; text-align:center;">
                <div style="background: linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%); border:2px dashed #f9a8d4; border-radius:12px; padding:25px; display:inline-block;">
                  <p style="margin:0 0 10px; font-size:13px; color:#9d174d; font-weight:600; text-transform:uppercase; letter-spacing:1px;">Your Verification Code</p>
                  <span style="display:block; color:#db2777; font-size:42px; letter-spacing:8px; font-weight:700; font-family:monospace;">
                    ${otp}
                  </span>
                </div>
              </div>

              <div style="background:#fef3f9; border-left:4px solid #f9a8d4; padding:16px 20px; border-radius:6px; margin:25px 0;">
                <p style="margin:0; font-size:14px; color:#831843; line-height:1.6;">
                  ⏱️ This code will expire in <strong>5 minutes</strong><br/>
                  🔒 Keep this code private and don't share it with anyone
                </p>
              </div>

              <p style="font-size:15px; color:#6b7280; line-height:1.6; margin:25px 0 0;">
                If you didn't create an account with Storefleet, please disregard this email.
              </p>
            </td>
          </tr>

          <!-- Call to Action -->
          <tr>
            <td style="padding:0 35px 35px;">
              <div style="text-align:center; padding:25px; background:linear-gradient(135deg, #fdf2f8 0%, #ffffff 100%); border-radius:10px;">
                <p style="margin:0 0 12px; color:#6b7280; font-size:14px;">Need help?</p>
                <a href="#" style="color:#db2777; text-decoration:none; font-weight:600; font-size:15px;">Contact Support →</a>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%); padding:25px; text-align:center; font-size:13px; color:#9ca3af;">
              <p style="margin:0 0 8px;">
                © ${new Date().getFullYear()} <strong style="color:#db2777;">Storefleet</strong> – Your Premium Shopping Destination
              </p>
              <p style="margin:0; font-size:12px;">
                Happy Shopping! 🛍️💕
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html> `

        };

        await transporter.sendMail(message);

        return res.status(200).json({
            message: "OTP sent to email"
        });

    } catch (error) {
        const message=new ApiError(500,"Failed to send OTP,",error.message);
        res.status(500).json(message);
    }
}

export default SendOtp;
