const router = require('express').Router();

const {
  createUser,
  getUser,
  updateUser,
  getAllUsers,
} = require('../controllers/users');

router.patch('/me', updateUser);
router.patch('/me/avatar', updateUser);
router.post('/', createUser);
router.get('/', getAllUsers);
router.get('/:userId', getUser);

module.exports = router;
