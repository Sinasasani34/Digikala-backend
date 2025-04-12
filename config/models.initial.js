const { Product, ProductDetail, ProductColor, ProductSize } = require("../modules/product/product.model");
const { sequelize } = require("./sequelize.config");

async function initDataBase() {
    // give connection for ditails(one to on)
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
    await sequelize.sync({ force: true });
}

module.exports = {
    initDataBase
}