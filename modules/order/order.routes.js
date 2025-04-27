const { Router } = require("express");
const { AuthGuard } = require("../auth/auth.guard");
const { getMyOrdersHandler, getOneOrderByIdHandler } = require("./order.service");

const router = Router();
router.get("/", AuthGuard, getMyOrdersHandler)
router.get("/:id", AuthGuard, getOneOrderByIdHandler)
module.exports = {
    orderRoutes: router
}