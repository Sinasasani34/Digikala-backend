const express = require('express');
const { sequelize } = require('./config/sequelize.config');
const { initDataBase } = require('./config/models.initial');
const { productRoutes } = require('./modules/product/product.routes');
const { authRoutes } = require('./modules/auth/auth.routes');
const { baksetRoutes } = require('./modules/basket/basket.routes');
const { paymentRoutes } = require('./modules/payment/payment.routes');
const { orderRoutes } = require('./modules/order/order.routes');
const { rbacRoutes } = require('./modules/RBAC/rbac.routes');
require('dotenv').config();
async function main() {
    // creating express application
    const app = express();
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }));
    // db connection
    await initDataBase()
    // using routes
    app.use("/auth", authRoutes);
    app.use("/product", productRoutes);
    app.use("/basket", baksetRoutes);
    app.use("/payment", paymentRoutes);
    app.use("/order", orderRoutes);
    app.use("/rbac", rbacRoutes)
    // not found...
    app.use((req, res, next) => {
        return res.status(404).json({
            message: "Not Found Route"
        })
    })
    // error handeling
    app.use((err, req, res, next) => {
        const status = err?.status ?? err?.statusCode ?? 500;
        let message = err?.message ?? "InternalServerError";
        if (err?.message == "ValidationError") {
            const { detailes } = err;
            message = detailes?.body?.[0]?.message ?? "InternalServerError"
        }
        return res.status(status).json({
            message
        })
    })
    let port = process.env.PORT ?? 3000;
    app.listen(port, () => {
        console.log(`server port ${port} => http://localhost:${port}`);
    })
}
main();