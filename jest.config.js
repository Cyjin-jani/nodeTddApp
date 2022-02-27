// mongoose에러 트러블 슈팅
// Mongoose: looks like you're trying to test a Mongoose app with Jest's default jsdom test environment. Please make sure you read Mongoose's docs on configuring Jest to test Node.js apps: http://mongoosejs.com/docs/jest.html

// 몽구스에서는 jsDom을 지원하지 않는다.
// 해결법: jest의 테스트 환경을 jsDom이 아니라, node로 바꾸어주어야 한다.
// jest.config.js에서 설정을 해주어야 한다.

module.exports = {
  testEnvironment: 'node',
};
