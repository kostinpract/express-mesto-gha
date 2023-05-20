const router = require('express').Router();

const {
  createUser,
  getUser,
  updateUser,
  getAllUsers,
} = require('../controllers/users');

router.post('/', createUser);
router.get('/:userId', getUser);
router.get('/', getAllUsers);
router.patch('/me', updateUser);
router.patch('/me/avatar', updateUser);

module.exports = router;
