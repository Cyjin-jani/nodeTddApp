// 기본적인 test 방식

// describe('Calculation', () => {
//   test('2더4하기2는4', () => {
//     expect(2 + 2).toBe(4);
//   });

//   test('2더4하기2는5가 아님', () => {
//     expect(2 + 2).not.toBe(5);
//   });
// });
const productController = require('../../controller/products');
const productModel = require('../../models/Product');

const httpMocks = require('node-mocks-http'); // http req, res객체를 생성하기 위한 패키지
const newProduct = require('../data/new-product.json');
const allProducts = require('../data/all-products.json');

productModel.create = jest.fn(); // spy...를 통해 실제 모델에서 create함수가 호출이 되었는지 유무를 체크한다.
productModel.find = jest.fn();
productModel.findById = jest.fn();
productModel.findByIdAndUpdate = jest.fn();
productModel.findByIdAndDelete = jest.fn();

const productId = '622375b2ef65944f45f5667a';
const updatedProduct = { name: 'updated name', description: 'updated desc' };

// 테스트에서 반복되는 부분들을 미리 실행해주는 beforeEach메서드
let req, res, next;
beforeEach(() => {
  // 여기는 글로벌 beforeEach입니다. 각 describe가 실행될 때 실행을 한다.
  req = httpMocks.createRequest();
  res = httpMocks.createResponse();
  next = jest.fn();
});

describe('Product Controller Create', () => {
  beforeEach(() => {
    req.body = newProduct;
  });

  // 먼저 함수가 있는 지에 대한 테스트 코드 작성
  it('should have a createProduct function', () => {
    expect(typeof productController.createProduct).toBe('function');
  });

  // 메서드 호출 테스트
  it('should call ProductModel.create', async () => {
    await productController.createProduct(req, res, next); // productController에서 createProduct를 호출할 때,
    expect(productModel.create).toBeCalledWith(newProduct); // productModel의 create 함수가 호출이 되는 지 테스트.
  });

  // 상태 값 테스트
  it('should return 201 response code', async () => {
    await productController.createProduct(req, res, next);
    expect(res.statusCode).toBe(201); // 201 code를 response로 보내야 한다.
    expect(res._isEndCalled()).toBeTruthy(); // _isEndCalled는 mock http 패키지 메서드이다.
    // response status code와 함께 send()로 데이터를 보낼 수 있어, 해당 부분을 확인하는 expect구문이다.
  });

  it('should return json body in response', async () => {
    // 이미 jest.fn()으로 mock함수를 만들었기에, mockReturnValue를 사용하여 가짜 return 값(json data)을 만들어 준다.
    productModel.create.mockReturnValue(newProduct);
    await productController.createProduct(req, res, next);
    expect(res._getJSONData()).toStrictEqual(newProduct);
  });

  it('should handle errors', async () => {
    // mongoDB에 의존하지 않기 위해 임의로 에러 메세지를 만들어 준다.
    const errorMsg = { message: 'description property is missing' };
    const rejectedPromise = Promise.reject(errorMsg);
    productModel.create.mockReturnValue(rejectedPromise);
    // express 에서는 비동기요청의 경우, 에러 핸들링을 위한 콜백함수가 필요하다. 그 부분을 next로 처리하기 때문에 next가 필요하다.
    await productController.createProduct(req, res, next);
    expect(next).toBeCalledWith(errorMsg);
  });
});

// Get products 관련 테스트
describe('Product Controller Get', () => {
  // 해당 함수가 존재하는지
  it('should have a getProducts function', () => {
    expect(typeof productController.getProducts).toBe('function');
  });

  // 해당 메소드가 호출이 잘 되는지 테스트
  it('should call ProductModel.find({})', async () => {
    await productController.getProducts(req, res, next);
    // find 할 때 빈 객체를 넣어주면, 아무 필터링 없이 전체 데이터를 불러오는 게 된다.
    expect(productModel.find).toHaveBeenCalledWith({});
  });

  // response 테스트
  it('should return 200 response', async () => {
    await productController.getProducts(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled).toBeTruthy(); // send를 테스트 합니다. (아래에서 jsonData를 받아야 해서 json으로 바뀜)
  });

  // json return data 테스트
  it('should return json body in response', async () => {
    productModel.find.mockReturnValue(allProducts);
    await productController.getProducts(req, res, next);
    expect(res._getJSONData()).toStrictEqual(allProducts);
  });

  // 에러처리 test
  it('should handle errors', async () => {
    const errorMessage = { message: 'Error finding product data' };
    const rejectedPromise = Promise.reject(errorMessage);
    productModel.find.mockReturnValue(rejectedPromise);
    await productController.getProducts(req, res, next);
    expect(next).toHaveBeenCalledWith(errorMessage);
  });
});

