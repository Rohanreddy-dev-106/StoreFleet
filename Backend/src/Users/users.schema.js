import mongoose, { Schema } from "mongoose";

const usersSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,      // unique: true ensures that each email and username can be registered only once
        // Removing it will allow duplicate users in the database
        trim: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: [
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            "Please enter a valid email"
        ]
    },

    password: {
        type: String,
        required: true,
        match: [
            /^.{6,}$/,
            "Password must be at least 6 characters"
        ]
    },

    role: {
        type: String,
        required: true,
        enum: ["user", "admin","manager"]
    },
    refreshToken: { type: String }

},
    { timestamps: true }
);

export default mongoose.model("User", usersSchema);
