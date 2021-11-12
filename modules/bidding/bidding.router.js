const express = require('express');
const authenticationMiddleware = require('../../middlewares/authentication.middleware');
const validationMiddleware = require('../../middlewares/validation.middleware');
const biddingController = require('./bidding.controller');
const biddingValidator = require('./bidding.validator');
const router = express.Router();

module.exports = (app) => {
  router.post('/', validationMiddleware(biddingValidator.create), biddingController.create);
  router.post('/autobid', validationMiddleware(biddingValidator.toggleAutoBid), biddingController.toggleAutoBid);

  app.use('/bidding', authenticationMiddleware(), router);
}