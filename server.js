const express = require('express');

const PORT = 5000;

const app = express();
const productRoutes = require('./routes');
const mongoose = require('mongoose');
mongoose
  .connect(
    'mongodb+srv://yjdev:yjdev1234@cluster0.0papu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));
app.use(express.json()); // 미들웨어 내장함수 bodyParser 모듈을 대체함 (4.16 이상부터 가능)

app.use('/api/products', productRoutes);

// app.get('/', (req, res) => {
//   res.send('Hello World');
// });

// error handle을 위한 미들웨어
app.use((error, req, res, next) => {
  res.status(500).json({ message: error.message });
});

app.listen(PORT);

console.log(`Running on port ${PORT}`);

module.exports = app;
