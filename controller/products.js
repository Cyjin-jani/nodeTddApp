exports.hello = (req, res) => {
  res.send('안녕하세요');
};

const productModel = require('../models/Product');

exports.createProduct = async (req, res, next) => {
  try {
    const createdProduct = await productModel.create(req.body);
    // console.log('createProduct', createdProduct);
    res.status(201).json(createdProduct);
  } catch (error) {
    console.log(error);
    next(error); // 비동기 에러를 처리해 줄 수 있도록 한다.
  }
};
