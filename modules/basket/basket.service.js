const createHttpError = require("http-errors");
const { Product, ProductColor, ProductSize } = require("../product/product.model");
const { ProductTypes } = require("../../common/constant/product.const");
const { Basket } = require("./basket.model");
const { StatusCodes } = require("http-status-codes");

async function addToBasketHandler(req, res, next) {
    try {
        const { id: userId = undefined } = req.user ?? {};
        const { productId, sizeId, colorId } = req.body;
        const product = await Product.findByPk(productId);
        if (!product) throw createHttpError(404, 'محصول یافت نشد');
        const basketItem = {
            productId: product.id,
            userId
        };
        let productCount = undefined;
        let colorCount = undefined;
        let sizeCount = undefined;

        if (product.type === ProductTypes.Coloring) {
            if (!colorId) throw createHttpError(400, "رنگ را وارد کنید");
            const productColor = await ProductColor.findByPk(colorId);
            if (!productColor) throw createHttpError(404, "محصول با این رنگ موجود نمیباشد");
            basketItem['colorId'] = colorId;
            colorCount = productColor?.count ?? 0;
            if (colorCount === 0) {
                throw createHttpError(400, "محصول در انبار موجود نمیباشد")
            }
        } else if (product.type === ProductTypes.Sizing) {
            if (!sizeId) throw createHttpError(400, "اندازه را وارد کنید");
            const productSize = await ProductColor.findByPk(sizeId);
            if (!productSize) throw createHttpError(404, "محصول با این اندازه و سایز موجود نمیباشد");
            basketItem['sizeId'] = sizeId;
            sizeCount = productSize?.count ?? 0;
            if (sizeCount === 0) {
                throw createHttpError(400, "محصول در انبار موجود نمیباشد")
            }
        } else {
            productCount = product?.count ?? 0;
            if (productCount === 0) {
                throw createHttpError(400, "محصول در انبار موجود نمیباشد")
            }
        }
        // const basket = await Basket.findOne({ where: basketItem });
        // if (basket) {
        //     if (sizeCount && sizeCount > basket?.count) {
        //         basket.count += 1;
        //     } else if (colorCount && colorCount > basket?.count) {
        //         basket.count += 1;
        //     } else if (productCount && productCount > basket?.count) {
        //         basket.count += 1;
        //     } else {
        //         throw createHttpError(400, "محصول در انبار موجود نمیباشد")
        //     }
        //     await basket.save()
        // } else {
        //     await basket.create({ ...basketItem, count: 1 });
        // }
        const basket = await Basket.findOne({ where: basketItem });

        if (basket) {
            if (sizeCount && sizeCount > basket.count) {
                basket.count += 1;
            } else if (colorCount && colorCount > basket.count) {
                basket.count += 1;
            } else if (productCount && productCount > basket.count) {
                basket.count += 1;
            } else {
                throw createHttpError(400, "محصول در انبار موجود نمیباشد");
            }
            await basket.save();
        } else {
            // استفاده از Basket.create به جای basket.create
            await Basket.create({ ...basketItem, count: 1, sizeId: basketItem.sizeId });
        }
        return res.status(StatusCodes.CREATED).json({
            message: "محصول به سبد خرید اضافه شد",
        })
    } catch (error) {
        console.log(error)
        next(error)
    }
}

async function getUserBasketHandler(req, res, next) {
    try {
        const { id: userId } = req.user;
        console.log(userId)
        const basket = await Basket.findAll({
            where: { userId },
            include: [
                { model: Product, as: "product" },
                { model: ProductColor, as: "color" },
                { model: ProductSize, as: "size" },
            ]
        });
        let totalAmount = 0;
        let totalDiscount = 0;
        let finalAmount = 0;
        let finalBasket = [];

        for (const item of basket) {
            const { product, color, size, count } = item;// دقت کنید که در اینجا item یک object است
            let productData = {
                idL: product.id,
                title: product.title,
                price: product.price,
                type: product.type
            }
        }
        return res.json({ basket })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    addToBasketHandler,
    getUserBasketHandler
}