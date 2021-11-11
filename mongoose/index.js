const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, keepAlive: 1 }, (err) => {
  if (err) {
    return console.error('Mongodb failed to connect');
  }
  console.info('Mongodb connected successfully');
});

module.exports = mongoose;