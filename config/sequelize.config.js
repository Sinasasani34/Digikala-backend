const { config } = require("dotenv");
const { Sequelize } = require("sequelize");
config();
// db config
const sequelize = new Sequelize({
    dialect: "mariadb",
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    logging: false,
});

// is connecting to db or not
sequelize.authenticate().then(() => {
    console.log("Connected to mariadb");
}).catch((err) => {
    console.log("cannot connect to db");
})

module.exports = {
    sequelize
}