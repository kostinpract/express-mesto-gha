const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { SECRET } = require('../config');

const { BadRequestError } = require('../errors/bad-request-err');
const { ConflictError } = require('../errors/conflict-err');
const { NotFoundError } = require('../errors/not-found-err');

const STATUS_CREATED = 201;
const STATUS_OK = 200;
const ERROR_BAD_REQUEST = 400;
const ERROR_SERVER = 500;

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, SECRET, { expiresIn: '7d' });
      res.status(STATUS_OK).send({ token });
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => {
      console.log(hash);
      User.create({
        name,
        about,
        avatar,
        email,
        password: hash,
      })
        .then((user) => res.status(STATUS_CREATED).send(user))
        .catch((err) => {
          if (err.name === 'ValidationError') {
            next(new BadRequestError('Поля заполнены некорректно'));
          } else if (err.code === 11000) {
            next(new ConflictError('Уже есть пользователь с таким email'));
          }
          next(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports.getUser = (req, res, next) => {
  let id = req.params.userId;
  if (!id) {
    const decoded = jwt.verify(req.params.token, SECRET);
    id = decoded.id;
  }
  User.findById({ _id: id })
    .orFail(() => {
      next(new NotFoundError('Пользователь с таким ID не найден'));
    })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Указан некорректный ID пользователя'));
      }
      next(err);
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
