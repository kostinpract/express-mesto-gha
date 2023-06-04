const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const STATUS_CREATED = 201;
const STATUS_OK = 200;
const ERROR_BAD_REQUEST = 400;
const ERROR_NOT_FOUND = 404;
const ERROR_AUTH = 401;
const ERROR_SERVER = 500;

module.exports.login = (req, res) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'super-strong-secret', { expiresIn: '7d' });
      res.status(STATUS_OK).send({ token });
    })
    .catch((err) => {
      res.status(ERROR_AUTH).send({ message: err.message });
    });
};

module.exports.createUser = (req, res) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        name,
        about,
        avatar,
        email,
        hash,
      })
        .then((user) => res.status(STATUS_CREATED).send(user))
        .catch((err) => {
          if (err.name === 'ValidationError') {
            res.status(ERROR_BAD_REQUEST).send({ message: `Переданы некорректные данные, ${err.name}` });
          } else {
            res.status(ERROR_SERVER).send({ message: `Произошла ошибка, ${err.name}` });
          }
        });
    });
};

module.exports.getUser = (req, res) => {
  let id = req.params.userId;
  if (!id) {
    const decoded = jwt.verify(req.params.token, 'super-strong-secret');
    id = decoded.id;
  }
  User.findById({ _id: id })
    .orFail(() => {
      const error = new Error('Пользователь с таким ID не найден');
      error.statusCode = ERROR_NOT_FOUND;
      error.name = 'NotFound';
      return error;
    })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_BAD_REQUEST).send({ message: `Указан некорректный ID пользователя, ${err.name}` });
      } else if (err.name === 'NotFound') {
        res.status(ERROR_NOT_FOUND).send({ message: `Пользователь с таким ID не найден, ${err.name}` });
      } else {
        res.status(ERROR_SERVER).send({ message: `Произошла ошибка, ${err.name}` });
      }
    });
};

module.exports.updateUser = (req, res) => {
  User.findOneAndUpdate(
    req.params.id,
    req.body,
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
    },
  )
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_BAD_REQUEST).send({ message: `Переданы некорректные данные, ${err.name}` });
      } else {
        res.status(ERROR_SERVER).send({ message: `Произошла ошибка, ${err.name}` });
      }
    });
};

module.exports.getAllUsers = (req, res) => {
  User.find({})
    .then((user) => res.send(user))
    .catch((err) => res.status(ERROR_SERVER).send({ message: `Произошла ошибка ${err}` }));
};
