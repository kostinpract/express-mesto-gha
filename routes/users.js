const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { REGEXPR } = require('../config');

const {
  getUser,
  updateUser,
  getAllUsers,
} = require('../controllers/users');

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateUser);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().regex(REGEXPR),
  }),
}), updateUser);

router.get('/me', getUser);

router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24),
  }),
}), getUser);

router.get('/', getAllUsers);

module.exports = router;
