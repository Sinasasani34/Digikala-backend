const { Router } = require("express");
const { AuthGuard } = require("../auth/auth.guard");
const { addToBasketHandler } = require("./basket.service");

const router = Router();

router.post("/add", AuthGuard, addToBasketHandler)
module.exports = {
    baksetRoutes: router
}