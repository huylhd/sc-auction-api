const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const glob = require('glob');
const errorHandlingMiddleware = require('./middlewares/error-handling.middleware');

// env
require("dotenv").config();

// mongoose
require('./mongoose');

const app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const api = express.Router();
app.use('/api/v1', api);

// importing routers
const routerFiles = glob.sync(path.join(__dirname, "modules/**/*.router.js"));
routerFiles.forEach(filePath => {
  require(filePath)(api);
  console.info(filePath.split('/').slice(-1)[0], 'imported')
});

// error handler
app.use(errorHandlingMiddleware);

module.exports = app;
