const router = require('express').Router();

const {
  createCard,
  getCard,
  deleteCard,
  changeLike,
  getAllCards,
} = require('../controllers/cards');

router.post('/', createCard);
router.get('/', getAllCards);
router.get('/:cardId', getCard);
router.delete('/:cardId', deleteCard);
router.put('/:cardId/likes', changeLike);
router.delete('/:cardId/likes', changeLike);

module.exports = router;
