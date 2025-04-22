const { OrderStatus } = require("../../common/constant/order.const");
const { getUserBasketById } = require("../basket/basket.service");
const { Order, OrderItems } = require("../order/order.model");
const { Payment } = require("./payment.model");

async function paymentBasketHandler(req, res, next) {
    try {
        const { id: userId } = req.user;
        const { basket, totalAmount, finalAmount, totalDiscount } = await getUserBasketById(userId);
        const payment = await Payment.create({
            userId,
            amount: finalAmount,
            status: false,
        });
        const order = await Order.create({
            userId,
            paymentId: payment.id,
            total_amount: totalAmount,
            final_amount: finalAmount,
            discount_amount: totalDiscount,
            status: OrderStatus.Pending,
            address: "Tehran - shahriar - baharestan - f17",
        });
        payment.orderId = order.id;
        await payment.save();
        let orderList = [];
        for (const item of basket) {
            orderList.push({
                orderId: order.id,
                productId: item?.productId,
                sizeId: item?.sizeId,
                colorId: item?.colorId,
                count: item?.count
            });
            await OrderItems.bulkCreate(orderList);
            return res.json({
                paymentUrl: "https://zarinpal.com/payment"
            })
        }
    } catch (error) {
        next(error)
    }
}

module.exports = {
    paymentBasketHandler
}