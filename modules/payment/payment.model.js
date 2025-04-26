const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/sequelize.config");

const Payment = sequelize.define("payment", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    status: { type: DataTypes.BOOLEAN, defaultValue: false },
    amount: { type: DataTypes.DECIMAL },
    // get refrenc for problems of payment
    refId: { type: DataTypes.STRING, allowNull: true },
    authority: { type: DataTypes.STRING, allowNull: true },
    userId: { type: DataTypes.INTEGER, allowNull: true },
    orderId: { type: DataTypes.INTEGER, allowNull: true },
}, {
    modelName: "payment",
    createdAt: "created_at",
    updatedAt: false
});

module.exports = {
    Payment
}