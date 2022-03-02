// exports.hello = (req, res) => {
//   res.send('안녕하세요');
// };

const productModel = require('../models/Product');

exports.createProduct = (req, res, next) => {
  const createdProduct = productModel.create(req.body);
  res.status(201).json(createdProduct);
};
