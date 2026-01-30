import mongoose, { Schema } from "mongoose";

const PaymentSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        orders: [{ type: mongoose.Schema.type.ObjectId, ref: "Order" }],

        amount: {
            type: Number,
            required: true,
        },

        currency: {
            type: String,
            default: "INR",
        },

        paymentMethod: {
            type: String,
            enum: ["UPI", "CARD", "NET_BANKING", "WALLET", "COD"],
            required: true,
        },

        paymentGateway: {
            type: String,
            enum: ["RAZORPAY", "STRIPE", "PAYPAL"],
        },
        status: {
            type: String,
            enum: ["PENDING", "SUCCESS", "FAILED", "REFUNDED"],
            default: "PENDING",
        },
        paidAt: {
            type: Date,
        },

        refundedAt: {
            type: Date,
        },
    },
    { timestamps: true }
);

PaymentSchema.index({ orderId: 1, userId: 1 });

export default mongoose.model("Payment", PaymentSchema);
