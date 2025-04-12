const express = require('express');
const { sequelize } = require('./config/sequelize.config');
const { initDataBase } = require('./config/models.initial');
require('dotenv').config();
async function main() {
    const app = express();
    await initDataBase()
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }));
    // not found...
    app.use((req, res, next) => {
        return res.status(404).json({
            message: "Not Found Route"
        })
    })
    // error handeling
    app.use((err, req, res, next) => {
        const status = err?.status ?? 500;
        const message = err?.message ?? "InternalServerError";
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