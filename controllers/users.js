const User = require('../models/user');

const ERROR_BAD_REQUEST = 400;
const ERROR_NOT_FOUND = 404;
const ERROR_SERVER = 500;

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_BAD_REQUEST).send({ message: `Переданы некорректные данные, ${err.name}` });
      } else {
        res.status(ERROR_SERVER).send({ message: `Произошла ошибка, ${err.name}` });
      }
    });
};

module.exports.getUser = (req, res) => {
  User.findById({ _id: req.params.userId })
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
