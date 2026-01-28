import productmodel from "../products/product.schema.js";

export default class Managementrepo {
    async searchproducts(name, description, category) {
        try {
            const filter = name || description || category;
            const products = await productmodel.find({ $text: { $search: filter } });
            return products;
        }
        catch (error) {
            console.log(error.message);

        }
    }
    async getallproducts() {
        try {
            return await productmodel.find({});
        } catch (error) {
            console.log(error.message);
        }
    }
    async productdetails(productName, id) {
        try {
            const product = await productmodel.findOne({
                name: productName,
                _id: id,
            });
            return product;
        } catch (error) {
            console.log(error.message);
        }
    }
    async filterproductbycat(category) {
        try {
            const products = await productmodel.find({ category: category });
            return products;
        } catch (error) {
            console.log(error.message);
        }
    }
    async filterproductbyrating(minprice, maxprice) {
        try {
            const products = await productmodel.find({
                $and: [{ price: { $gte: minprice } }, { price: { $lte: maxprice } }],
            });
            return products;
        } catch (error) {
            console.log(error.message);
        }
    }
    async Totalproducts(category, limit, skip) {
        try {

            const total = await productmodel.countDocuments({ category: category }).limit(limit).skip((skip - 1) * limit);
            return total;
        }
        catch (error) {
            console.log(error.message);

        }
    }
}
// async filterproductbyprice(){}//not implemented at

