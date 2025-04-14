const { Product, ProductDetail, ProductColor, ProductSize } = require("../modules/product/product.model");
const { User, Otp, UserProfile } = require("../modules/user/user.model");
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
    UserProfile.sync();
    // user initializ
    User.hasOne(Otp, { foreignKey: "userId", as: "otp" })
    Otp.hasOne(User, { foreignKey: "otpId", as: "otp", sourceKey: "id" })
    // have access to user from otp
    Otp.belongsTo(User, { foreignKey: "userId", targetKey: "id" })
    // await sequelize.sync({ alter: true });
}

module.exports = {
    initDataBase
}