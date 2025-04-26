const { Router } = require("express");
const { AuthGuard } = require("../auth/auth.guard");
const { getMyOrdersHandler } = require("./order.service");

const router = Router();
router.get("/", AuthGuard, getMyOrdersHandler)
module.exports = {
    orderRoutes: router
}