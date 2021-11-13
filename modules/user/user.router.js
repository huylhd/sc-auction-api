const express = require('express');
const authenticationMiddleware = require('../../middlewares/authentication.middleware');
const validationMiddleware = require('../../middlewares/validation.middleware');
const userController = require('./user.controller');
const userValidator = require('./user.validator');
const router = express.Router();

module.exports = (app) => {
  router.get('/setting', authenticationMiddleware(), userController.getSetting);
  router.post('/setting', authenticationMiddleware(), validationMiddleware(userValidator.updateSetting), userController.updateSetting);

  app.use('/users', router);
}