const createHttpError = require("http-errors");
const { ProductTypes } = require("../../common/constant/product.const");
const { Product, ProductDetail, ProductColor, ProductSize } = require("./product.model");
const { StatusCodes } = require("http-status-codes");

async function createProductHandler(req, res, next) {
    try {
        const {
            title,
            description,
            type,
            price = undefined,
            discount = undefined,
            active_discount = undefined,
            count = undefined,
            details,
            colors,
            sizes,
        } = req.body;
        if (!Object.values(ProductTypes).includes(type)) {
            throw createHttpError(400, "Invalid product type")
        }
        const product = await Product.create({
            title,
            description,
            price,
            discount,
            active_discount,
            type,
            count
        });
        if (details && Array.isArray(details)) {
            let detailList = [];
            for (const item of details) {
                detailList.push({
                    key: item?.key,
                    value: item?.value,
                    productId: product.id
                })
            }
            if (detailList.length > 0) {
                // ذخیره ارایه ای از سطر ها
                await ProductDetail.bulkCreate(detailList)
            }
        }

        if (type === ProductTypes.Coloring) {
            if (colors && Array.isArray(colors)) {
                let colorList = [];
                for (const item of colors) {
                    colorList.push({
                        color_name: item?.name,
                        color_code: item?.code,
                        productId: product.id,
                        price: item.price,
                        discount: item.discount,
                        active_discount: item.active_discount,
                        count: item.count
                    })
                }
                if (colorList.length > 0) {
                    // ذخیره ارایه ای از سطر ها
                    await ProductColor.bulkCreate(colorList)
                }
            }
        }
        if (type === ProductTypes.Sizing) {
            if (sizes && Array.isArray(sizes)) {
                let sizeList = [];
                for (const item of sizes) {
                    sizeList.push({
                        size: item?.size,
                        productId: product.id,
                        price: item.price,
                        discount: item.discount,
                        active_discount: item.active_discount,
                        count: item.count
                    })
                }
                if (sizeList.length > 0) {
                    // ذخیره ارایه ای از سطر ها
                    await ProductSize.bulkCreate(sizeList)
                }
            }
        }
        return res.status(StatusCodes.CREATED).json({
            status: StatusCodes.CREATED,
            data: {
                message: "محصول با موفقیت ایجاد شد"
            }
        })
    } catch (error) {
        next(error)
    }
}
async function getProductHandler(req, res, next) {
    try {
        const products = await Product.findAll({});
        return res.status(StatusCodes.OK).json({
            status: StatusCodes.OK,
            data: {
                products
            }
        })
    } catch (error) {
        next(error)
    }
}
// async function getProductHandler(req, res, next) {
//     try {
//         const products = await Product.findAll({});
//         return res.render("pages/products")
//     } catch (error) {
//         next(error)
//     }
// }
async function getProductDetailByIdHandler(req, res, next) {
    try {
        const { id } = req.params;

        const product = await Product.findOne({
            where: { id },
            include: [
                { model: ProductDetail, as: "details" },
                { model: ProductColor, as: "colors" },
                { model: ProductSize, as: "sizes" },
            ]
        });
        if (!product) {
            throw createHttpError(404, "محصول یافت نشد")
        }
        return res.status(StatusCodes.OK).json({
            status: StatusCodes.OK,
            data: {
                product
            }
        })
    } catch (error) {
        next(error)
    }
}

async function removeProductHandler(req, res, next) {
    try {
        const { id } = req.params;
        const product = await Product.findByPk(id);
        if (!product) throw createHttpError(404, "محصول یافت نشد");
        await product.destroy();
        return res.status(StatusCodes.OK).json({
            status: StatusCodes.OK,
            data: {
                message: "محصول با موفقیت حذف شد"
            }
        })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    createProductHandler,
    getProductHandler,
    getProductDetailByIdHandler,
    removeProductHandler
}