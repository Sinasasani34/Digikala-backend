const createHttpError = require("http-errors");
const { OrderStatus } = require("../../common/constant/order.const");
const { Order, OrderItems } = require("./order.model");
const { Product, ProductColor, ProductSize } = require("../product/product.model");

async function getMyOrdersHandler(req, res, next) {
    try {
        const { id: userId } = req.user;
        const { status } = req.query;
        if (!status || Object.values(OrderStatus).includes(status)) {
            throw createHttpError(400, "send valid status");
        }
        const orders = await Order.findAll({
            where: {
                status,
                userId
            },
        });
        return res.json(orders);
    } catch (error) {
        next(error)
    }
}
async function getOneOrderByIdHandler(req, res, next) {
    try {
        const { id: userId } = req.user;
        const { id } = req.params;

        const order = await Order.findOne({
            where: {
                id,
                userId
            },
            include: [
                {
                    model: OrderItems, as: "items", include: [
                        { model: Product, as: "product" },
                        { model: ProductColor, as: "color" },
                        { model: ProductSize, as: "size" },
                    ]
                }
            ]
        });
        if (!order) throw createHttpError(404, "Not found order");
        return res.json({
            order
        });
    } catch (error) {
        next(error)
    }
}

async function setPacketStatusToOrder(req, res, next) {
    const { id } = req.params;
    const order = await Order.findByPk(id);
    if (!order) throw createHttpError(404, "order not found");
    if (order.status !== OrderStatus.InProcess) throw createHttpError(400, "order status should be in process");
    order.status = OrderStatus.Packed;
    await order.save();
    return res.json({
        message: "Set order to packet"
    })

}
async function setInTransitStatusToOrder(req, res, next) {
    const { id } = req.params;
    const order = await Order.findByPk(id);
    if (!order) throw createHttpError(404, "order not found");
    if (order.status !== OrderStatus.Packed) throw createHttpError(400, "order status should be packet");
    order.status = OrderStatus.InTransit;
    await order.save();
    return res.json({
        message: "Set order to transit"
    })

}
async function setCanceledStatusToOrder(req, res, next) {
    const { id } = req.params;
    const { reason } = req.params;
    const order = await Order.findByPk(id);
    if (!order) throw createHttpError(404, "order not found");
    if ([OrderStatus.Pending, OrderStatus.Delivery, OrderStatus.Canceled].includes(order.status)) throw createHttpError(400, "please select correct order to cancel");
    order.status = OrderStatus.Canceled;
    order.reason = reason;
    await order.save();
    return res.json({
        message: "order canceled successfuly"
    })

}
async function setDeliverydStatusToOrder(req, res, next) {
    const { id } = req.params;
    const order = await Order.findByPk(id);
    if (!order) throw createHttpError(404, "order not found");
    if (order.status !== OrderStatus.InTransit) throw createHttpError(400, "order status should be in transit");
    order.status = OrderStatus.Delivery;
    await order.save();
    return res.json({
        message: "order delivry to cunstomer"
    })

}

module.exports = {
    getMyOrdersHandler,
    getOneOrderByIdHandler,
    setPacketStatusToOrder,
    setCanceledStatusToOrder,
    setDeliverydStatusToOrder,
    setInTransitStatusToOrder
}