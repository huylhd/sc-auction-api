const BidModel = require("../../models/bid.model");
const { placeABid, checkAutoBid } = require('../../services/bidding.service');

module.exports = {
  create: async (req, res) => {
    const { productId, amount } = req.body;

    const bidErr = await placeABid(req.authInfo.id, productId, amount);

    if (bidErr) {
      return res.status(200).json({
        success: false,
        message: bidErr
      });
    }

    checkAutoBid(productId).catch(err => err);
    return res.status(200).json({
      success: true
    });
  },

  toggleAutoBid: async (req, res) => {
    const { productId } = req.body;

    const bidInfo = await BidModel.findOne({
      userId: req.authInfo.id,
      productId
    }).lean();

    if (!bidInfo) {
      return res.status(200).json({
        success: false,
        message: 'Please place the bid before activate auto-bid'
      });
    }

    const updated = await BidModel.updateOne({
      userId: req.authInfo.id,
      productId
    }, {
      isAutomated: !bidInfo.isAutomated
    });

    if (updated.modifiedCount === 0) {
      throw Error('Something is wrong');
    }

    return res.status(200).json({
      success: true
    });
  }
}