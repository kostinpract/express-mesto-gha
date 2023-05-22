const router = require('express').Router();

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
router.post('/', createCard);
router.get('/', getAllCards);

module.exports = router;
