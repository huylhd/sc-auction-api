const express = require('express');
const router = express.Router();

module.exports = (app) => {
  router.get('/hello', (req, res) => res.send('hello world'));
  
  app.use('/products', router);
}