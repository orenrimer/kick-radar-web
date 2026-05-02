const express = require('express');
const { check } = require('express-validator');

const usersController = require('../controllers/users-controllers');
const fileUpload = require('../middleware/file-upload');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

router.post(
  '/signup',
  [
    check('name')
      .not()
      .isEmpty(),
    check('email')
      .normalizeEmail()
      .isEmail(),
    check('password').isLength({ min: 8, max: 12 })
  ],
  usersController.signup
);

router.post('/login', usersController.login);

router.get('/', usersController.getAllUsers);

router.get('/:uid', usersController.getUser);

router.use(checkAuth);

router.patch(
  '/:uid',
  fileUpload.single('image'),
  usersController.updateUser
);



module.exports = router;
