const Card = require('../models/card');

const { BadRequestError } = require('../errors/bad-request-err');
const { NotFoundError } = require('../errors/not-found-err');
const { ForbiddenError } = require('../errors/forbidden-err');

const STATUS_CREATED = 201;

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.status(STATUS_CREATED).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Поля заполнены некорректно'));
        return;
      }
      next();
    });
};

module.exports.getCard = (req, res, next) => {
  Card.findById({ _id: req.params.cardId })
    .orFail(() => {
      next(new NotFoundError('Карточка с таким ID не найдена'));
    })
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Указан некорректный ID карточки'));
        return;
      }
      if (err.name === 'NotFound') {
        next(new NotFoundError('Карточка с таким ID не найдена'));
        return;
      }
      next();
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(() => {
      throw new NotFoundError('Карточка с таким ID не найдена');
    })
    .then((card) => {
      if (req.user._id === card.owner.toString()) {
        Card.deleteOne(card)
          .then(() => {
            res.send(card);
          })
          .catch(next);
      } else {
        next(new ForbiddenError('Нельзя удалять чужую карточку'));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Передан некорректный запрос для удаления'));
        return;
      }
      next(err);
    });
};

module.exports.getAllCards = (req, res, next) => {
  Card.find({})
    .then((card) => res.send(card))
    .catch(next);
};

const changeCard = (req, res, method, next) => {
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
        next(new NotFoundError('Карточка с таким ID не найдена'));
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Указан некорректный ID карточки'));
        return;
      }
      if (err.name === 'NotFound') {
        next(new NotFoundError('Карточка с таким ID не найдена'));
        return;
      }
      next();
    });
};

module.exports.likeCard = (req, res, next) => changeCard(req, res, '$addToSet', next);

module.exports.dislikeCard = (req, res, next) => changeCard(req, res, '$pull', next);
