import Usermodel from "./users.schema.js";
import profilemodel from "./user.profile.schema.js";
import { ApiError } from "../util/api.error.js";
import bcrypt from "bcrypt";

export default class Userrepo {

    async Register(data) {
        try {
            data.password = await bcrypt.hash(data.password, 10);
            const user = new Usermodel(data);
            return await user.save();
        } catch (error) {
            throw new ApiError(400, error.message);
        }
    }

    async ResetPassword(id, newpassword) {
        try {
            if (!id || !newpassword) {
                throw new ApiError(400, "User ID and new password are required");
            }

            const hashedPassword = await bcrypt.hash(newpassword, 10);

            const user = await Usermodel.findByIdAndUpdate(
                id,
                { $set: { password: hashedPassword } },
                { new: true }
            );

            if (!user) {
                throw new ApiError(404, "User not found");
            }

            return user;
        } catch (error) {
            throw error;
        }
    }

    async FindByEmail(email_recived) {
        try {
            const user = await Usermodel.findOne({email:email_recived});
            if (!user) {
                throw new ApiError(404, "User not found");
            }
            return user;
        } catch (error) {
            throw error;
        }
    }

    async CreateProfile(data) {
        try {
            const profile = new profilemodel(data);
            return await profile.save();
        } catch (error) {
            throw new ApiError(400, error.message);
        }
    }

    async UpdateProfile(id, data) {
        try {
            const filter_data = {};

            for (const key in data) {
                if (data[key] !== undefined) {
                    filter_data[key] = data[key];
                }
            }

            const profile = await profilemodel.findByIdAndUpdate(
                id,
                { $set: filter_data },
                { new: true }
            );

            if (!profile) {
                throw new ApiError(404, "Profile not found");
            }

            return profile;
        } catch (error) {
            throw error;
        }
    }

    async Storerefreshtoken(id, token) {

    }
    async Getrefreshtoken(id) {

    }
    async Clearrefreshtoken(id) {

    }
    async Logout() {

    }
}

