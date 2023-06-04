const router = require('express').Router();

const {
  getUser,
  updateUser,
  getAllUsers,
} = require('../controllers/users');

router.patch('/me', updateUser);
router.patch('/me/avatar', updateUser);
router.get('/me', getUser);
router.get('/:userId', getUser);
router.get('/', getAllUsers);

module.exports = router;
