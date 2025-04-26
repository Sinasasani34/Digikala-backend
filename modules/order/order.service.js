const createHttpError = require("http-errors");
const { OrderStatus } = require("../../common/constant/order.const");
const { Order } = require("./order.model");

async function getMyOrdersHandler(req, res, next) {
    try {
        const { id: userId } = req.user;
        const { status } = req.query;
        if (!status || Object.values(OrderStatus).includes(status)) {
            throw createHttpError(400, "send valid status");
        }
        const orders = await Order.findAll({
            where: {
                status
            },
        });
        return res.json(orders);
    } catch (error) {
        next(error)
    }
}

module.exports = {
    getMyOrdersHandler
}