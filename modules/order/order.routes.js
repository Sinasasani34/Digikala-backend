const { Router } = require("express");
const { AuthGuard } = require("../auth/auth.guard");
const { getMyOrdersHandler, getOneOrderByIdHandler, setPacketStatusToOrder, setInTransitStatusToOrder, setCanceledStatusToOrder, setDeliverydStatusToOrder } = require("./order.service");

const router = Router();
router.get("/", AuthGuard, getMyOrdersHandler)
router.get("/:id", AuthGuard, getOneOrderByIdHandler)
router.patch("/set-packet/:id", AuthGuard, setPacketStatusToOrder)
router.patch("/set-in-transit/:id", AuthGuard, setInTransitStatusToOrder)
router.patch("/set-delivery/:id", AuthGuard, setDeliverydStatusToOrder)
router.patch("/cancel/:id", AuthGuard, setCanceledStatusToOrder)
module.exports = {
    orderRoutes: router
}