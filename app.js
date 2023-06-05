const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const { celebrate, Joi } = require('celebrate');
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

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(2),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(2),
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
    avatar: Joi.string().required().min(2),
  }),
}), createUser);

app.use('/cards', auth, require('./routes/cards'));
app.use('/users', auth, require('./routes/users'));

app.use('*', (req, res) => res.status(ERROR_NOT_FOUND).send({ message: 'Нет такого эндпоинта в нашем API' }));

app.use((err, req, res, next) => {
  // console.log(err);
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({ message: statusCode === 500 ? 'На сервере произошла ошибка' : message });
});

app.listen(PORT, () => console.log('Бэкенд запущен'));
