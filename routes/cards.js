const router = require('express').Router();

const {
  createCard,
  getCard,
  deleteCard,
  likeCard,
  dislikeCard,
  getAllCards,
} = require('../controllers/cards');

router.post('/', createCard);
router.get('/:cardId', getCard);
router.delete('/:cardId', deleteCard);
router.put('/:cardId/like', likeCard);
router.delete('/:cardId/likes', dislikeCard);
router.get('/', getAllCards);

module.exports = router;
