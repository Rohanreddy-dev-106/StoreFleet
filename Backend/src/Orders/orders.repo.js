import cardModel from "./card.schema.js";
import orderModel from "./order.schema.js";

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

}
