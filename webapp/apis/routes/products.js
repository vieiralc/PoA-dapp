const express = require('express');
const router = express.Router();

const products = require('../products/products');

// @route GET /addProducts
// @desc renders produtos.html
// @access Private
router.get('/addProducts', products.renderAddProducts);

// @route GET /getProducts
// @desc renders listaProdutos.html
// @access Private
router.get('/getProducts', products.renderGetProducts);

// @route GET /editProduct
// @desc renders editProduct.html
// @access Private
router.get('/editProduct', products.renderEditProduct);

// @route GET /listProducts
// @desc gets all products
// @access Private
router.get('/listProducts', products.getProducts);

// @route POST /addProducts
// @desc registers a new product
// @access Private
router.post('/addProducts', products.addProducts);

// @route POST /updateProduct
// @desc registers a new product
// @access Private
router.post('/updateProduct', products.updateProduct);

module.exports = router;