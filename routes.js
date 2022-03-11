const express = require('express');

const router = express.Router();
const productController = require('./controller/products');

// router.get('/', productController.hello);

router.post('/', productController.createProduct);

router.get('/', productController.getProducts);

module.exports = router;
