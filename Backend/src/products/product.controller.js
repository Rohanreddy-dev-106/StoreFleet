import { APIResponse } from "../util/api.response.js";
import { ApiError } from "../util/api.error.js";
import Productrepo from "./product.repo.js";

export default class Productcontroller{
    _Productrepo;
    constructor(){
        this._Productrepo=new Productrepo();
    }
    async Createproduct(req,res,next){

    }
    async UpdateProduct(req,res,next){

    }
    async Readproduct(req,res,next){

    }
    async DeleteProduct(req,res,next){
        
    }
}

