const router = require('express').Router();

const {
  createCard,
  getCard,
  deleteCard,
  changeLike,
  getAllCards,
} = require('../controllers/cards');

router.post('/', createCard);
router.get('/:cardId', getCard);
router.delete('/:cardId', getCard);
router.put('/:cardId/likes', changeLike);
router.delete('/:cardId/likes', changeLike);
router.get('/', getAllCards);

module.exports = router;
