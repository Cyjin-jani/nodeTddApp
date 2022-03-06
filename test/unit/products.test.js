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
