const express = require('express');
const { sequelize } = require('./config/sequelize.config');
const { initDataBase } = require('./config/models.initial');
const { productRoutes } = require('./modules/product/product.routes');
require('dotenv').config();
async function main() {
    // creating express application
    const app = express();
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }));
    // db connection
    await initDataBase()
    // using routes
    app.use("/product", productRoutes);
    // not found...
    app.use((req, res, next) => {
        return res.status(404).json({
            message: "Not Found Route"
        })
    })
    // ejs and fornt
    app.set('view engine', 'ejs');
    app.get('/', function (req, res) {
        res.render('pages/products');
    });
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