const request = require('supertest'); // 통합테스트를 위해서 사용
const app = require('../../server');
const newProduct = require('../data/new-product.json');

// 통합테스트
it('POST /api/products', async () => {
  // request에는 app이 필요하여 server.js에서 만들어 준 app을 넣어준다. (실제 몽고디비와의 통신을 위해)
  // app 다음에는 해당하는 메서드(get, post 등)을 정한 뒤, api주소를 parameter로 넣어준다.
  const response = await request(app).post('/api/products').send(newProduct);
  expect(response.statusCode).toBe(201);
  expect(response.body.name).toBe(newProduct.name);
  expect(response.body.description).toBe(newProduct.description);
});
