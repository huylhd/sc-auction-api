const express = require('express');
const authenticationMiddleware = require('../../middlewares/authentication.middleware');
const validationMiddleware = require('../../middlewares/validation.middleware');
const productController = require('./product.controller');
const productValidator = require('./product.validator');
const router = express.Router();

module.exports = (app) => {
  router.get('/', productController.index);
  router.get('/:id', authenticationMiddleware(), productController.detail);
  router.post('/', authenticationMiddleware('admin'), validationMiddleware(productValidator.create), productController.create);
  router.put('/:id', authenticationMiddleware('admin'), validationMiddleware(productValidator.update), productController.update);
  router.delete('/:id', authenticationMiddleware('admin'), validationMiddleware(productValidator.delete), productController.delete);

  app.use('/products', router);
}