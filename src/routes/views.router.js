const express = require("express");
const router = express.Router();
// const ProductManager = require("../managers/ProductManager");

const productManager = require("../managers/ProductManager");

router.get("/", async (req, res) => {
    const products = await productManager.getAllProducts();
    res.render("home", { products });
});

router.get("/realtimeproducts", async (req, res) => {
    const products = await productManager.getAllProducts();
    res.render("realTimeProducts", { products });
});

module.exports = router;