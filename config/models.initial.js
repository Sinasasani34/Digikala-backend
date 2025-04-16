const { Basket } = require("../modules/basket/basket.model");
const { Discount } = require("../modules/discount/discount.model");
const { Product, ProductDetail, ProductColor, ProductSize } = require("../modules/product/product.model");
const { RefreshToken } = require("../modules/user/refreshToken.model");
const { User, Otp } = require("../modules/user/user.model");
const { sequelize } = require("./sequelize.config");

// ایجاد ارتباطات یک به یک و یک به چند
async function initDataBase() {
    // give connection for ditails(one to on);
    // product initialaiz
    Product.hasMany(ProductDetail, {
        foreignKey: "productId",
        sourceKey: "id",
        as: "details"
    });
    ProductDetail.belongsTo(Product, {
        foreignKey: "productId",
        targetKey: "id"
    });
    Product.hasMany(ProductColor, {
        foreignKey: "productId",
        sourceKey: "id",
        as: "colors"
    });
    // belongsTo = متعلق بودن به
    ProductColor.belongsTo(Product, {
        foreignKey: "productId",
        targetKey: "id"
    });
    Product.hasMany(ProductSize, {
        foreignKey: "productId",
        sourceKey: "id",
        as: "sizes"
    });
    // belongsTo = متعلق بودن به
    ProductSize.belongsTo(Product, {
        foreignKey: "productId",
        targetKey: "id"
    });
    // user profile
    // user initializ
    User.hasOne(Otp, { foreignKey: "userId", as: "otp" })
    Otp.hasOne(User, { foreignKey: "otpId", as: "otp", sourceKey: "id" })
    // have access to user from otp
    Otp.belongsTo(User, { foreignKey: "userId", targetKey: "id" })
    // refresh token
    // RefreshToken.sync();
    // basket and discount connection
    Product.hasMany(Basket, { foreignKey: "productId", sourceKey: "id", as: "basket" });
    ProductColor.hasMany(Basket, { foreignKey: "colorId", sourceKey: "id", as: "basket" });
    ProductSize.hasMany(Basket, { foreignKey: "sizeId", sourceKey: "id", as: "basket" });
    User.hasMany(Basket, { foreignKey: "userId", sourceKey: "id", as: "basket" });
    Discount.hasMany(Basket, { foreignKey: "discountId", sourceKey: "id", as: "basket" });

    Basket.belongsTo(Product, { foreignKey: "productId", targetKey: "id", as: "product" });
    Basket.belongsTo(User, { foreignKey: "userId", targetKey: "id", as: "user" });
    Basket.belongsTo(ProductColor, { foreignKey: "colorId", targetKey: "id", as: "color" });
    Basket.belongsTo(ProductSize, { foreignKey: "sizeId", targetKey: "id", as: "size" });
    Basket.belongsTo(Discount, { foreignKey: "discountId", targetKey: "id", as: "discount" });
    // Discount.sync({})
    // Basket.sync({})
    // await sequelize.sync({ alter: true });
}

module.exports = {
    initDataBase
}