import productmodel from "../products/product.schema.js";
import Deleteplease from "../util/user_admin_management.js";
import Reviewmodel from "./review.schema.js"
export default class Managementrepo {

    //search product public/admin
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
    //getallproducts only for admin/Testing
    async getallproducts() {
        try {
            return await productmodel.find({});
        } catch (error) {
            console.log(error.message);
        }
    }
    //public/admin api
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
    //public/admin
    async filterproductbycat(category) {
        try {
            const products = await productmodel.find({ category: category });
            return products;
        } catch (error) {
            console.log(error.message);
        }
    }
    //public/admin
    async filterproductbyprice(minprice, maxprice) {
        try {
            const products = await productmodel.find({
                $and: [{ price: { $gte: minprice } }, { price: { $lte: maxprice } }],
            });
            return products;
        } catch (error) {
            console.log(error.message);
        }
    }
    //maneger and admin only
    async Totalproducts(category, limit, skip) {
        try {

            const total = await productmodel.countDocuments({ category: category });
            return total;
        }
        catch (error) {
            console.log(error.message);

        }
    }
    //admin/manager
    async removeusers(userid) {
        return Deleteplease(userid);
    }
    //manager
    async removeadmin(adminid) {
        return Deleteplease(adminid);
    }
    //public/admin
    async createreview(data) {
        try {
            const exists = await Reviewmodel.countDocuments({ user: data.user, product: data.product });
            if (exists >= 1) {
                return "You have already reviewed this product.";
            }
            else {
                const review = new Reviewmodel(data);
                const savedReview = await review.save();
                if (savedReview) {
                    return await productmodel.findByIdAndUpdate(data.product, { $addToSet: { reviews: savedReview._id } }, { new: true })
                }
            }
        }
        catch (error) {
            console.log(error.message);

        }
    }
    //public/admin
    async filterproductbyprice(minrating, maxrating) {
        try {
            return await Reviewmodel.find({ rating: { $gte: minrating, $lte: maxrating } })
        }
        catch (error) {
            console.log(error.message);
        }
    }
   // TODO:Admin DashBoard
   //Per-Admin Revenue (Aggregation)
   //Per-Admin Order Status Breakdown
   //Per-Admin Daily Sale
    async totalrevenue(){
    }
    async totalorderstatus(){

    }
    async dailysale(){

    }
    async dailysaleaverage(){

    }

}


