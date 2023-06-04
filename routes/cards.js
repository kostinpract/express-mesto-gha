const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  createCard,
  getCard,
  deleteCard,
  likeCard,
  dislikeCard,
  getAllCards,
} = require('../controllers/cards');

router.put('/:cardId/likes', likeCard);
router.delete('/:cardId/likes', dislikeCard);
router.get('/:cardId', getCard);
router.delete('/:cardId', deleteCard);
router.post('/', celebrate({
  body: Joi.object().keys({
    namee: Joi.string().required().min(2).max(30),
    link: Joi.string().required(),
  }),
}), createCard);
router.get('/', getAllCards);

module.exports = router;
