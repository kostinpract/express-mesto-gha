const router = require('express').Router();

const { createCard, getCard, getAllCards } = require('../controllers/cards');

router.post('/', createCard);
router.get('/:cardId', getCard);
router.get('/', getAllCards);

module.exports = router;
