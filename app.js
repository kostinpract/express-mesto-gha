const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');

const ERROR_NOT_FOUND = 404;

const { PORT = 3000 } = process.env;
const { MONGOURI = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

const app = express();

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(MONGOURI);

app.use((req, res, next) => {
  req.user = {
    _id: '646333b4cff0e52ce6466021',
  };
  next();
});

app.post('/signin', login);
app.post('/signup', createUser);

app.use('/cards', auth, require('./routes/cards'));
app.use('/users', auth, require('./routes/users'));

app.use('*', (req, res) => res.status(ERROR_NOT_FOUND).send({ message: 'Нет такого эндпоинта в нашем API' }));

app.listen(PORT, () => console.log('Бэкенд запущен'));
