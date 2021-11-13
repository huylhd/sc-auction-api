const BidModel = require("../../models/bid.model");
const ProductModel = require("../../models/product.model");

module.exports = {
  index: async (req, res) => {
    const productList = await ProductModel.find({}).sort({ expiredAt: -1}).lean();

    return res.status(200).json({
      success: true,
      data: productList
    })
  },

  create: async (req, res) => {
    const { name, description, details, expiredAt, imageUrl } = req.body;
    const created = await ProductModel.create({
      name, description, details, expiredAt, imageUrl
    });

    if (!created) {
      return res.status(200).json({
        success: false,
      });
    }

    return res.status(201).json({
      success: true,
      id: created.id
    });
  },

  update: async (req, res) => {
    const { name, description, details, expiredAt, imageUrl } = req.body;
    const { id } = req.params;

    const updated = await ProductModel.updateOne({ id }, {
      name, description, details, expiredAt, imageUrl
    });

    if (updated.modifiedCount === 0) {
      return res.status(200).json({
        success: false,
      });
    }

    return res.status(200).json({
      success: true,
    });
  },

  delete: async (req, res) => {
    const { id } = req.params;

    const deleted = await ProductModel.deleteOne({ id });

    if (deleted.deletedCount === 0) {
      return res.status(400).json({
        success: false,
      });
    }

    return res.status(200).json({
      success: true,
    });
  },

  detail: async (req, res) => {
    const { id } = req.params;

    let productInfo = await ProductModel.aggregate([
      {
        $match: {
          id
        }
      },
      {
        $lookup: {
          from: 'Bids',
          localField: 'id',
          foreignField: 'productId',
          as: 'bids'
        }
      },
      {
        $addFields: {
          highestBid: {
            $first: {
              $filter: {
                input: '$bids',
                as: 'item',
                cond: {
                  $eq: ["$$item.amount", { $max: "$bids.amount" }]
                }
              }
            }
          }
        }
      },
      {
        $set: {
          highestBid: '$highestBid.amount'
        }
      },
      {
        $lookup: {
          from: 'Bids',
          let: { productId: '$id' },
          pipeline: [
            {
              $match: {
                $expr: { $and: [
                  { $eq: [ req.authInfo.id, "$userId" ] },
                  { $eq: [ "$productId", "$$productId" ] }
                ] }
              }
            }
          ],
          as: 'myBid'
        }
      },
      {
        $set: {
          myBid: {
            $first: '$myBid'
          }
        }
      },
      {
        $unset: ['bids']
      },
    ])

    if (!productInfo || !productInfo.length) {
      return res.status(200).json({
        success: false,
      });
    }

    productInfo = productInfo[0];
    productInfo.timeLeft = new Date(productInfo.expiredAt).getTime() - Date.now();
    if (productInfo.timeLeft < 0) productInfo.timeLeft = 0;

    return res.status(200).json({
      success: true,
      data: productInfo
    });
  }
}