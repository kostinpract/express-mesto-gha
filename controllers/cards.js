/* eslint-disable no-console */
const Card = require('../models/card');

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: `Переданы некорректные данные, ${err.name}` });
      } else {
        res.status(500).send({ message: `Произошла ошибка, ${err.name}` });
      }
    });
};

module.exports.getCard = (req, res) => {
  Card.findById({ _id: req.params.cardId })
    .orFail(() => {
      const error = new Error('Карточка с таким ID не найдена');
      error.statusCode = 404;
      error.name = 'NotFound';
      return error;
    })
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: `Указан некорректный ID карточки, ${err.name}` });
      } else if (err.name === 'NotFound') {
        res.status(404).send({ message: `Карточка с таким ID не найдена, ${err.name}` });
      } else {
        res.status(500).send({ message: `Произошла ошибка, ${err.name}` });
      }
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove({ _id: req.params.cardId })
    .then((card) => res.send({ data: card }))
    .catch((err) => res.status(500).send({ message: `Произошла ошибка ${err}` }));
};

module.exports.getAllCards = (req, res) => {
  Card.find({})
    .then((card) => res.send({ data: card }))
    .catch((err) => res.status(500).send({ message: `Произошла ошибка ${err}` }));
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
      upsert: true, // если пользователь не найден, он будет создан
    },
  )
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: `Переданы некорректные данные, ${err.name}` });
      } else {
        res.status(500).send({ message: `Произошла ошибка, ${err.name}` });
      }
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
      upsert: true, // если пользователь не найден, он будет создан
    },
  )
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: `Переданы некорректные данные, ${err.name}` });
      } else {
        res.status(500).send({ message: `Произошла ошибка, ${err.name}` });
      }
    });
};

// module.exports.changeLike = (req, res) => {
//   Card.findById({ _id: req.params.cardId })
//     .then((card) => {
//       const currentUserLikeIndex = card.likes.indexOf(req.user._id);
//       if (req.method === 'PUT' && currentUserLikeIndex === -1) {
//         card.likes.push(req.user._id);
//       } else if (req.method === 'DELETE' && currentUserLikeIndex >= 0) {
//         card.likes.splice(currentUserLikeIndex, 1);
//       }

//       Card.findOneAndUpdate(
//         { _id: req.params.cardId },
//         card,
//         {
//           new: true, // обработчик then получит на вход обновлённую запись
//           runValidators: true, // данные будут валидированы перед изменением
//           upsert: true, // если пользователь не найден, он будет создан
//         },
//       )
//         .then((updatedCard) => res.send({ data: updatedCard }))
//         .catch((err) => res.status(500).send({ message: `Произошла ошибка ${err}` }));
//     })
//     .catch((err) => res.status(500).send({ message: `Произошла ошибка ${err}` }));
// };
