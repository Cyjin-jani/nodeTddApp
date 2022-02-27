// exports.hello = (req, res) => {
//   res.send('안녕하세요');
// };

const productModel = require('../models/Product');

exports.createProduct = (req, res) => {
  productModel.create();
};
