const router = require('express').Router();
const { updateUserValidator } = require('../middlewares/validator');
const { updateProfile, getUser, getUsers } = require('../controllers/users');

router.get('/me', getUser);
router.get('/', getUsers);
router.patch('/me', updateUserValidator, updateProfile);

module.exports = router;