describe('product controller getById', () => {
  it('should have a getProductById', () => {
    expect(typeof productController.getProductById).toBe('function');
  });

  it('should call productModel.findById', async () => {
    req.params.productId = productId;
    await productController.getProductById(req, res, next);
    expect(productModel.findById).toBeCalledWith(productId);
  });

  it('should return json body and response code 200', async () => {
    productModel.findById.mockReturnValue(newProduct);
    await productController.getProductById(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toStrictEqual(newProduct);
    expect(res._isEndCalled()).toBeTruthy();
  });

  // error 핸들링
  it('should return 404 when item dose not exist', async () => {
    productModel.findById.mockReturnValue();
    await productController.getProductById(req, res, next);
    expect(res.statusCode).toBe(404);
    expect(res._isEndCalled()).toBeTruthy();
  });

  it('should handle errors', async () => {
    const errorMsg = { message: 'error' };
    const rejectedPromise = Promise.reject(errorMsg);
    productModel.findById.mockReturnValue(rejectedPromise);
    await productController.getProductById(req, res, next);

    expect(next).toHaveBeenCalledWith(errorMsg);
  });
});

describe('Product Controller Update', () => {
  it('should have an updateProduct function', () => {
    expect(typeof productController.updateProduct).toBe('function');
  });

  it('should call productModel.findByIdAndUpdate', async () => {
    req.params.productId = productId;
    req.body = updatedProduct;

    await productController.updateProduct(req, res, next);
    expect(productModel.findByIdAndUpdate).toHaveBeenCalledWith(
      productId,
      updatedProduct,
      { new: true }
    );
  });

  it('should return json body and response code 200', async () => {
    req.params.productId = productId;
    req.body = updatedProduct;
    productModel.findByIdAndUpdate.mockReturnValue(updatedProduct);
    await productController.updateProduct(req, res, next);
    expect(res._isEndCalled()).toBeTruthy();
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toStrictEqual(updatedProduct);
  });

  it('should handle 404 when item does not exist', async () => {
    // 업데이트 해준게 없으므로 null을 리턴
    productModel.findByIdAndUpdate.mockReturnValue(null);

    await productController.updateProduct(req, res, next);
    expect(res.statusCode).toBe(404);
    expect(res._isEndCalled()).toBeTruthy();
  });

  it('should handle errors', async () => {
    const errorMsg = { message: 'Error' };
    const rejectPromise = Promise.reject(errorMsg);
    productModel.findByIdAndUpdate.mockReturnValue(rejectPromise);
    await productController.updateProduct(req, res, next);
    expect(next).toHaveBeenCalledWith(errorMsg);
  });
});

describe('ProductController Delete', () => {
  it('should have a deleteProduct function', () => {
    expect(typeof productController.deleteProduct).toBe('function');
  });

  it('should call ProductModel.findByIdAndDelete', async () => {
    req.params.productId = productId;
    await productController.deleteProduct(req, res, next);
    expect(productModel.findByIdAndDelete).toBeCalledWith(productId);
  });

  it('should return statusCode 200 response', async () => {
    let deletedProduct = {
      name: 'deleted product',
      description: 'deleted Desc',
    };
    productModel.findByIdAndDelete.mockReturnValue(deletedProduct);
    await productController.deleteProduct(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toStrictEqual(deletedProduct);
    expect(res._isEndCalled()).toBeTruthy();
  });

  it('should handle 404 when item does not exist', async () => {
    productModel.findByIdAndDelete.mockReturnValue(null);
    await productController.deleteProduct(req, res, next);
    expect(res.statusCode).toBe(404);
    expect(res._isEndCalled()).toBeTruthy();
  });

  it('should handle errors', async () => {
    const errorMsg = { message: 'error!' };
    const rejectedPromise = Promise.reject(errorMsg);
    productModel.findByIdAndDelete.mockReturnValue(rejectedPromise);

    await productController.deleteProduct(req, res, next);
    expect(next).toHaveBeenCalledWith(errorMsg);
  });
});
