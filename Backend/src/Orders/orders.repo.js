import cardModel from "./card.schema.js";
import orderModel from "./order.schema.js";
import productModel from "../products/product.schema.js"
import paymentModel from "./payment.schema.js"
import mongoose from "mongoose";

export default class OrdersRepo {
    // Create cart items
    async createCard(data) {
        try {
            const result = await this.checkCard(data.user, data.product);

            if (result) {
                const update = await this.updateQuantity(result._id, 1);
                return {
                    message:
                        "You have already added this item to the cart, so we increased the quantity. If not needed, please decrease it yourself.",
                    update,
                };
            } else {
                const cart = new cardModel(data);
                return await cart.save();
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    async updateQuantity(id, quantity) {
        try {
            return await cardModel.findByIdAndUpdate(
                id,
                { $inc: { quantity: quantity } },
                { new: true }
            );
        } catch (error) {
            console.log(error.message);
        }
    }

    async readCards(userId) {
        try {
            return await cardModel.find({ user: userId });
        } catch (error) {
            console.log(error.message);
        }
    }

    async deleteCards(cardId) {
        try {
            return await cardModel.findByIdAndDelete(cardId);
        } catch (error) {
            console.log(error.message);
        }
    }

    async checkCard(userId, productId) {
        try {
            return await cardModel.findOne({
                user: userId,
                product: productId,
            });
        } catch (error) {
            console.log(error.message);
        }
    }

    async deleteAll(userId) {
        try {
            return await cardModel.deleteMany({ user: userId });
        } catch (error) {
            console.log(error.message);
        }
    }

    //create orders

    async createorders(order) {
        const session = await mongoose.startSession();

        try {
            session.startTransaction();

            const EachCardTotal = await cardModel
                .find({ user: order.userId })
                .session(session);
            if (!EachCardTotal.length) {
                throw new Error("Cart is empty");
            }
            for (let card of EachCardTotal) {
                let product = await productModel.findById(card.product).session(session);
                if (!product) {
                    throw new Error("Product not found...")
                }
                let total = card.quantity * product.price;
                if (product.stock < card.quantity) {
                    throw new Error("Insufficient stock");
                }
                await productModel.findByIdAndUpdate(
                    card.product,
                    { $inc: { stock: -card.quantity } },
                    { session }
                );

                await cardModel.findByIdAndUpdate(
                    card._id,
                    { $set: { total: total } },
                    { session }
                );
            }

            const CreateOrders = await cardModel
                .find({ user: order.userId })
                .session(session);

            for (let orderItem of CreateOrders) {
                let data = {
                    userId: orderItem.user,
                    productId: orderItem.product,
                    quantity: orderItem.quantity,
                    price: orderItem.price,
                    totalAmount: orderItem.total
                };
                //order created
                let orderDoc = new orderModel(data);
                await orderDoc.save({ session });
            }
            let orderID = [];
            EachCardTotal.forEach((card) => {
                orderID.push(card._id);
            })
            if (orderID.length !== 0) {
                await cardModel.deleteMany({ _id: { $in: orderID } }, { session })
            }
            await session.commitTransaction();
            console.log("Transaction committed");
        }
        catch (error) {
            await session.abortTransaction();
            console.log("Transaction aborted");
            throw error;
        }
        finally {
            session.endSession();
        }
    }

    async createPayment(paymentData) {
        try {
            const totalOrders = await orderModel.find({ userId: paymentData.userId });
            if (!totalOrders.length) {
                throw new Error("No orders found for this user");
            }
            let finalAmount = 0;
            const storeOrders = [];

            for (const order of totalOrders) {
                finalAmount += order.totalAmount;
                storeOrders.push(order._id);
            }

            const paymentDoc = new paymentModel({//order not matters it can map to schema
                ...paymentData,
                amount: finalAmount,// server calculated
                orders: storeOrders,// server calculated
            });
            const finalPayment = await paymentDoc.save();
            await orderModel.updateMany({ _id: { $in: storeOrders } }, { $set: { paymentId: finalPayment._id } })
            await orderModel.updateMany(
                { _id: { $in: storeOrders } },
                { $set: { status: "Shipped" } }
            );

            return finalPayment;

        } catch (error) {
            console.log("Payment creation error:", error.message);

        }
    }

}
