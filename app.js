const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const bodyParser = require('body-parser');

const { PORT = 3000 } = process.env;
const { MONGOURI = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

const app = express();

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(MONGOURI);

// подключаем мидлвары, роуты и всё остальное...

app.use((req, res, next) => {
  req.user = {
    _id: '646333b4cff0e52ce6466021',
  };
  next();
});

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use('*', (req, res) => res.status(404).send({ message: 'Нет такого эндпоинта в нашем API' }));

app.listen(PORT, () => console.log('Бэкенд запущен'));
