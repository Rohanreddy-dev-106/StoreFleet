import { ApiError } from "../util/api.error.js";
import { APIResponse } from "../util/api.response.js";
import Managementrepo from "./management.repo.js";

export default class Managementcontroller{
    _managementrepository;
    constructor(){
        this._managementrepository=Managementrepo();
    }
}