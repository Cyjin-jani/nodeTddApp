exports.hello = (req, res) => {
  res.send('안녕하세요');
};

const productModel = require('../models/Product');

exports.createProduct = async (req, res, next) => {
  const createdProduct = await productModel.create(req.body);
  console.log('createProduct', createdProduct);
  res.status(201).json(createdProduct);
};
