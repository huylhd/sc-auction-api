const UserModel = require("../../models/user.model")

module.exports = {
  getSetting: async (req, res) => {
    const userSetting = await UserModel.findOne({ id: req.authInfo.id }, '-_id setting').lean();

    return res.status(200).json({
      success: true,
      data: userSetting
    })
  },

  updateSetting: async (req, res) => {
    const { maxAmount, alertPerc } = req.body;
    const updated = await UserModel.updateOne({ id: req.authInfo.id }, {
      $set: {
        maxAmount, alertPerc
      }
    });

    return res.status(200).json({
      success: updated.modifiedCount > 0,
    })
  }
}