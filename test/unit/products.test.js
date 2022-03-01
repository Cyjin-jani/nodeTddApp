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

productModel.create = jest.fn(); // spy...를 통해 실제 모델에서 create함수가 호출이 되었는지 유무를 체크한다.

describe('Product Controller Create', () => {
  // 먼저 함수가 있는 지에 대한 테스트 코드 작성
  it('should have a createProduct function', () => {
    expect(typeof productController.createProduct).toBe('function');
  });

  // 메서드 호출 테스트
  it('should call ProductModel.create', () => {
    let req = httpMocks.createRequest();
    let res = httpMocks.createResponse();
    let next = null;

    req.body = newProduct;
    productController.createProduct(req, res, next); // productController에서 createProduct를 호출할 때,
    expect(productModel.create).toBeCalledWith(newProduct); // productModel의 create 함수가 호출이 되는 지 테스트.
  });
});
