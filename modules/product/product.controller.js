const ProductModel = require("../../models/product.model");

module.exports = {
  index: async (req, res) => {
    const productList = await ProductModel.find({ expiredAt: { $gt: new Date() } }).lean();

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

    const productInfo = await ProductModel.findOne({ id });

    if (!productInfo) {
      return res.status(200).json({
        success: false,
      });
    }

    return res.status(200).json({
      success: true,
      data: productInfo,
    });
  }
}