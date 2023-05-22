const User = require('../models/user');

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: `Переданы некорректные данные, ${err.name}` });
      } else {
        res.status(500).send({ message: `Произошла ошибка, ${err.name}` });
      }
    });
};

module.exports.getUser = (req, res) => {
  User.findById({ _id: req.params.userId })
    .orFail(() => {
      const error = new Error('Пользователь с таким ID не найден');
      error.statusCode = 404;
      error.name = 'NotFound';
      return error;
    })
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: `Указан некорректный ID пользователя, ${err.name}` });
      } else if (err.name === 'NotFound') {
        res.status(404).send({ message: `Пользователь с таким ID не найден, ${err.name}` });
      } else {
        res.status(500).send({ message: `Произошла ошибка, ${err.name}` });
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
      upsert: true, // если пользователь не найден, он будет создан
    },
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(500).send({ message: `Произошла ошибка ${err}` }));
};

module.exports.getAllUsers = (req, res) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(500).send({ message: `Произошла ошибка ${err}` }));
};
