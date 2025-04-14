const { Router } = require("express");
const { createProductValidation } = require("./validation");
const { createProductHandler, getProductHandler, getProductDetailByIdHandler, removeProductHandler } = require("./product.service");

const router = Router();
router.get("/", getProductHandler)
router.get("/:id", getProductDetailByIdHandler)
router.delete("/:id", removeProductHandler)
router.post("/", createProductValidation, createProductHandler)
module.exports = {
    productRoutes: router
}