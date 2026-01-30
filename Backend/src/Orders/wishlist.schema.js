import mongoose, { Schema } from "mongoose";

const WishlistSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true, // one wishlist per user
            index: true,
        },

        products: [
            {
                type: Schema.Types.ObjectId,
                ref: "Product",
            },
        ],
    },
    { timestamps: true }
);

WishlistSchema.index({ userId: 1 });

export default mongoose.model("Wishlist", WishlistSchema);
