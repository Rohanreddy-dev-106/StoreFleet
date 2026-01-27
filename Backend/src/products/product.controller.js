import { APIResponse } from "../util/api.response.js";
import { ApiError } from "../util/api.error.js";
import Productrepo from "./product.repo.js";

export default class Productcontroller {
    _Productrepo;

    constructor() {
        this._Productrepo = new Productrepo();
    }

    async Createproduct(req, res, next) {
        try {
            const data = req.body;
            data.createdBy = req.user?.UserID;

            const result = await this._Productrepo.createproduct(data);
            return res
                .status(200)
                .json(new APIResponse(200, "product created...", result));
        } catch (error) {
            return res
                .status(404)
                .json(new ApiError(404, "product creation Failed", error.message));
        }
    }

    async UpdateProduct(req, res, next) {
        try {
            const { id } = req.params;
            const { data } = req.body;

            if (data.createdBy.toString() !== req.user?.UserID.toString()) {
                return res
                    .status(404)
                    .json(
                        new ApiError(
                            404,
                            "permission denied only created user can update..."
                        )
                    );
            } else {
                await this._Productrepo.updateproduct(id, data);
                return res
                    .status(201)
                    .json(new APIResponse(201, "Updated success"));
            }
        } catch (error) {
            return res
                .status(404)
                .json(new ApiError(404, "Update Failed", error.message));
        }
    }

    async Readproduct(req, res, next) {
        try {
            const { id } = req.params;

            const result = await this._Productrepo.readproducts(id);
            return res
                .status(200)
                .json(new APIResponse(200, "product fetched...", result));
        } catch (error) {
            return res
                .status(404)
                .json(new ApiError(404, "product not found", error.message));
        }
    }

    async DeleteProduct(req, res, next) {
        try {
            const { id } = req.params;
            const product = await this._Productrepo.findbyid(id);

            if (product.createdBy.toString() !== req.user.UserID.toString()) {
                return res
                    .status(404)
                    .json(
                        new ApiError(
                            404,
                            "permission denied only created user can delete..."
                        )
                    );
            }
            else {
                await this._Productrepo.deleteproduct(id);
                return res
                    .status(200)
                    .json(new APIResponse(200, "product deleted successfully"));
            }
        } catch (error) {
            return res
                .status(404)
                .json(new ApiError(404, "delete failed", error.message));
        }
    }
}
