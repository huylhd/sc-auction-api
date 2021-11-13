const Redlock = require('redlock');
const Redis = require('ioredis');

const client = new Redis({
  port: process.env.REDIS_PORT,
  host: process.env.REDIS_HOST,
  password: process.env.REDIS_PASSWORD,
  reconnectOnError(err) {
    return true;
  },
});
const redlock = new Redlock([client], {
  retryCount: 10
});
const redlockWithoutRetry = new Redlock([client], {
  retryCount: 0
});

const _ = require('lodash');
const BidModel = require('../models/bid.model');
const UserModel = require('../models/user.model');
const ProductModel = require('../models/product.model');

const placeABid = async (userId, productId, amount) => {
  const lock = await redlock.lock([`placeABid-${productId}`], 5000);
  const lock2 = await redlock.lock([`placeABid-${userId}`], 5000);
  try {
    const productInfo = await ProductModel.findOne({ id: productId, expiredAt: { $gt: new Date() } });

    if (!productInfo) {
      return "Product not existed or has expired";
    }

    if (productInfo.minimumAmount > amount) {
      return `The minimum amount allowed for this product is ${productInfo.minimumAmount}`;
    }

    const currentHighest = await BidModel.findOne({
      productId
    }).sort({ amount: -1 }).limit(1).lean();

    if (currentHighest?.amount >= amount) {
      return "You have to bid more then the highest bid";
    }

    const updated = await BidModel.updateOne({ userId, productId }, { $set: { amount } });
    if (updated.modifiedCount === 0) {
      const created = await BidModel.create({ userId, productId, amount });

      if (!created) {
        return "Bid failed";
      }
    }

    return null;
  } catch (err) {
    console.log(err);
    return "Something is wrong";
  }
  finally {
    await lock.unlock();
    await lock2.unlock();
  }
}

const checkAutoBid = async (productId) => {
  const lock = await redlockWithoutRetry.lock(`checkAutoBid${productId}`, 60000); // This checking cycle function only run once at a time
  try {
    const delay = (timeout) => new Promise(res => setTimeout(res, timeout));
    while (true) {
      await delay(1000);
      const currentHighest = await BidModel.findOne({
        productId
      }).sort({ amount: -1 }).limit(1).lean();

      const amountToBid = currentHighest?.amount + 1;

      let bidWithAutoOn = await BidModel.find({
        productId,
        isAutomated: true,
        userId: { $ne: currentHighest?.userId } // Find bidder with auto bid on that is NOT the current highest bidder
      }).lean();

      // Filter out users that reach their maximum amount
      bidWithAutoOn = (await Promise.all(
        bidWithAutoOn.map(async (bid) => ({
          ...bid,
          amountLimit: await getAmountLimit(bid.userId, bid.productId)
        })))
      ).filter(bid => bid.amountLimit >= amountToBid);

      if (_.isEmpty(bidWithAutoOn)) {
        break;
      }

      // Choose a random bidder to place bid
      const bidder = bidWithAutoOn[_.random(0, bidWithAutoOn.length - 1)];
      const bidErr = await placeABid(bidder.userId, bidder.productId, amountToBid);
      if (!bidErr) {
        console.log(`[Auto-bid] User ${bidder.userId} placed a $${amountToBid} bid on product ${bidder.productId}`)
      }
    }
  }
  finally {
    lock.unlock();
    console.log('Check auto bid ends')
  }
}

async function getAmountLimit(userId, productId) {
  const userActiveBids = await BidModel.aggregate([
    {
      $lookup: {
        from: 'Products',
        localField: 'productId',
        foreignField: 'id',
        as: 'product'
      }
    },
    {
      $match: {
        userId,
        productId: { $ne: productId },
        'product.expiredAt': { $gt: new Date() },
        isAutomated: true
      }
    },
  ])
  const userInfo = await UserModel.findOne({ id: userId }).lean();

  const amountLimit = userInfo.setting.maxAmount - userActiveBids.reduce((acc, cur) => acc + cur.amount, 0);

  return amountLimit;
}

exports.checkAutoBid = checkAutoBid;
exports.placeABid = placeABid;