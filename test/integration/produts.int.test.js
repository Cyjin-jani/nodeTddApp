const request = require('supertest'); // 통합테스트를 위해서 사용
const app = require('../../server');
const newProduct = require('../data/new-product.json');

// 통합테스트 POST /api/products
it('POST /api/products', async () => {
  // request에는 app이 필요하여 server.js에서 만들어 준 app을 넣어준다. (실제 몽고디비와의 통신을 위해)
  // app 다음에는 해당하는 메서드(get, post 등)을 정한 뒤, api주소를 parameter로 넣어준다.
  const response = await request(app).post('/api/products').send(newProduct);
  expect(response.statusCode).toBe(201);
  expect(response.body.name).toBe(newProduct.name);
  expect(response.body.description).toBe(newProduct.description);
});

// 잘못된 body를 보냈을 때를 확인하는 테스트
it('should return 500 on POST /api/products', async () => {
  const response = await request(app)
    .post('/api/products')
    .send({ name: 'glove', price: 15 });

  expect(response.statusCode).toBe(500); // server error

  // description이 required이기 때문에, 아래 에러 메세지가 발생.
  expect(response.body).toStrictEqual({
    message:
      'Product validation failed: description: Path `description` is required.',
  });
});

// 통합테스트 GET /api/products

// toBeDefined => 변수가 undefined가 아닌지 체크합니다.
// toBeTruthy => value 값이 무엇인지보다 value가 True인지 아닌지를 확인합니다.

it('GET /api/products', async () => {
  const response = await request(app).get('/api/products');
  expect(response.statusCode).toBe(200);
  expect(Array.isArray(response.body)).toBeTruthy(); // response.body가 배열일 거라는 걸 확인
  expect(response.body[0].name).toBeDefined(); // undefined 유무 체크
  expect(response.body[0].description).toBeDefined(); // undefined 유무 체크
});
