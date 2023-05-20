/* eslint-disable no-console */
const Card = require('../models/card');

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => res.status(500).send({ message: `Произошла ошибка ${err}` }));
};

module.exports.getCard = (req, res) => {
  Card.findById({ _id: req.params.cardId })
    .then((card) => res.send({ data: card }))
    .catch((err) => res.status(500).send({ message: `Произошла ошибка ${err}` }));
};

module.exports.deleteCard = (req, res) => {
  Card.remove({ _id: req.params.cardId })
    .then(() => res.send({}))
    .catch((err) => res.status(500).send({ message: `Произошла ошибка ${err}` }));
};

module.exports.getAllCards = (req, res) => {
  Card.find({})
    .then((card) => res.send({ data: card }))
    .catch((err) => res.status(500).send({ message: `Произошла ошибка ${err}` }));
};

module.exports.changeLike = (req, res) => {
  Card.findById({ _id: req.params.cardId })
    .then((card) => {
      const currentUserLikeIndex = card.likes.indexOf(req.user._id);
      if (req.method === 'PUT' && currentUserLikeIndex === -1) {
        card.likes.push(req.user._id);
      } else if (req.method === 'DELETE' && currentUserLikeIndex >= 0) {
        card.likes.splice(currentUserLikeIndex, 1);
      }

      Card.findOneAndUpdate(
        { _id: req.params.cardId },
        card,
        {
          new: true, // обработчик then получит на вход обновлённую запись
          runValidators: true, // данные будут валидированы перед изменением
          upsert: true, // если пользователь не найден, он будет создан
        },
      )
        .then((updatedCard) => res.send({ data: updatedCard }))
        .catch((err) => res.status(500).send({ message: `Произошла ошибка ${err}` }));
    })
    .catch((err) => res.status(500).send({ message: `Произошла ошибка ${err}` }));
};
