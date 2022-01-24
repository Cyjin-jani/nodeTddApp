const express = require('express');

const PORT = 5000;

const app = express();
const productRoutes = require('./routes');
app.use(express.json()); // 미들웨어 내장함수 bodyParser 모듈을 대체함 (4.16 이상부터 가능)

app.use('/api/products', productRoutes);

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.listen(PORT);

console.log(`Running on port ${PORT}`);
