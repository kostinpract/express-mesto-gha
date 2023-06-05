const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { REGEXPR } = require('../config');

const {
  createCard,
  getCard,
  deleteCard,
  likeCard,
  dislikeCard,
  getAllCards,
} = require('../controllers/cards');

router.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24),
  }),
}), likeCard);

router.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24),
  }),
}), dislikeCard);

router.get('/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24),
  }),
}), getCard);

router.delete('/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24),
  }),
}), deleteCard);

router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().regex(REGEXPR),
  }),
}), createCard);

router.get('/', getAllCards);

module.exports = router;
