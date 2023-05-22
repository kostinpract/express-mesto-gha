/* eslint-disable no-console */
const Card = require('../models/card');

const ERROR_BAD_REQUEST = 400;
const ERROR_NOT_FOUND = 404;
const ERROR_SERVER = 500;

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_BAD_REQUEST).send({ message: `Переданы некорректные данные, ${err.name}` });
      } else {
        res.status(ERROR_SERVER).send({ message: `Произошла ошибка, ${err.name}` });
      }
    });
};

module.exports.getCard = (req, res) => {
  Card.findById({ _id: req.params.cardId })
    .orFail(() => {
      const error = new Error('Карточка с таким ID не найдена');
      error.statusCode = ERROR_NOT_FOUND;
      error.name = 'NotFound';
      return error;
    })
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_BAD_REQUEST).send({ message: `Указан некорректный ID карточки, ${err.name}` });
      } else if (err.name === 'NotFound') {
        res.status(ERROR_NOT_FOUND).send({ message: `Карточка с таким ID не найдена, ${err.name}` });
      } else {
        res.status(ERROR_SERVER).send({ message: `Произошла ошибка, ${err.name}` });
      }
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove({ _id: req.params.cardId })
    .then((card) => res.send({ data: card }))
    .catch((err) => res.status(ERROR_SERVER).send({ message: `Произошла ошибка ${err}` }));
};

module.exports.getAllCards = (req, res) => {
  Card.find({})
    .then((card) => res.send({ data: card }))
    .catch((err) => res.status(ERROR_SERVER).send({ message: `Произошла ошибка ${err}` }));
};

const changeCard = (req, res, method) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { [method]: { likes: req.user._id } }, // убрать _id из массива
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
    },
  )
    .then((card) => {
      if (!card) {
        const error = new Error('Карточка с таким ID не найдена');
        error.statusCode = ERROR_NOT_FOUND;
        error.name = 'NotFound';
        throw error;
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_BAD_REQUEST).send({ message: `Указан некорректный ID карточки, ${err.name}` });
      } else if (err.name === 'NotFound') {
        res.status(ERROR_NOT_FOUND).send({ message: `Карточка с таким ID не найдена, ${err.name}` });
      } else {
        res.status(ERROR_SERVER).send({ message: `Произошла ошибка, ${err.name}` });
      }
    });
};

module.exports.likeCard = (req, res) => changeCard(req, res, '$addToSet');
module.exports.dislikeCard = (req, res) => changeCard(req, res, '$pull');

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
