import productmodel from "./product.schema.js";

export default class Productrepo {
    async createproduct(data) {
        try {
            const product = new productmodel(data);
            return await product.save();
        }
        catch (error) {
            console.log(error.message);

        }
    }
    async updateproduct(id, fields) {
        try {
            const updateData = {};
            for (let key in fields) {
                if (fields[key] !== undefined) {
                    updateData[key] = fields[key];
                }
            }
            console.log(updateData);
            
            return await productmodel.findByIdAndUpdate(id, { $set: updateData }, { new: true })


        }
        catch (error) {
            console.log(error.message);

        }

    }


    async readproducts(id) {
        try {
            return await productmodel.find({});
        } catch (error) {
            console.log(error.message);

        }
    }
    async findbyid(id) {
        try {
            return await productmodel.findById(id);
        }
        catch (error) {
            console.log(error.message);

        }
    }

    async deleteproduct(id) {
        try {
            return await productmodel.findByIdAndDelete(id)
        }
        catch (error) {
            console.log(error.message);

        }
    }
}