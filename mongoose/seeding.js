require('dotenv').config();
require('../mongoose');
const crypto = require('crypto');
const _ = require('lodash');

const UserModel = require('../models/user.model');
const ProductModel = require('../models/product.model');

(async () => {
  try {
    let docs = Array(20).fill(0).map((val, i) => {
      return {
        id: crypto.randomBytes(16).toString('hex'),
        name: `Product ${i}`,
        description: `Description for product ${i}`,
        details: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed pharetra, diam id placerat semper, tortor sapien iaculis dui, ac sodales ex felis non nulla. Integer placerat eu enim a gravida. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Nulla eu felis elit. Etiam at tristique ante. Morbi in ornare nisl. Duis varius tempus velit, nec sollicitudin sapien viverra eget. Integer at tincidunt lectus, at semper erat. In hac habitasse platea dictumst. Aliquam feugiat lacus eu metus pharetra pulvinar. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.`,
        expiredAt: new Date(Date.now() + 1000 * 60 * 60 * _.random(1, 5))
      }
    })

    await Promise.all([
      UserModel.create({
        id: '1',
        username: 'user1'
      }),
      UserModel.create({
        id: '2',
        username: 'user2'
      }),
      ProductModel.insertMany(docs)
    ].map(p => p.catch(e => e)));
  }
  finally {
    process.exit(0);
  }
})()
