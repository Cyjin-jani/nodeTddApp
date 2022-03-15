// exports.hello = (req, res) => {
//   res.send('안녕하세요');
// };

const productModel = require('../models/Product');

exports.createProduct = async (req, res, next) => {
  try {
    const createdProduct = await productModel.create(req.body);
    // console.log('createProduct', createdProduct);
    res.status(201).json(createdProduct);
  } catch (error) {
    // console.log(error);
    next(error); // 비동기 에러를 처리해 줄 수 있도록 한다.
    // 그냥 throw Error를 해주는 게 아니라, next를 넣어서 에러를 처리해준다.
    // express에서는 보통 에러 핸들러라고 미들웨어를 만들어서 에러를 핸들링 하는데,
    // 비동기에서는 에러 핸들링을 따로 해줄 수 없기에 next메서드에 에러를 보내주어야 한다.
  }
};

exports.getProducts = async (req, res, next) => {
  try {
    const allProducts = await productModel.find({});
    // res.status(200).send();
    res.status(200).json(allProducts);
  } catch (error) {
    next(error);
  }
};

exports.getProductById = async (req, res, next) => {
  try {
    const product = await productModel.findById(req.params.productId);
    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404).send();
    }
  } catch (error) {
    next(error);
  }
};
