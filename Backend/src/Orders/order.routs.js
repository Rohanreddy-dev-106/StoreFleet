import express from "express";
import Ordercontroller from "./order.controller.js";
import jwtAuth from "../middlewares/jwt.auth.js"

const router = express.Router();
const cardController = new Ordercontroller();

router.post("/create", jwtAuth, (req, res, next) =>
    cardController.CreateCard(req, res, next)
);

router.get("/getall", jwtAuth, (req, res, next) =>
    cardController.ReadCard(req, res, next)
);
router.put("/update", jwtAuth, (req, res, next) =>
    cardController.UpdateCard(req, res, next)
);

router.delete("/delete/:id", jwtAuth, (req, res, next) =>
    cardController.DeleteCard(req, res, next)
);

router.delete("/deleteall", jwtAuth, (req, res, next) =>
    cardController.ClearCard(req, res, next)
);

export default router;
