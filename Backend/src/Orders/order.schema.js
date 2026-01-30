
import mongoose, { Schema } from "mongoose";

const Orders = new Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        shippingAddress: { type: mongoose.Schema.Types.ObjectId, ref: "Profile" },
        quantity: { type: Number },
        totalAmount: { type: Number },
        status: {
            type: String,
            enum: ["Pending", "Shipped", "Delivered", "Cancelled"],
            default: "Pending",
        },
    },
    { timestamps: true },
);

Orders.index({ userId: 1 });

export default mongoose.model("Order", Orders);
