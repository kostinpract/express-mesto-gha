const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { SECRET } = require('../config');

const { BadRequestError } = require('../errors/bad-request-err');
const { ConflictError } = require('../errors/conflict-err');
const { NotFoundError } = require('../errors/not-found-err');

const STATUS_CREATED = 201;
const STATUS_OK = 200;

module.exports.loginUser = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        SECRET,
        { expiresIn: '7d' },
      );

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
      User.create({
        name,
        about,
        avatar,
        email,
        password: hash,
      })
        .then((user) => {
          res.status(STATUS_CREATED).send({
            name,
            about,
            avatar,
            email,
            _id: user._id,
          });
        })
        .catch((err) => {
          if (err.name === 'ValidationError') {
            next(new BadRequestError('Поля заполнены некорректно'));
            return;
          }
          if (err.code === 11000) {
            next(new ConflictError('Уже есть пользователь с таким email'));
            return;
          }
          next(err);
        });
    })
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
  let id = req.params.userId;
  if (!id) {
    id = req.user._id;
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
        return;
      }
      next(err);
    });
};

module.exports.updateUser = (req, res, next) => {
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
        next(new BadRequestError('Переданы некорректные данные'));
        return;
      }
      next(err);
    });
};

module.exports.getAllUsers = (req, res, next) => {
  User.find({})
    .then((user) => res.send(user))
    .catch(next);
};
